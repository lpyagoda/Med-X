import { supabase } from "@/lib/supabase/client";
import { generateUniqueSlug } from "@/lib/admin/slug";
import type {
  ProductCharacteristicRow,
  ProductImageRow,
  ProductInput,
  ProductRow,
  ProductWithJoins,
} from "@/lib/admin/types";

const PRODUCT_LIST_SELECT = `
  *,
  category:categories!products_category_id_fkey ( id, slug, title ),
  subcategory:subcategories!products_subcategory_id_fkey ( id, slug, title ),
  brandRef:brands!products_brand_id_fkey ( id, slug, name, manufacturer )
`;

export type ProductSortKey = "position" | "title" | "brand" | "price" | "created_at";

export type ListProductsArgs = {
  search?: string;
  categoryId?: string;
  brandId?: string;
  availability?: "in-stock" | "on-order";
  status?: "active" | "hidden";
  sortKey?: ProductSortKey;
  sortAsc?: boolean;
  limit?: number;
  offset?: number;
};

export type ListProductsResult = {
  rows: ProductWithJoins[];
  total: number;
};

export async function listProducts(
  args: ListProductsArgs = {},
): Promise<ListProductsResult> {
  const limit = args.limit ?? 50;
  const offset = args.offset ?? 0;

  let query = supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT, { count: "exact" });

  // Sorting. Default keeps the historical order (position asc, newest first).
  if (args.sortKey && args.sortKey !== "position") {
    query = query.order(args.sortKey, {
      ascending: args.sortAsc ?? true,
      nullsFirst: false,
    });
  } else {
    query = query
      .order("position", { ascending: args.sortAsc ?? true })
      .order("created_at", { ascending: false });
  }

  if (args.search?.trim()) {
    const term = args.search.trim();
    query = query.or(
      `title.ilike.%${term}%,brand.ilike.%${term}%,manufacturer.ilike.%${term}%,slug.ilike.%${term}%`,
    );
  }
  if (args.categoryId) {
    query = query.eq("category_id", args.categoryId);
  }
  if (args.brandId) {
    query = query.eq("brand_id", args.brandId);
  }
  if (args.availability) {
    query = query.eq("availability", args.availability);
  }
  if (args.status) {
    query = query.eq("is_active", args.status === "active");
  }

  const { data, count, error } = await query.range(offset, offset + limit - 1);
  if (error) throw error;
  return {
    rows: (data ?? []) as unknown as ProductWithJoins[],
    total: count ?? 0,
  };
}

export async function getProductWithDetails(id: string) {
  const productPromise = supabase
    .from("products")
    .select(PRODUCT_LIST_SELECT)
    .eq("id", id)
    .single();
  const characteristicsPromise = supabase
    .from("product_characteristics")
    .select("*")
    .eq("product_id", id)
    .order("position", { ascending: true });
  const imagesPromise = supabase
    .from("product_images")
    .select("*")
    .eq("product_id", id)
    .order("position", { ascending: true });

  const [productResult, characteristicsResult, imagesResult] = await Promise.all([
    productPromise,
    characteristicsPromise,
    imagesPromise,
  ]);
  if (productResult.error) throw productResult.error;
  if (characteristicsResult.error) throw characteristicsResult.error;
  // product_images may not exist yet on a non-migrated DB — treat as empty
  const images = imagesResult.error
    ? []
    : ((imagesResult.data ?? []) as ProductImageRow[]);

  return {
    product: productResult.data as unknown as ProductWithJoins,
    characteristics: (characteristicsResult.data ?? []) as ProductCharacteristicRow[],
    images,
  };
}

// Alias for backwards-compat with code that still uses the old name.
export const getProductWithCharacteristics = getProductWithDetails;

async function syncCharacteristics(
  productId: string,
  rows: { name: string; value: string }[],
): Promise<void> {
  const { error: deleteError } = await supabase
    .from("product_characteristics")
    .delete()
    .eq("product_id", productId);
  if (deleteError) throw deleteError;

  if (rows.length === 0) return;

  const payload = rows.map((row, index) => ({
    product_id: productId,
    position: index,
    name: row.name,
    value: row.value,
  }));
  const { error: insertError } = await supabase
    .from("product_characteristics")
    .insert(payload);
  if (insertError) throw insertError;
}

