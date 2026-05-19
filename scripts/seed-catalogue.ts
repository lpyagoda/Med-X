/**
 * Med-X — seed the Supabase catalogue from the static `src/data/*.ts` snapshots.
 *
 *   npx tsx scripts/seed-catalogue.ts
 *
 * Idempotent — uses upserts keyed by slug. Safe to re-run.
 * Requires .env.local + an admin user (admin@med-x.local). Talks to Supabase
 * through the same /__sb__ proxy used by the SPA, which means it relies on the
 * server's nginx vhost being up.
 */
import { createClient } from "@supabase/supabase-js";
import { categories } from "../src/data/categories";
import { products } from "../src/data/products";

const SUPABASE_URL =
  process.env.SEED_SUPABASE_URL ??
  process.env.VITE_SUPABASE_URL ??
  "http://188.225.86.146:3040/__sb__";
const SUPABASE_KEY =
  process.env.SEED_SUPABASE_KEY ??
  process.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
  "sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? "admin@med-x.local";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? "admin";

// Resolve relative URL to absolute (supabase-js doesn't follow relative paths from Node).
const resolvedUrl = SUPABASE_URL.startsWith("/")
  ? `http://188.225.86.146:3040${SUPABASE_URL}`
  : SUPABASE_URL;

const supabase = createClient(resolvedUrl, SUPABASE_KEY, {
  auth: { persistSession: false },
});

async function main() {
  console.log(`→ Auth as ${ADMIN_EMAIL}…`);
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (authError) throw new Error(`auth: ${authError.message}`);

  // ---- categories ---------------------------------------------------------
  console.log(`→ Upserting ${categories.length} categories…`);
  const categoryRows = categories.map((category, index) => ({
    slug: category.slug,
    title: category.title,
    description: category.description,
    image_url: category.image ?? null,
    tags: category.tags ?? [],
    position: index,
    is_active: true,
  }));

  const { data: insertedCategories, error: categoriesError } = await supabase
    .from("categories")
    .upsert(categoryRows, { onConflict: "slug" })
    .select("id, slug");
  if (categoriesError) throw new Error(`categories: ${categoriesError.message}`);

  const categorySlugToId = new Map<string, string>(
    (insertedCategories ?? []).map((row) => [row.slug, row.id]),
  );
  console.log(`  ok — ${categorySlugToId.size} categories`);

  // ---- subcategories ------------------------------------------------------
  const subcategoryRows: Array<{
    category_id: string;
    slug: string;
    title: string;
    label: string | null;
    description: string | null;
    position: number;
    is_active: boolean;
  }> = [];

  for (const category of categories) {
    const categoryId = categorySlugToId.get(category.slug);
    if (!categoryId) continue;
    (category.subcategories ?? []).forEach((subcategory, index) => {
      subcategoryRows.push({
        category_id: categoryId,
        slug: subcategory.slug,
        title: subcategory.title,
        label: subcategory.label ?? null,
        description: subcategory.description ?? null,
        position: index,
        is_active: true,
      });
    });
  }

  console.log(`→ Upserting ${subcategoryRows.length} subcategories…`);
  const { data: insertedSubcategories, error: subcategoriesError } = await supabase
    .from("subcategories")
    .upsert(subcategoryRows, { onConflict: "category_id,slug" })
    .select("id, category_id, slug");
  if (subcategoriesError) throw new Error(`subcategories: ${subcategoriesError.message}`);

  const subcategoryKeyToId = new Map<string, string>(
    (insertedSubcategories ?? []).map((row) => [
      `${row.category_id}::${row.slug}`,
      row.id,
    ]),
  );
  console.log(`  ok — ${subcategoryKeyToId.size} subcategories`);

  // ---- products -----------------------------------------------------------
  console.log(`→ Upserting ${products.length} products…`);
  const productRows = products.map((product, index) => {
    const categoryId = categorySlugToId.get(product.categorySlug);
    if (!categoryId) {
      throw new Error(
        `product "${product.slug}": unknown categorySlug "${product.categorySlug}"`,
      );
    }
    let subcategoryId: string | null = null;
    if (product.subcategorySlug) {
      subcategoryId =
        subcategoryKeyToId.get(`${categoryId}::${product.subcategorySlug}`) ?? null;
    }
    return {
      slug: product.slug,
      title: product.title,
      brand: product.brand,
      manufacturer: product.manufacturer,
      image_url: product.image,
      price: product.price,
      price_label: product.priceLabel,
      short_description: product.shortDescription,
      description: product.description,
      category_id: categoryId,
      subcategory_id: subcategoryId,
      availability: product.availability ?? "on-order",
      availability_label: product.availabilityLabel ?? null,
      position: index,
      is_active: true,
    };
  });

  const { data: insertedProducts, error: productsError } = await supabase
    .from("products")
    .upsert(productRows, { onConflict: "slug" })
    .select("id, slug");
  if (productsError) throw new Error(`products: ${productsError.message}`);

  const productSlugToId = new Map<string, string>(
    (insertedProducts ?? []).map((row) => [row.slug, row.id]),
  );
  console.log(`  ok — ${productSlugToId.size} products`);

  // ---- product_characteristics -------------------------------------------
  console.log("→ Replacing characteristics rows…");
  // No natural unique key beyond (product_id, position), so simplest is wipe-and-refill.
  const productIds = [...productSlugToId.values()];
  if (productIds.length > 0) {
    const { error: deleteError } = await supabase
      .from("product_characteristics")
      .delete()
      .in("product_id", productIds);
    if (deleteError) throw new Error(`characteristics delete: ${deleteError.message}`);
  }

  const characteristicRows: Array<{
    product_id: string;
    position: number;
    name: string;
    value: string;
  }> = [];
  for (const product of products) {
    const productId = productSlugToId.get(product.slug);
    if (!productId) continue;
    product.characteristics.forEach((characteristic, index) => {
      characteristicRows.push({
        product_id: productId,
        position: index,
        name: characteristic.name,
        value: characteristic.value,
      });
    });
  }
  if (characteristicRows.length > 0) {
    const { error: characteristicError } = await supabase
      .from("product_characteristics")
      .insert(characteristicRows);
    if (characteristicError)
      throw new Error(`characteristics insert: ${characteristicError.message}`);
  }
  console.log(`  ok — ${characteristicRows.length} characteristic rows`);

  console.log("✓ seed complete");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
