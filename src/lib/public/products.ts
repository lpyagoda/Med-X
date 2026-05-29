import { supabase } from "@/lib/supabase/client";
import type { Product } from "@/types/product";

type ProductRow = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  manufacturer: string;
  image_url: string | null;
  price: number | string | null;
  price_label: string;
  short_description: string;
  description: string;
  availability: "in-stock" | "on-order" | null;
  availability_label: string | null;
  category: { id: string; slug: string; title: string } | null;
  subcategory: { id: string; slug: string; title: string } | null;
  brandRef: {
    id: string;
    slug: string;
    name: string;
    manufacturer: string;
    logo_url: string | null;
  } | null;
};

type CharacteristicRow = {
  product_id: string;
  position: number;
  name: string;
  value: string;
};

type ImageRow = {
  product_id: string;
  url: string;
  is_main: boolean;
  position: number;
};

const PUBLIC_SELECT = `
  id, slug, title, brand, manufacturer, image_url, price, price_label,
  short_description, description, availability, availability_label,
  category:categories!products_category_id_fkey ( id, slug, title ),
  subcategory:subcategories!products_subcategory_id_fkey ( id, slug, title ),
  brandRef:brands!products_brand_id_fkey ( id, slug, name, manufacturer, logo_url )
`;

function rowToProduct(
  row: ProductRow,
  characteristics: CharacteristicRow[],
  images: ImageRow[],
): Product {
  const sortedImages = [...images].sort((a, b) => a.position - b.position);
  const main = sortedImages.find((image) => image.is_main) ?? sortedImages[0];
  const productImages = sortedImages.length
    ? sortedImages.map((image) => ({ url: image.url, isMain: image.is_main }))
    : row.image_url
      ? [{ url: row.image_url, isMain: true }]
      : [];

  const price = row.price == null ? null : Number(row.price);

  // Prefer the canonical values from the linked brand record (admin manages
  // them in one place); fall back to the denormalised text on the product.
  const brandName = row.brandRef?.name || row.brand;
  const manufacturer = row.brandRef?.manufacturer || row.manufacturer;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    brand: brandName,
    brandSlug: row.brandRef?.slug,
    brandLogo: row.brandRef?.logo_url ?? null,
    manufacturer,
    image: main?.url ?? row.image_url ?? "",
    images: productImages,
    price: Number.isFinite(price as number) ? (price as number) : null,
    priceLabel: row.price_label || "По запросу",
    shortDescription: row.short_description,
    description: row.description,
    characteristics: [...characteristics]
      .sort((a, b) => a.position - b.position)
      .map((row) => ({ name: row.name, value: row.value })),
    categoryName: row.category?.title ?? "",
    categorySlug: row.category?.slug ?? "",
    subcategoryName: row.subcategory?.title ?? undefined,
    subcategorySlug: row.subcategory?.slug ?? undefined,
    availability: row.availability ?? undefined,
    availabilityLabel: row.availability_label ?? undefined,
  };
}

async function hydrateProduct(productRow: ProductRow): Promise<Product> {
  const [characteristicsResult, imagesResult] = await Promise.all([
    supabase
      .from("product_characteristics")
      .select("product_id, position, name, value")
      .eq("product_id", productRow.id)
      .order("position", { ascending: true }),
    supabase
      .from("product_images")
      .select("product_id, url, is_main, position")
      .eq("product_id", productRow.id)
      .order("position", { ascending: true }),
  ]);

  const characteristics = (characteristicsResult.data ?? []) as CharacteristicRow[];
  const images = imagesResult.error ? [] : ((imagesResult.data ?? []) as ImageRow[]);

  return rowToProduct(productRow, characteristics, images);
}

/**
 * Public list of active products, sorted the same way the admin sees them
 * (position asc, then newest first as a deterministic tiebreak). Returns
 * lightweight products — galleries/characteristics are hydrated only on
 * the product detail page.
 */
export async function fetchPublicProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_SELECT)
    .eq("is_active", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data ?? []) as unknown as ProductRow[]).map((row) => rowToProduct(row, [], []));
}

export async function fetchPublicProductBySlug(slug: string): Promise<Product | null> {
  const { data: productData, error: productError } = await supabase
    .from("products")
    .select(PUBLIC_SELECT)
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (productError) throw productError;
  if (!productData) return null;
  return hydrateProduct(productData as unknown as ProductRow);
}

/**
 * Запасной матч по названию. Используется, когда slug в URL — старый статический,
 * а в БД у того же товара уже другой slug (после re-seed / переноса данных).
 */
export async function fetchPublicProductByTitle(title: string): Promise<Product | null> {
  if (!title.trim()) return null;
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_SELECT)
    .eq("is_active", true)
    .ilike("title", title.trim())
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return hydrateProduct(data as unknown as ProductRow);
}

export async function fetchRelatedProducts(
  categorySlug: string,
  exceptProductId: string,
  limit = 4,
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(PUBLIC_SELECT)
    .eq("is_active", true)
    .neq("id", exceptProductId)
    .limit(24);

  if (error) throw error;
  const rows = ((data ?? []) as unknown as ProductRow[]).filter(
    (row) => row.category?.slug === categorySlug,
  );

  return rows
    .slice(0, limit)
    .map((row) => rowToProduct(row, [], []));
}
