import { supabase } from "@/lib/supabase/client";

const RU_TO_LAT: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
  з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
  п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
  ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu",
  я: "ya",
};

export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((char) => (char in RU_TO_LAT ? RU_TO_LAT[char] : char))
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

type Table = "categories" | "subcategories" | "products";

type GenerateUniqueSlugArgs = {
  table: Table;
  source: string;
  excludeId?: string;
  scopeColumn?: string;
  scopeValue?: string;
};

/**
 * Return a slug derived from `source` that doesn't collide with any existing row
 * in `table`. If `excludeId` is given, the row with that id is allowed to keep
 * its current slug. Use `scopeColumn`/`scopeValue` to constrain uniqueness to
 * a parent group (e.g. subcategories unique within a category_id).
 */
export async function generateUniqueSlug(
  args: GenerateUniqueSlugArgs,
): Promise<string> {
  const base = slugify(args.source);
  if (!base) {
    throw new Error("Не удалось сгенерировать slug — название содержит только спецсимволы");
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = attempt === 0 ? base : `${base}-${attempt + 1}`;
    let query = supabase
      .from(args.table)
      .select("id")
      .eq("slug", candidate)
      .limit(1);
    if (args.scopeColumn && args.scopeValue !== undefined) {
      query = query.eq(args.scopeColumn, args.scopeValue);
    }
    if (args.excludeId) {
      query = query.neq("id", args.excludeId);
    }
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) return candidate;
  }
  throw new Error("Не удалось подобрать уникальный slug после 100 попыток");
}
