---
name: changelog-2026-05-19-phase2-etaps-d-e
description: Phase 2 Etap D — Supabase running on server. Etap E — initial schema applied.
metadata:
  type: changelog
---

# 2026-05-19 — Phase 2 Etaps D + E

## Etap D — Supabase self-hosted on server
- `supabase init` ran in `/var/www/med-x/` on server `188.225.86.146` (no Docker locally; user chose server-direct setup)
- `supabase start` boots all containers under `project_id = med-x`. First run downloaded ~1 GB of images.
- All ports bound to **`127.0.0.1`** (host loopback only) — **NOT publicly accessible**. Security baseline.
- Ports allocated (locally on server):
  - API gateway (Kong): 54321
  - Postgres: 54322
  - Shadow Postgres (diff): 54320
  - Studio: 54323
  - Mailpit: 54324
- Did NOT install Supabase CLI locally (Docker daemon wasn't running) — all DB work happens via SSH to server.

## Etap E — initial schema
Three migrations created and applied via `supabase db reset`:
- `supabase/migrations/20260519084219_init_categories.sql`
  - `public.categories` — id/slug/title/description/image_url/tags/position/is_active + timestamps
  - `public.subcategories` — category_id FK (on delete cascade), slug unique within category
  - `tg_set_updated_at` trigger function + triggers on both tables
  - RLS: public SELECT for `is_active`; authenticated ALL
- `supabase/migrations/20260519084233_init_products.sql`
  - `public.products` — id/slug/title/brand/manufacturer/image_url/price/price_label/short_description/description + category_id + subcategory_id + availability check + is_active + timestamps
  - `public.product_characteristics` — name/value rows ordered by `position`, on delete cascade
  - `pg_trgm` extension + GIN index on `products.title` for search
  - RLS: public SELECT when parent product is active; authenticated ALL
- `supabase/migrations/20260519084234_init_storage.sql`
  - `storage.buckets`: `product-images` (public, 10 MB cap, common image MIME types)
  - RLS on `storage.objects` scoped to `product-images`: SELECT public; INSERT/UPDATE/DELETE authenticated

## Verified (via `docker exec supabase_db_med-x psql ...`)
- 4 tables in `public` ✅
- 12 RLS policies across `public.*` + `storage.objects` ✅
- `product-images` bucket exists and is public ✅

## Issues hit (resolved)
- `supabase migration new` ran twice in the same second → two files with same timestamp (`20260519084233_*`) caused `schema_migrations_pkey` violation. Renamed storage migration to `20260519084234_*`.
- Original `init_products.sql` had `pg_trgm` extension created **after** the GIN index that uses `gin_trgm_ops` → applied in source order, failed. Moved `create extension` to top.

## Open before Etap F (CRUD)
Decisions needed:
1. **Public exposure of Supabase API** — currently bound to 127.0.0.1. Three options to make admin-CRUD reachable from browsers:
   - (a) Bind on 0.0.0.0:54321 (rebind via config)
   - (b) New nginx vhost that proxies `/__sb__/*` → `127.0.0.1:54321/*` on the existing 80/443 listener (preferred for prod)
   - (c) SSH tunnel for dev, decide prod later
2. **Auth approach for admin writes**. Earlier ADR-003 said "nginx basic_auth, no Supabase Auth". That doesn't work — we'd need to expose the **secret key** in JS bundle if there's no Supabase Auth, which is a vulnerability. Recommended pivot:
   - Use **Supabase Auth** with one seeded admin user (email/password from env at deploy time)
   - Browser hits Supabase Auth's `signInWithPassword` → JWT in session
   - RLS policy `authenticated` allows admin operations
   - This **supersedes** ADR-003; we'll write ADR-006 once direction is confirmed

## Related
- [[adr-002-self-hosted-supabase]]
- [[admin-phase2-plan]]
- [[deployment]]
- [[data-model]]
