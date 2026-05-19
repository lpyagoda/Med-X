---
name: changelog-2026-05-19-phase2-etaps-a-b-c
description: Phase 2 Etap A (shadcn-foundation) + Etap B (admin tokens) + Etap C scaffold (admin layout + 2 pages)
metadata:
  type: changelog
---

# 2026-05-19 — Phase 2 Etaps A + B + C (scaffold)

## What shipped

### Etap A — shadcn-foundation
- Installed deps: `clsx`, `tailwind-merge`, `class-variance-authority`, `lucide-react`, `sonner`, `tw-animate-css`, Radix primitives (`dialog`, `dropdown-menu`, `label`, `select`, `slot`, `tabs`)
- Upgraded `src/lib/utils.ts` — `cn()` now uses `clsx + twMerge`
- Did **not** run `npx shadcn init` (would force `tailwind.config.ts` we don't want under v4); writing primitives manually instead
- New admin primitives:
  - `src/components/admin/ui/button.tsx` — `AdminButton` with cva variants (default/destructive/outline/secondary/ghost/link, sizes default/sm/lg/icon)
  - `src/components/admin/ui/input.tsx` — `AdminInput`
  - `src/components/admin/ui/label.tsx` — `AdminLabel` over Radix label

### Etap B — design tokens & admin scope
- Added tokens to `src/styles/globals.css`:
  - `--primary-foreground`, `--accent-foreground`, `--muted-foreground`, `--card-foreground`, `--destructive`, `--destructive-foreground`, `--secondary`, `--secondary-foreground`, `--popover`, `--popover-foreground`, `--input`, `--ring`, `--radius`
  - admin-scope tokens: `--admin-bg`, `--admin-surface`, `--admin-sidebar`, `--admin-sidebar-fg`, `--admin-sidebar-fg-active`, `--admin-sidebar-fg-hover`, `--admin-sidebar-active`, `--admin-accent`, `--admin-border`, `--admin-muted-fg`
- Wired all of the above through `@theme inline` for Tailwind v4
- `.admin-scope` wrapper class — admin pages get their own surface bg without leaking to public site
- `.admin-card` + `.admin-sidebar-nav-item` CSS classes

### Etap C — admin scaffold
- New layout: `src/pages/admin/AdminLayout.tsx` (renders sidebar + `<Outlet/>`)
- New components:
  - `src/components/admin/AdminSidebar.tsx` — dark left rail with 5 nav items + lucide icons + active state via `<NavLink>`
  - `src/components/admin/AdminHeader.tsx` — sticky white header with title, description, "Открыть сайт" link, notifications stub
- New pages:
  - `src/pages/admin/AdminDashboardPage.tsx` — 3 stat cards (products, categories, import-pending) + "what's next" panel
  - `src/pages/admin/AdminProductsListPage.tsx` — searchable table over current static products (search field works; edit/delete/add buttons present but **disabled** with `disabled` attr until Supabase is wired)
  - `src/pages/admin/AdminStubPage.tsx` — placeholder used for products/import, categories, subcategories
- `src/App.tsx` restructured — public routes wrapped in `PublicLayout` (Header/Main/Footer), admin routes nested under `<Route path="/admin" element={<AdminLayout/>}>` with no public chrome
- No auth gate yet — see [[adr-003-admin-auth-env]] (will be nginx basic auth at deploy time)

## Build & smoke
- `npm run build` → 3.57s, dist size 480 KB JS / 74 KB CSS (gzip 141/12 KB)
- `vite preview` — verified routes `/`, `/catalog`, `/admin`, `/admin/products`, `/admin/products/import`, `/admin/categories`, `/admin/subcategories` all return 200; admin sidebar/header/table render correctly

## Not done (next sessions)
- Etap D — self-hosted Supabase init (blocked: Docker availability check)
- Etap E-I — schema, CRUD, Excel, storage, deploy

## Files touched
**Added**
- `src/components/admin/AdminSidebar.tsx`, `AdminHeader.tsx`
- `src/components/admin/ui/button.tsx`, `input.tsx`, `label.tsx`
- `src/pages/admin/AdminLayout.tsx`, `AdminDashboardPage.tsx`, `AdminProductsListPage.tsx`, `AdminStubPage.tsx`

**Modified**
- `src/lib/utils.ts` (cn upgraded)
- `src/styles/globals.css` (tokens + admin-scope block)
- `src/App.tsx` (admin routes + PublicLayout wrapper)
- `package.json` (+ deps)

## Related
- [[admin-phase2-plan]]
- [[adr-003-admin-auth-env]]
