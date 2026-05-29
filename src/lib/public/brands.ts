import { supabase } from "@/lib/supabase/client";
import type { Brand } from "@/types/brand";

type BrandRow = {
  id: string;
  slug: string;
  name: string;
  manufacturer: string;
  logo_url: string | null;
  description: string;
  position: number;
};

/**
 * Public list of active brands with a live count of their active products.
 * RLS allows anonymous SELECT on active rows, so no auth required. Brands are
 * returned sorted by `position` (admin-controlled), then name.
 */
export async function fetchPublicBrands(): Promise<Brand[]> {
  const [brandsResult, productsResult] = await Promise.all([
    supabase
      .from("brands")
      .select("id, slug, name, manufacturer, logo_url, description, position")
      .order("position", { ascending: true })
      .order("name", { ascending: true }),
    supabase.from("products").select("brand_id").eq("is_active", true),
  ]);

  if (brandsResult.error) throw brandsResult.error;

  const counts: Record<string, number> = {};
  if (!productsResult.error) {
    for (const row of (productsResult.data ?? []) as { brand_id: string | null }[]) {
      if (!row.brand_id) continue;
      counts[row.brand_id] = (counts[row.brand_id] ?? 0) + 1;
    }
  }

  return ((brandsResult.data ?? []) as BrandRow[]).map((row) => ({
    id: row.id,
    slug: row.slug,
    name: row.name,
    manufacturer: row.manufacturer,
    logo: row.logo_url,
    description: row.description,
    productCount: counts[row.id] ?? 0,
  }));
}
