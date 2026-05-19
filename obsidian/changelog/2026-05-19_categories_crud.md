---
name: changelog-2026-05-19-categories-crud
description: Categories CRUD page + inline subcategories editor — admin can now manage the catalogue tree
metadata:
  type: changelog
---

# 2026-05-19 — Categories CRUD

## What shipped

### Data layer (`src/lib/admin/categories.ts`)
- `createCategory`, `updateCategory`, `deleteCategory` — straight inserts/updates/deletes
- `getCategoryById(id)` — single-row fetch
- `countProductsByCategory()` — returns `{ category_id: count }` map for the list page
- `replaceSubcategories(categoryId, inputs)` — diffs incoming list against DB:
  - keeps existing rows (matched by slug), updates them by id
  - inserts new ones
  - deletes removed ones
  - reassigns `position` to match incoming order
  - safe to call inside the form's "save" action — one call per save

### Pages
- **`AdminCategoriesListPage`** — table with: title + description preview, slug, # subcategories, # products, active badge, edit/delete actions. Delete confirms with a hint when products exist (DB has `on delete restrict` for products → user-friendly error path).
- **`AdminCategoryFormPage`** — used for `/admin/categories/new` and `/admin/categories/:id`:
  - Основное: title, slug, position, description, tags (comma-separated), image_url
  - Подкатегории: dynamic list with slug + title + label inputs and remove button; reorder by editing position field (drag will come later if needed)
  - Видимость: `is_active` checkbox
  - Save = `createCategory|updateCategory` followed by `replaceSubcategories`
  - On create: redirect to `/admin/categories/:newId`

### Routing
- `App.tsx` — added two lazy routes:
  - `/admin/categories` → `AdminCategoriesListPage`
  - `/admin/categories/new` and `/admin/categories/:id` → `AdminCategoryFormPage`
- Removed now-unused `AdminStubPage` component + import

## Build size
- 5.37s, public bundle still **722 KB / 205 KB gzip** (the new admin pages added two small lazy chunks: list 5 KB, form 8 KB)
- Old AdminProductsImportPage chunk (xlsx) unchanged at 439 KB lazy

## Verified end-to-end (curl through nginx proxy)
- `/admin/categories` and `/admin/categories/new` return 200
- CREATE category `crud-test` → 201 with id
- UPSERT 2 subcategories with that `category_id` → 201
- READ subcategories sorted by position → 2 rows
- DELETE category → 204 (cascade removed subcategories)
- Final category count back to 9 ✓

## Files touched
**Added**
- `src/pages/admin/AdminCategoriesListPage.tsx`
- `src/pages/admin/AdminCategoryFormPage.tsx`

**Modified**
- `src/lib/admin/categories.ts` — added CRUD + `replaceSubcategories` + counts
- `src/App.tsx` — added category routes, removed AdminStubPage import

**Removed**
- `src/pages/admin/AdminStubPage.tsx` — no longer referenced anywhere

## Deployed
- `dist/` rebuilt, scp'd to `/var/www/med-x/dist/` on `188.225.86.146`
- nginx vhost on port 3040 — same setup as before, no config changes needed

## What still isn't here (later if needed)
- Drag-and-drop reorder for subcategories (currently by `position` integer field). For 79 rows this is acceptable; a real DnD will land if the customer asks.
- Manual "transfer products to another category" before delete — currently DB refuses cascading delete on FK and we surface a clear message. Could add a dedicated UI when the need is real.

## Related
- [[admin-phase2-plan]]
- [[data-model]]
