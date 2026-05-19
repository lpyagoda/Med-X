---
name: source-arcadia-logic-inventory
description: What to lift logic-wise from c:\www\arcadia-meb.ru for the Med-X admin panel
metadata:
  type: admin
---

**Source project:** `c:\www\arcadia-meb.ru` — Vite + React 18 + Tailwind v3 + TS + shadcn/ui + Supabase + react-hook-form + zod. Furniture e-commerce. **Their schema is much richer than we need** — we take the bones, drop the modular-product complexity (no Med-X equivalent).

## Files to port (CRUD + Excel)
| Source file | What we adopt | Adapt how |
|---|---|---|
| `src/components/admin/AdminProducts.tsx` | List page logic: pagination, search, filters, bulk actions | TSX rewrite for our slimmer Product shape |
| `src/components/admin/ProductEditDialog.tsx` | Create/edit dialog with RHF + zod | Reuse shape ideas, drop modular fields |
| `src/components/admin/ProductImageGallery.tsx` | Image gallery + main-image select | Map to single `image_url` for v1, then upgrade to `product_images` table |
| `src/components/admin/ProductSpecificationsManager.tsx` | name/value rows for characteristics | Map directly to our `product_characteristics` table |
| `src/components/admin/SimpleImageUpload.tsx` | Supabase storage upload pattern | Bucket name: `product-images` |
| `src/components/admin/ProductImportDialog.tsx` | **Excel import wizard** (upload → mapping → preview → entity review → import → done) using `xlsx` | Port mostly intact; drop "missing entity creation" for brands/collections (we don't have those tables) |
| `src/integrations/supabase/types.ts` | **Auto-generated types pattern** (`supabase gen types typescript`) | We'll regenerate from our own schema |

## Files NOT to port
- `ProductVariantsManager.tsx`, `ProductModulesManager.tsx`, `ProductHardwareManager.tsx`, `ProductBadgesManager.tsx` — we don't model variants, modular products, hardware add-ons, or marketing badges in v1. Add later only if needed.
- `OGImageUpload.tsx` — SEO, irrelevant for us.
- Tab system in `Admin.tsx` covering 13+ entities (brands, collections, catalogs, materials, hardware, banners, partners, promocodes, roles, seo) — none of these apply to Med-X.

## Supabase patterns confirmed
| Operation | Pattern |
|---|---|
| List with pagination | `.from('products').select('*', {count: 'exact'}).range(start, end).order('created_at', {ascending: false})` |
| Get single | `.from('products').select('*').eq('id', id).single()` |
| Create | `.from('products').insert([{...}]).select().single()` |
| Update | `.from('products').update({...}).eq('id', id).select().single()` |
| Delete | `.from('products').delete().eq('id', id)` |
| Storage upload | `supabase.storage.from('product-images').upload(path, file, {cacheControl, upsert})` then `.getPublicUrl(path)` |

Arcadia uses **raw supabase-js client without tanstack-query** in admin — direct `useEffect` + `useState`. We will use the same pattern for v1 (simpler, less deps). If admin grows, add tanstack-query later.

## Excel import — port plan
- Keep arcadia's 6-step wizard: `upload → mapping → preview → entity_review → importing → complete`
- For v1, drop entity-review step (we won't auto-create categories from Excel cells — admin must pre-create them)
- File: `src/lib/excel-import.ts` (parsing) + `src/pages/admin/products/AdminProductsImportPage.tsx` (UI)
- Use `xlsx` package

## Compatibility flags (will hit during port)
- arcadia is **React 18** — most code ports clean, but watch:
  - Strict-mode double-invoke is stricter in 19 (effects, refs)
  - `forwardRef` is unchanged but ref prop semantics differ slightly for function components
- arcadia is **Tailwind v3** — most utilities compatible, watch the same gotchas as in [[source-delau-ui-inventory]]
- arcadia is **react-router-dom v6** — we're on v7. Hooks API is mostly stable; data-router patterns (`loader`, `action`) differ. We don't use those, so impact is minimal.
- arcadia is **zod v3** — we're on **zod v4**, which has API changes (`z.string().min(1)` etc. still work, but message helpers and some types renamed). Will validate during port.

## Auth (NOT ported)
arcadia uses Supabase Auth + `user_roles` table for admin check. We're using env-creds with cookie — see [[adr-003-admin-auth-env]]. Drop arcadia's auth code entirely.

## Related
- [[admin-phase2-plan]]
- [[data-model]]
- [[adr-002-self-hosted-supabase]]
