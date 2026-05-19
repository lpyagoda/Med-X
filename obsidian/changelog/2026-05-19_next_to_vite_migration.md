---
name: changelog-2026-05-19-next-to-vite
description: Migration of Med-X from Next.js 16 to Vite + React SPA + project setup
metadata:
  type: changelog
---

# 2026-05-19 — Next.js → Vite SPA migration + project bootstrap

## Decisions made
- Migrate stack to Vite + react-router (see [[adr-001-migration-next-to-vite]])
- Self-host Supabase inside repo (see [[adr-002-self-hosted-supabase]])
- Admin auth via nginx basic auth (see [[adr-003-admin-auth-env]])
- Knowledge base lives in `./obsidian/` (see [[adr-005-obsidian-in-repo]])

## Code changes
- Removed: `next.config.ts`, `next-env.d.ts`, `postcss.config.mjs`, `src/app/`, `public/{next,vercel,file,globe,window}.svg`, generated `.next/`
- Added: `vite.config.ts`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`, `src/styles/globals.css`, `src/pages/*` (7 routes incl. NotFoundPage)
- Rewritten: `package.json` (next → vite/react-router), `eslint.config.mjs` (next preset → tseslint), `tsconfig.json` (project references), `README.md`, `AGENTS.md`
- Edited (mechanical): 18 component files — `next/link` → `react-router-dom Link`, `next/image` → `<img>`, stripped `"use client"` directives, replaced `notFound()` / `generateStaticParams`

## Verified
- `npm run build` → 1.87s, dist size 434 KB JS / 66 KB CSS
- `npm run preview` → all 7 routes return 200; SPA fallback works
- Local lint not yet rerun under new eslint config — to do later

## NOT changed
- `src/data/*.ts` — static catalogue data untouched
- `src/components/forms/*`, `src/components/about/*`, `src/components/home/*` (except `DurrDentalShowcase` which had `<Image>` and `"use client"`) — visually identical
- `src/styles/globals.css` — only added `--font-wix-*` vars; all custom CSS classes preserved
- Server `188.225.86.146:3030` — still runs the OLD Next.js build under pm2 process `med-x`. SPA re-deploy is pending Etap I

## Obsidian set up
Initialised `./obsidian/` with:
- `MEMORY.md` index
- `architecture/{stack_overview, project_architecture_map, routing_map, data_model}.md`
- `admin/{admin_phase2_plan, source_delau_ui_inventory, source_arcadia_logic_inventory}.md`
- `decisions/{adr_001…, adr_002…, adr_003…, adr_005…}.md`
- this changelog

## Next up
Etap A of Phase 2 — shadcn-foundation under Tailwind v4 + React 19 (deps + minimum primitives). See [[admin-phase2-plan]].
