---
name: changelog-2026-05-19-phase2-etaps-g-h-i
description: Phase 2 Etap G (Excel import) + H (image upload to storage) + I (SPA deployed on server)
metadata:
  type: changelog
---

# 2026-05-19 — Phase 2 Etaps G + H + I

## Etap G — Excel import
- Added `xlsx` (0.18.5)
- `src/lib/admin/excel-import.ts` — pure parse-and-validate library:
  - `parseWorkbook(buffer)` — reads first sheet, normalises headers, runs zod per row, returns `{ headers, rows, unmappedColumns, okCount, errorCount }`
  - `buildImportPlan(parsed, categories, subcategories)` — resolves `category_slug` / `subcategory_slug` → ids, separates rows into `ready` and `problems` with human-readable error messages
  - `runImport(plan)` — upserts ready rows into `products` via supabase-js (`onConflict: "slug"`)
  - `buildTemplateWorkbook()` — generates a downloadable `.xlsx` with one example row
- `src/pages/admin/AdminProductsImportPage.tsx` — 3-step wizard:
  1. **Upload**: drag-drop / button, link to download template, side panel listing expected columns with `*` for required
  2. **Preview**: file name + summary counts, unmapped-columns warning, errors table (first 50 rows + overflow), ready rows table (first 100 + overflow), confirm button disabled when 0 ready
  3. **Done**: success/empty state with counts, link back to list or restart
- Supports columns: `slug, title, brand, manufacturer, category_slug, subcategory_slug, price, price_label, short_description, description, availability, availability_label, image_url, is_active`
- Existing products (by slug) are **updated**; new ones inserted. Idempotent.
- **Not supported (yet):** characteristics in Excel (admin sets them via the form). Easy to add later — one row per characteristic with `product_slug, name, value, position`.

## Etap H — Image upload
- `src/lib/admin/storage.ts`:
  - `uploadProductImage(file, productSlug)` — uploads to `product-images/${slug}/${timestamp}.${ext}`, returns `{ path, publicUrl }`. `upsert: true`, content-type passed through, 1h cache.
  - `deleteProductImage(publicUrl)` — extracts path and removes from bucket (not wired into UI yet)
- `AdminProductFormPage` — the **Изображение** section turned into a proper widget:
  - Preview (4:3 frame) showing current image or empty state
  - Hidden file input + "Загрузить" button (size cap 10 MB, image-type validation)
  - "Убрать" button to clear without deleting from storage (image stays in bucket; cleanup later)
  - Manual URL field preserved as fallback
- Storage public URLs flow through the same `/__sb__/` nginx proxy — same `<img src>` works in dev and prod

## Etap I — Code-split + deploy
- All admin pages wrapped in `React.lazy()` with a `<Suspense fallback={…}/>` boundary. The public bundle no longer pulls in `xlsx`, the admin form, or list/import pages.
- Bundle sizes (gzip):
  - public `index.js`: **205 KB** (was 372 KB — saved ~45%)
  - `AdminProductsImportPage` (xlsx + import code): **147 KB**, lazy-loaded only when admin opens import
  - `AdminProductFormPage`: 5 KB lazy
  - `AdminProductsListPage`: 14 KB lazy
  - Admin auxiliary chunks (login, layout, header, dashboard): ~1–3 KB each
- Deployed to server:
  - `tar -czf … -C dist .` packed locally, scp'd to `/tmp/`
  - `rm -rf /var/www/med-x/dist/*` and untar'd in place
  - nginx vhost already serves `/var/www/med-x/dist/` on port 3040 with SPA fallback (set up in earlier session)

## Verified in production (188.225.86.146:3040)
- `/`, `/catalog`, `/admin`, `/admin/login`, `/admin/products`, `/admin/products/import` all return 200
- Home page title `<title>MED-IX | Стоматологическое оборудование</title>` rendered server-side via `index.html`
- Static chunk file `assets/index-DJeE36J7.js` served 200 by nginx

## Admin flow (end-to-end, in browser)
1. `http://188.225.86.146:3040/admin` → guard redirects to `/admin/login`
2. Login `admin@med-x.local` / `admin` → JWT in `localStorage` (`med-x-admin-auth`)
3. Dashboard shows 18 products / 9 categories / 79 subcategories counts (from Supabase)
4. `Товары` → list with search + category filter + status badge toggle + edit/delete actions
5. `+ Добавить` → form, save → toast, redirect to edit
6. `Импорт Excel` → upload template → preview → confirm → 18 → 19+ products (upsert)

## What's intentionally NOT done (next sessions)
- **pm2 swap**: old Next.js build still runs on port 3030. New SPA is on 3040 in parallel. When you OK it, we stop the pm2 `med-x` process and either point nginx to 3030 or leave SPA on 3040. **Both ports work right now**.
- **HTTPS**: HTTP only — no domain yet. Logging in over an untrusted network leaks the password. Acceptable for B2B internal use; fix with cert when domain is wired.
- **Categories CRUD**: products list/edit work; admin can't yet create new categories from the UI. For now use the seed script or SQL. Add when needed.
- **Characteristic import via Excel**: admin currently sets characteristics through the product form. Add a separate Excel column or sheet later if the need is real.
- **Image cleanup on product delete**: deleting a product leaves orphaned images in storage. Cleanup later via a scheduled job or trigger.

## Files touched (this changelog)
**Added**
- `src/lib/admin/excel-import.ts`
- `src/lib/admin/storage.ts`
- `src/pages/admin/AdminProductsImportPage.tsx`

**Modified**
- `src/pages/admin/AdminProductFormPage.tsx` — image upload widget (replaces URL-only field)
- `src/App.tsx` — lazy-loaded all admin pages + Suspense
- `package.json` (+ `xlsx`)

## Related
- [[admin-phase2-plan]] (Etaps G/H/I now done)
- [[deployment]]
- [[adr-006-admin-auth-supabase]]
