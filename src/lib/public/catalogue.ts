import { supabase } from "@/lib/supabase/client";
import type { Category, Subcategory } from "@/types/category";

type CategoryRow = {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  tags: string[] | null;
  position: number;
};

type SubcategoryRow = {
  id: string;
  category_id: string;
  slug: string;
  title: string;
  label: string | null;
  description: string | null;
  position: number;
};

/**
 * Fetch the public catalogue tree from Supabase. RLS allows anonymous SELECT
 * on rows where `is_active` is true, so no auth required.
 */
export async function fetchPublicCategories(): Promise<Category[]> {
  const [categoriesResult, subcategoriesResult] = await Promise.all([
    supabase
      .from("categories")
      .select("id, slug, title, description, image_url, tags, position")
      .order("position", { ascending: true }),
    supabase
      .from("subcategories")
      .select("id, category_id, slug, title, label, description, position")
      .order("position", { ascending: true }),
  ]);

  if (categoriesResult.error) throw categoriesResult.error;
  if (subcategoriesResult.error) throw subcategoriesResult.error;

  const categories = (categoriesResult.data ?? []) as CategoryRow[];
  const subcategories = (subcategoriesResult.data ?? []) as SubcategoryRow[];

  return categories.map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    image: row.image_url ?? undefined,
    tags: row.tags ?? undefined,
    subcategories: subcategories
      .filter((sub) => sub.category_id === row.id)
      .map<Subcategory>((sub) => ({
        id: sub.id,
        slug: sub.slug,
        title: sub.title,
        label: sub.label ?? undefined,
        description: sub.description ?? undefined,
      })),
  }));
}
