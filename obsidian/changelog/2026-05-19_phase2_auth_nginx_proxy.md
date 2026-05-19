---
name: changelog-2026-05-19-phase2-auth-nginx-proxy
description: Phase 2 — nginx vhost (port 3040, /__sb__/ proxy), Supabase Auth + seeded admin, login flow end-to-end
metadata:
  type: changelog
---

# 2026-05-19 — Phase 2 nginx proxy + Auth

## Decisions
- **ADR-006** authored — Supabase Auth with one seeded admin user. **Supersedes** ADR-003 (nginx basic_auth, which was unsafe because it would have required leaking `service_role` to the browser).
- **Light admin sidebar theme** (per user feedback) — `#ffffff` background, `#073763` primary, `#22b8cf` accent bar. Implemented in `globals.css`.

## Server changes
- **`/etc/nginx/sites-available/med-x-admin`** (symlinked into `sites-enabled/`) — new vhost on port `3040`:
  - serves SPA from `/var/www/med-x/dist/` (placeholder index.html for now)
  - proxies `/__sb__/*` → `http://127.0.0.1:54321/*` (Supabase API)
  - WebSocket-ready (`Upgrade`/`Connection` headers, long timeouts) for Supabase Realtime later
  - SPA fallback to `index.html`
  - `nginx -t` clean (only pre-existing warnings about other sites' duplicate vhosts — not ours)
- **`/var/www/med-x/supabase/config.toml`** — `[auth] enable_signup = false`. Email login provider stays enabled. Public signup verified blocked (`{"error_code":"signup_disabled"}`).
- **`/var/www/med-x/.env`** — `chmod 600`, `ADMIN_EMAIL=admin@med-x.local`, `ADMIN_PASSWORD=admin`. Source of truth for the seed script. **Should be rotated when there's a domain + HTTPS.**
- **`/var/www/med-x/deploy/seed-admin.sh`** — idempotent script. Creates/updates admin user via Supabase Auth admin API (`POST /auth/v1/admin/users`), **not** by direct `INSERT auth.users` (that caused `"Database error querying schema"` on login).

## Code changes (repo)
- **`vite.config.ts`** — dev/preview proxy `/__sb__` → `http://188.225.86.146:3040` (so local SPA can talk to server's Supabase via the same path as production)
- **`.env.example`** + **`.env.local`** — Supabase URL + publishable key. `.env.local` gitignored
- **`.gitignore`** — cleaned up (removed Next-era patterns, added supabase/.temp, env handling)
- **`src/lib/supabase/client.ts`** — `createClient()` with publishable key + custom storage key `med-x-admin-auth`
- **`src/contexts/AdminAuthContext.tsx`** — session state (loading/authenticated/anonymous), `signIn`, `signOut`, subscribes to `onAuthStateChange`
- **`src/components/admin/RequireAdmin.tsx`** — guard. While loading shows spinner-message; anonymous redirects to `/admin/login` preserving `from`
- **`src/pages/admin/AdminLoginPage.tsx`** — email/password form, error state, redirects back to `from` on success
- **`src/main.tsx`** — wraps the app in `<AdminAuthProvider>`
- **`src/App.tsx`** — added `<Route path="/admin/login" element={<AdminLoginPage/>} />`; wrapped `<AdminLayout/>` in `<RequireAdmin>`

## End-to-end verification
- `GET http://188.225.86.146:3040/` → 200 (placeholder)
- `GET http://188.225.86.146:3040/__sb__/rest/v1/products` with apikey → `[]` (empty, RLS-correct)
- `POST http://188.225.86.146:3040/__sb__/auth/v1/token?grant_type=password` with admin creds → JWT
- `POST http://188.225.86.146:3040/__sb__/auth/v1/signup` → `signup_disabled` error
- `npm run build` → 4.35s, **693 KB JS** / 75 KB CSS (gzip 197/12 KB) — supabase-js bumped bundle ~210 KB; below threshold to worry about
- Vite preview proxy verified — login from `http://127.0.0.1:4173` succeeds, returns bearer token

## Hidden risk known and accepted
- We serve over **HTTP** (no domain yet, no TLS). Password observable on the wire when logging in from an untrusted network. **Mitigation:** log in only from trusted networks until a domain + Let's Encrypt cert are configured. Documented in [[adr-006-admin-auth-supabase]].

## Files touched
**Added**
- `deploy/nginx/med-x-admin.conf`
- `deploy/seed-admin.sh`
- `supabase/seed.sql` (empty placeholder)
- `src/lib/supabase/client.ts`
- `src/contexts/AdminAuthContext.tsx`
- `src/components/admin/RequireAdmin.tsx`
- `src/pages/admin/AdminLoginPage.tsx`
- `.env.example`, `.env.local`
- `obsidian/decisions/adr_006_admin_auth_supabase.md`

**Modified**
- `vite.config.ts`, `.gitignore`, `src/main.tsx`, `src/App.tsx`, `src/styles/globals.css` (light sidebar tokens)
- `src/components/admin/AdminSidebar.tsx` (light theme adaptation)
- `package.json` (`@supabase/supabase-js`)

## Open: next session
- **Etap F** — `src/lib/admin/products.ts` data layer + rewrite `AdminProductsListPage` against Supabase. Then `AdminProductFormPage` (create/edit). Add a seed migration that loads current `src/data/*.ts` into Supabase so the admin list has data.
- **Etap G** — Excel import (port from `arcadia-meb.ru/src/components/admin/ProductImportDialog.tsx`).
- **Etap H** — image upload to `product-images` bucket.
- **Etap I** — production deploy of the SPA: `npm run build` → scp `dist/` to `/var/www/med-x/dist/`. Then decide port (3040 standalone vs 3030 after pm2 swap).

## Related
- [[adr-006-admin-auth-supabase]]
- [[admin-phase2-plan]]
- [[deployment]]
