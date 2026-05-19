---
name: changelog-2026-05-19-phase2-etap-f
description: Phase 2 Etap F — full products CRUD wired to Supabase, live admin UI, seed catalogue
metadata:
  type: changelog
---

# 2026-05-19 — Phase 2 Etap F (full products CRUD)

## What shipped

### Catalogue seeded into Supabase
- `scripts/seed-catalogue.ts` — idempotent Node script (tsx) that signs in as admin via Supabase Auth, then upserts:
  - 9 `categories` (by slug)
  - 79 `subcategories` (by `category_id, slug`)
  - 18 `products` (by slug)
  - 72 `product_characteristics` (wipe-and-refill per product)
- Verified directly on server DB — exact counts match
- Re-run any time with `npx tsx scripts/seed-catalogue.ts`

### Admin chrome
- `AdminHeader` — shows admin email + Sign-out button (calls `supabase.auth.signOut`); supports custom right-side `actions` slot
- `AdminSidebar` — removed standalone "Подкатегории" item (subcategories are edited inside their parent category later)

### Data layer (`src/lib/admin/`)
- `types.ts` — DB row shapes (`CategoryRow`, `SubcategoryRow`, `ProductRow`, `ProductCharacteristicRow`, `ProductWithJoins`, `ProductInput`)
- `categories.ts` — `listCategories`, `listSubcategories`, `listSubcategoriesByCategory`
- `products.ts` — `listProducts` (search + category filter + count + pagination), `getProductWithCharacteristics`, `createProduct`, `updateProduct`, `deleteProduct`, `toggleProductActive`
- All functions are thin wrappers over `supabase.from('...').select|insert|update|delete()`. `or(...)` filter implements the `ilike` search across title/brand/manufacturer/slug.

### Live admin pages
- `AdminProductsListPage` — fully rewritten:
  - debounced text search (250 ms)
  - category dropdown filter
  - status badge with click-to-toggle visibility (`is_active`)
  - inline edit (link) and delete (with confirm dialog) actions
  - count visible in header
- `AdminProductFormPage` — new, used for both `/admin/products/new` and `/admin/products/:id`:
  - `react-hook-form` + `zod` resolver
  - sections: Основное, Тексты, Характеристики, Категория, Цена и наличие, Изображение, Видимость
  - characteristics editor — dynamic rows via `useFieldArray`, add/remove
  - category select drives subcategory select (latter is disabled until category chosen, resets on change)
  - price field accepts free-form text, coerced to number-or-null by the zod schema
  - on create — toast + redirect to edit URL of the newly created product
  - on update — toast in place
- `ConfirmDialog` — reusable destructive-confirm modal over Radix Dialog with Tailwind v4 animations
- `AdminToaster` — `sonner` configured to match admin tokens, mounted at app root

### Wiring
- `src/App.tsx` — added `/admin/products/new` + `/admin/products/:id` routes; mounted `<AdminToaster/>` at top level

## Verification (manual, via Vite dev proxy → server)
- All 6 admin routes return 200
- JWT issued from `/__sb__/auth/v1/token`
- Read with FK joins (`select=*, category:categories(...), subcategory:subcategories(...)`) returns correct nested objects
- Full CRUD cycle through proxy:
  1. POST product → `[{id:...}]` returned
  2. PATCH product → `204 No Content`
  3. GET product → updated `title` confirmed
  4. DELETE product → `204 No Content`
  5. Final count of `products` → back to 18 ✓

## Build size
- 4.07s, **787 KB JS** (gzip 224 KB), 78 KB CSS (gzip 13 KB)
- Above 500 KB threshold — code-splitting will be a small refactor in Etap I (lazy admin chunk)

## Files touched
**Added**
- `scripts/seed-catalogue.ts`
- `src/lib/admin/types.ts`, `categories.ts`, `products.ts`
- `src/components/admin/ui/toast.tsx`, `confirm-dialog.tsx`
- `src/pages/admin/AdminProductFormPage.tsx`

**Modified**
- `src/components/admin/AdminHeader.tsx` (email + sign-out + actions slot)
- `src/components/admin/AdminSidebar.tsx` (drop standalone subcategories item)
- `src/pages/admin/AdminProductsListPage.tsx` (live data, filters, delete, toggle)
- `src/App.tsx` (form routes, toaster)
- `package.json` (`tsx` devDep)

## Not done
- **Etap G** — Excel import (will port `arcadia-meb.ru/src/components/admin/ProductImportDialog.tsx` and adapt to our slimmer schema)
- **Etap H** — image upload to `product-images` bucket
- **Etap I** — deploy SPA (build dist → upload → switch nginx)
- Manage categories/subcategories CRUD (currently read-only — products can reference them but the admin can't create new categories until later)

## Related
- [[admin-phase2-plan]]
- [[data-model]]
- [[adr-006-admin-auth-supabase]]
