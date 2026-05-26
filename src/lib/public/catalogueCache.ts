import type { Category } from "@/types/category";

// Survives reloads so the first paint of any catalog page can show the
// admin-uploaded category photos/icons immediately, instead of flashing the
// hard-coded /images/category.jpg fallback while Supabase responds.
const STORAGE_KEY = "med-x:public-categories:v1";

function isBrowser() {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function readCachedCategories(): Category[] | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) return null;
    return parsed as Category[];
  } catch {
    // Corrupt JSON or storage disabled — fall through to network.
    return null;
  }
}

export function writeCachedCategories(categories: Category[]): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  } catch {
    // Quota exceeded or storage disabled — silently ignore.
  }
}
