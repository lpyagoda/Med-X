import { supabase } from "@/lib/supabase/client";
import type { CategoryRow, SubcategoryRow } from "@/lib/admin/types";

export type CategoryInput = {
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  tags: string[];
  position: number;
  is_active: boolean;
};

export type SubcategoryInput = {
  slug: string;
  title: string;
  label: string | null;
  description: string | null;
  position: number;
  is_active: boolean;
};

export async function listCategories(): Promise<CategoryRow[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as CategoryRow[];
}

export async function listSubcategories(): Promise<SubcategoryRow[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SubcategoryRow[];
}

export async function listSubcategoriesByCategory(
  categoryId: string,
): Promise<SubcategoryRow[]> {
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("position", { ascending: true });
  if (error) throw error;
  return (data ?? []) as SubcategoryRow[];
}

export async function getCategoryById(id: string): Promise<CategoryRow> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function createCategory(input: CategoryInput): Promise<CategoryRow> {
  const { data, error } = await supabase
    .from("categories")
    .insert(input)
    .select("*")
    .single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<CategoryRow> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as CategoryRow;
}

export async function deleteCategory(id: string): Promise<void> {
  // products has FK on delete restrict → DB will refuse to delete a category
  // that has products. Bubbling the error message up to the UI is fine.
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function countProductsByCategory(): Promise<Record<string, number>> {
  const { data, error } = await supabase.from("products").select("category_id");
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { category_id: string }[]) {
    counts[row.category_id] = (counts[row.category_id] ?? 0) + 1;
  }
  return counts;
}

export async function countProductsBySubcategory(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("products")
    .select("subcategory_id")
    .not("subcategory_id", "is", null);
  if (error) throw error;
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as { subcategory_id: string | null }[]) {
    if (!row.subcategory_id) continue;
    counts[row.subcategory_id] = (counts[row.subcategory_id] ?? 0) + 1;
  }
  return counts;
}

export async function createSubcategory(
  categoryId: string,
  input: SubcategoryInput,
): Promise<SubcategoryRow> {
  const { data, error } = await supabase
    .from("subcategories")
    .insert({ ...input, category_id: categoryId })
    .select("*")
    .single();
  if (error) throw error;
  return data as SubcategoryRow;
}

export async function updateSubcategory(
  id: string,
  input: SubcategoryInput,
): Promise<SubcategoryRow> {
  const { data, error } = await supabase
    .from("subcategories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data as SubcategoryRow;
}

export async function deleteSubcategory(id: string): Promise<void> {
  const { error } = await supabase.from("subcategories").delete().eq("id", id);
  if (error) throw error;
}
