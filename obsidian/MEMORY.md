# Med-X — knowledge base index

Conventions: each `.md` file is a self-contained note with frontmatter (`name`, `description`, `metadata.type`). Cross-link with `[[name]]`. This file is the index — keep lines short, real content lives in the linked files.

## Architecture
- [Stack overview](architecture/stack_overview.md) — Vite 7 / React 19 / Tailwind v4 / no SSR
- [Project architecture map](architecture/project_architecture_map.md) — folders, routes, key files
- [Routing map](architecture/routing_map.md) — react-router routes + planned admin routes
- [Data model](architecture/data_model.md) — Product / Category / Subcategory shapes, planned Supabase tables
- [Deployment](architecture/deployment.md) — server, pm2, ports, planned SPA deploy

## UI
- [Components catalog](ui/components_catalog.md) — what lives under src/components
- [Design tokens](ui/design_tokens.md) — colours, radii, fonts, shadows
- [Pages inventory](ui/pages_inventory.md) — what each page renders

## Admin (Phase 2)
- [Phase 2 plan](admin/admin_phase2_plan.md) — stepwise integration roadmap
- [delau.pro UI inventory](admin/source_delau_ui_inventory.md) — what we will lift visually
- [arcadia-meb.ru logic inventory](admin/source_arcadia_logic_inventory.md) — CRUD/Excel logic source
- [Adaptation log](admin/adaptation_log.md) — Vite→Vite cross-port notes

## Decisions (ADR)
- [001 — Migration from Next.js to Vite SPA](decisions/adr_001_migration_next_to_vite.md)
- [002 — Self-hosted Supabase inside repo](decisions/adr_002_self_hosted_supabase.md)
- [003 — Admin auth via env credentials](decisions/adr_003_admin_auth_env.md) — **superseded by ADR-006**
- [004 — Production port 3030 + pm2](decisions/adr_004_port_3030_pm2.md)
- [005 — Knowledge base in project root](decisions/adr_005_obsidian_in_repo.md)
- [006 — Supabase Auth + seeded admin user](decisions/adr_006_admin_auth_supabase.md)

## Changelog
- [2026-05-19 — Next.js → Vite migration](changelog/2026-05-19_next_to_vite_migration.md)
- [2026-05-19 — Phase 2 Etaps A + B + C scaffold](changelog/2026-05-19_phase2_etaps_a_b_c.md)
- [2026-05-19 — Phase 2 Etaps D + E (Supabase + schema)](changelog/2026-05-19_phase2_etaps_d_e.md)
- [2026-05-19 — Phase 2 nginx proxy + Auth + seeded admin](changelog/2026-05-19_phase2_auth_nginx_proxy.md)
- [2026-05-19 — Phase 2 Etap F (live products CRUD + seed)](changelog/2026-05-19_phase2_etap_f.md)
- [2026-05-19 — Phase 2 Etaps G + H + I (Excel + image upload + SPA deployed)](changelog/2026-05-19_phase2_etaps_g_h_i.md)
- [2026-05-19 — Categories CRUD + inline subcategories editor](changelog/2026-05-19_categories_crud.md)
- [2026-05-19 — Phase 3: orders/leads, cart+checkout, gallery, XLSX export](changelog/2026-05-19_phase3_orders_leads.md)
- [2026-05-19 — Legal: реквизиты, оферта, политика, согласие, cookie-баннер](changelog/2026-05-19_legal.md)
- [2026-05-22 — About: персональный premium/B2B блок](changelog/2026-05-22_about_personal_approach.md)
- [2026-05-22 - Home dark rays background](changelog/2026-05-22_home_dark_rays.md)
- [2026-05-22 - Home grid background](changelog/2026-05-22_home_grid_background.md) - continuous grid behind home categories/DURR/popular blocks
- [2026-05-22 — Catalog: режим брендов внутри категории](changelog/2026-05-22_catalog_brand_mode.md)