function isMissingTableError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  // PostgREST: "PGRST205" for unknown table, "42P01" for relation does not exist.
  if (error.code === "PGRST205" || error.code === "42P01") return true;
  return /relation .* does not exist/i.test(error.message ?? "");
}

async function syncImages(
  productId: string,
  images: ProductInput["images"],
): Promise<void> {
  // Wipe-and-refill. Cheap for ≤10 rows, avoids id-tracking complexity.
  const { error: deleteError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", productId);
  if (deleteError) {
    if (isMissingTableError(deleteError)) return; // gallery table not migrated yet — silently skip
    throw deleteError;
  }

  if (images.length === 0) return;

  const payload = images.map((image, index) => ({
    product_id: productId,
    url: image.url,
    is_main: image.is_main,
    position: index,
  }));
  const { error: insertError } = await supabase
    .from("product_images")
    .insert(payload);
  if (insertError) {
    if (isMissingTableError(insertError)) return;
    throw insertError;
  }
}

function pickMainImageUrl(images: ProductInput["images"]): string | null {
  if (images.length === 0) return null;
  const main = images.find((image) => image.is_main);
  return main?.url ?? images[0]?.url ?? null;
}

export async function createProduct(input: ProductInput): Promise<ProductRow> {
  const { characteristics, images, ...productFields } = input;

  // Always keep products.image_url in sync with the chosen main image
  // (denormalised cache so public reads stay simple).
  const productPayload = {
    ...productFields,
    image_url: pickMainImageUrl(images) ?? productFields.image_url,
  };

  const { data: created, error: insertError } = await supabase
    .from("products")
    .insert(productPayload)
    .select("*")
    .single();
  if (insertError) throw insertError;
  const product = created as ProductRow;

  await syncCharacteristics(product.id, characteristics);
  await syncImages(product.id, images);

  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput,
): Promise<ProductRow> {
  const { characteristics, images, ...productFields } = input;

  const productPayload = {
    ...productFields,
    image_url: pickMainImageUrl(images) ?? productFields.image_url,
  };

  const { data: updated, error: updateError } = await supabase
    .from("products")
    .update(productPayload)
    .eq("id", id)
    .select("*")
    .single();
  if (updateError) throw updateError;
  const product = updated as ProductRow;

  await syncCharacteristics(id, characteristics);
  await syncImages(id, images);

  return product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function toggleProductActive(
  id: string,
  isActive: boolean,
): Promise<void> {
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .eq("id", id);
  if (error) throw error;
}

export async function bulkSetProductsActive(
  ids: string[],
  isActive: boolean,
): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase
    .from("products")
    .update({ is_active: isActive })
    .in("id", ids);
  if (error) throw error;
}

export async function bulkDeleteProducts(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  const { error } = await supabase.from("products").delete().in("id", ids);
  if (error) throw error;
}

/**
 * Deep-copies a product (фото + характеристики) into a new draft. The copy is
 * created hidden (is_active=false) with a "— копия" suffix so it never leaks to
 * the public site before the admin reviews it. Returns the new product row.
 */
export async function duplicateProduct(id: string): Promise<ProductRow> {
  const { product, characteristics, images } = await getProductWithDetails(id);
  const slug = await generateUniqueSlug({
    table: "products",
    source: `${product.title} kopiya`,
  });
  return createProduct({
    slug,
    title: `${product.title} — копия`,
    brand: product.brand,
    manufacturer: product.manufacturer,
    image_url: product.image_url,
    price: product.price,
    price_label: product.price_label,
    short_description: product.short_description,
    description: product.description,
    category_id: product.category_id,
    subcategory_id: product.subcategory_id,
    brand_id: product.brand_id,
    availability: product.availability,
    availability_label: product.availability_label,
    is_active: false,
    characteristics: characteristics.map((row) => ({ name: row.name, value: row.value })),
    images: images.map((row, index) => ({
      url: row.url,
      is_main: row.is_main,
      position: index,
    })),
  });
}
