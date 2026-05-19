---
name: admin-phase2-plan
description: Stepwise plan to ship the Med-X admin panel — UI from delau, logic from arcadia
metadata:
  type: admin
---

## North star
A **gated** `/admin/*` area at `188.225.86.146:3030/admin` (later under a domain) where one admin can:
1. Log in with creds from `.env.local`
2. CRUD categories + subcategories
3. CRUD products with multiple characteristics + one main image
4. Bulk-import products via Excel
5. (later) upload product images to Supabase storage

## Etap-by-etap
| Etap | Goal | Status |
|---|---|---|
| **A** | shadcn-foundation under Tailwind v4 + React 19 — install primitives, copy minimum set | pending |
| **B** | Lift design tokens / glass + sidebar patterns from delau.pro into globals.css | pending |
| **C** | Admin layout + login page + auth gate (env creds, signed cookie) | pending |
| **D** | Self-hosted Supabase init (CLI + docker-compose, in `./supabase/`) | pending |
| **E** | Products + categories schema as migrations (port shapes from arcadia, slim down) | pending |
| **F** | Products CRUD pages — list, create, edit, delete | pending |
| **G** | Excel import wizard (port from arcadia, simplified) | pending |
| **H** | Storage upload for product images | pending |
| **I** | Deploy SPA to server: build → upload `dist/` → new nginx vhost with SPA fallback | pending |

## Etap A — shadcn-foundation
- Upgrade `src/lib/utils.ts` `cn` to use `clsx + tailwind-merge`
- Install runtime deps: `clsx`, `tailwind-merge`, `class-variance-authority`, `tailwindcss-animate`, `lucide-react`
- Install Radix primitives needed for v1: `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`, `@radix-ui/react-label`, `@radix-ui/react-select`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`, `@radix-ui/react-toast` (or `sonner`)
- **Do not** use `npx shadcn init` — it would create `tailwind.config.ts` we don't want (we're on v4 with no config). Instead, copy each shadcn component file manually into `src/components/ui/shadcn/*` and adapt class names where needed.
- Components for v1: `button-admin`, `input-admin`, `label`, `form`, `dialog`, `dropdown-menu`, `select`, `tabs`, `table`, `toaster` (sonner). Keep our existing `Button`, `Input`, etc. — these are for the **public site**; admin gets its own.

## Etap B — design tokens
- Port emerald/glass admin tokens from delau into a new admin-scoped CSS block in `globals.css`. Use a `.admin-scope` wrapper class so admin styling doesn't leak into public pages.

## Etap C — admin layout + auth
- New page: `src/pages/admin/AdminLoginPage.tsx`
- New layout: `src/pages/admin/AdminLayout.tsx` (sidebar + header, `<Outlet/>`)
- New guard: `src/components/admin/RequireAdmin.tsx` (checks cookie via tiny hook)
- New route in `src/App.tsx`: `<Route path="/admin" element={<RequireAdmin><AdminLayout/></RequireAdmin>}><Route .../></Route>`
- Login flow: form posts to a Vite dev-server middleware (or to a tiny API endpoint on the same server in prod). For local dev we need a server piece that can read env. **Decision needed:** either (a) bundle a tiny Express server, (b) deploy admin behind nginx that checks creds upstream, (c) embed creds as a **hashed** value in build-time env and check client-side (less secure but simplest).
  - **Recommended:** (a) — add `server/admin-auth.mjs` (tiny Express), proxy it via Vite `server.proxy` config; in prod it runs as a pm2 process alongside the SPA. See [[adr-003-admin-auth-env]].

## Etap D — Supabase self-hosted
- Requires **Docker Desktop locally** + `supabase` CLI. **Confirm with user before this etap.**
- Run `npx supabase init` → creates `supabase/config.toml`, `supabase/migrations/`, etc.
- On the server: docker-compose with port shift (Postgres 5432 already taken → use 5433; Studio + API gateway on free ports)
- Env vars: `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only)

## Etap E — schema
- Migrations:
  - `0001_categories.sql` — categories + subcategories
  - `0002_products.sql` — products + product_characteristics (FK on delete cascade)
  - `0003_storage.sql` — bucket `product-images`, policies
- Seed: convert current `src/data/*.ts` to a one-off SQL insert script

## Etap F — products CRUD
- Pages: `AdminProductsListPage`, `AdminProductFormPage` (create/edit)
- Components: `ProductsTable`, `ProductFormCore`, `CharacteristicsEditor` (rows of name/value, add/remove)
- Image: single upload to storage `product-images/{slug}.{ext}`; later upgrade to gallery
- Data layer: `src/lib/admin/products.ts` — list/get/create/update/delete functions wrapping supabase-js

## Etap G — Excel import
- `src/lib/excel-import.ts` — parse + validate via zod
- `src/pages/admin/products/AdminProductsImportPage.tsx` — 5-step wizard (upload, map columns, preview, import, done)
- Expected columns: `slug, title, brand, manufacturer, price, price_label, short_description, description, category_slug, subcategory_slug?, availability, image_url`
- Validation errors shown inline per row, allow user to download a corrected XLSX

## Etap H — storage uploads
- Reuse Supabase storage. Drop-zone component (react-dropzone or a hand-rolled one — minimal)

## Etap I — deploy
- `npm run build` → `dist/`
- Upload via scp to `/var/www/med-x/dist/`
- New nginx vhost: `try_files $uri /index.html;` + reverse-proxy `/api/admin-auth/*` to the auth service
- Switch pm2: stop old `med-x` Next.js process; start `med-x-auth` for the admin-auth Express service

## Related
- [[source-delau-ui-inventory]]
- [[source-arcadia-logic-inventory]]
- [[data-model]]
- [[adr-002-self-hosted-supabase]]
- [[adr-003-admin-auth-env]]
