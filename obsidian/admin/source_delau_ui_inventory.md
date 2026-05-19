---
name: source-delau-ui-inventory
description: What to lift visually from c:\www\delau.pro for the Med-X admin panel
metadata:
  type: admin
---

**Source project:** `c:\www\delau.pro` — Vite + React 19 + Tailwind v3, JSX (no TS), Material Design 3 tokens, service marketplace (not e-commerce → has NO products CRUD).

## What we take (UI patterns only)
| Source file | What we adopt | Adapt how |
|---|---|---|
| `src/pages/admin/AdminLayout.jsx` | Outer layout shell (sidebar + main + header) | Re-write as TSX, react-router 7 `<Outlet>` |
| `src/components/admin/AdminSidebar.jsx` | Collapsible sidebar pattern (hover-expand + pin) | Simplify — drop dark `#0a0a0a` theme, use our `--primary` palette |
| `src/components/admin/AdminHeader.jsx` | Sticky header with mobile drawer + notifications dot | Notifications dropdown will be empty stub for v1 |
| `src/components/admin/ui/AdminTable.jsx` | Dual-render pattern (mobile cards / desktop table) | Re-implement as TSX over shadcn `<Table>` |
| `src/pages/admin/LoginPage.jsx` | Glass-card login with backdrop blur, accent icon | Keep visual; swap auth handler to our env-creds check |

## What we drop
- Material Design 3 colour tokens (`--md-sys-color-*`) → use our existing `--primary` / `--accent` / `--muted` / `--border`
- Emerald/green accent (`#059669`) → use Med-X `--accent` (`#22b8cf`)
- Custom font-import (Inter via `index.css`) → Med-X already loads Wix Madefor, no change
- All non-admin code (public site landing, blog, leads, portfolio, FAQ)

## Custom CSS classes worth porting (if we end up wanting them)
- `.hover-scale`, `.reveal-card` — micro-interactions; **port lazily** only if a screen calls for them
- Custom scrollbar — `port` into `globals.css` (small win, costs ~10 lines)
- `.css-phone` and parallax — **skip**, irrelevant for admin

## Auth pattern
- delau uses **custom React Context** with email/password against their own API (not Supabase Auth). The login form pattern is reusable; the handler is not — we wire it to our env-creds flow.

## Compatibility flags
- delau is **JSX** — every file we lift gets rewritten as TSX with proper types
- delau is **Tailwind v3** — utility names are mostly compatible with v4; the broken ones to watch: `shadow-sm` (renamed in v4), arbitrary value escaping in some cases, ring utilities. Will validate during port.

## Related
- [[admin-phase2-plan]]
- [[source-arcadia-logic-inventory]]
