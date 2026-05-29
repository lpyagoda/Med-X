import { supabase } from "@/lib/supabase/client";
import type { BrandRow } from "@/lib/admin/types";

export type BrandInput = {
  slug: string;
  name: string;
  manufacturer: string;
  logo_url: string | null;
  description: string;
  position: number;
  is_active: boolean;
};

export async function listBrands(): Promise<BrandRow[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("position", { ascending: true })
    .order("name", { ascending: true });
  if (error) throw error;
  return (data ?? []) as BrandRow[];
}

export async function getBrandById(id: string): Promise<BrandRow> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as BrandRow;
}

export async function createBrand(input: BrandInput): Promise<BrandRow> {
  const { data, error } = await supabase
    .from("brands")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as BrandRow;
}

export async function updateBrand(id: string, input: BrandInput): Promise<BrandRow> {
  const { data, error } = await supabase
    .from("brands")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as BrandRow;
}

export async function deleteBrand(id: string): Promise<void> {
  // products.brand_id has ON DELETE SET NULL, so deleting a brand simply
  // unlinks its products (they keep their denormalised brand/manufacturer text).
  const { error } = await supabase.from("brands").delete().eq("id", id);
  if (error) throw error;
}

export async function countProductsByBrand(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("products")
    .select("brand_id")
    .not("brand_id", "is", null);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { brand_id: string | null }[]) {
    if (!row.brand_id) continue;
    counts[row.brand_id] = (counts[row.brand_id] ?? 0) + 1;
  }
  return counts;
}
