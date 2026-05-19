---
name: adr-001-migration-next-to-vite
description: Why we ripped out Next.js 16 and rebuilt the project on Vite + React SPA
metadata:
  type: decision
---

**Status:** accepted — 2026-05-19
**Decision:** Migrate from Next.js 16 (App Router) to Vite 7 + react-router-dom v7 SPA.

## Context
The repo was scaffolded as a Next.js 16 project (`create-next-app`). Both planned admin-panel donors (`delau.pro`, `arcadia-meb.ru`) are Vite SPAs with react-router. Persisting on Next 16 would have meant:
1. Bleeding-edge framework risk (Next 16 was new; `AGENTS.md` literally warned "This is NOT the Next.js you know").
2. Conversion friction porting components from the donors (Vite→Next: routing, env, metadata, Server vs Client component split).
3. The user has standardised on React SPA across other projects ("у нас все написано на реакте").
4. SEO explicitly waived ("seo не нужно так как без него будем делать") — the main argument *for* Next is gone.

## Audit before commit
Audit (2026-05-19) showed Med-X used **almost no Next-specific features**: no Server Actions, no route handlers, no middleware, no `cookies()`/`headers()`, no `useRouter`. The `lib/api.ts` "server" accessors were just sync data wrapped in async. Migration was mechanical.

## What changed
- `package.json` rewritten — `next`/`eslint-config-next` out; `vite`, `@vitejs/plugin-react`, `@tailwindcss/vite`, `react-router-dom` in
- `app/**/page.tsx` → `src/pages/*.tsx`
- `next/link` → `react-router-dom <Link to>`; `tel:`/`mailto:` → plain `<a>`
- `next/image` → plain `<img>`
- `next/font/google` → Google Fonts via `<link>` in `index.html`
- `"use client"` directives stripped (15 files)
- `notFound()` → `<Navigate to="/404" replace />`
- `generateStaticParams` removed
- TS config split into `tsconfig.app.json` + `tsconfig.node.json` with project references
- Tailwind v4 stayed — same `@theme inline` tokens just moved to `src/styles/globals.css`

## Verification
- `npm run build` succeeded in 1.87s (434 KB JS, 66 KB CSS, gzip 126/11 KB)
- All 7 routes return 200 against `vite preview`
- SPA fallback works — `/random-404` returns the shell + NotFoundPage

## Open consequences
- Production at `188.225.86.146:3030` still runs the old Next.js build via pm2; SPA re-deploy is **pending** (see [[admin-phase2-plan]] Etap I)
- Lost the Next.js auto image optimisation — acceptable as `/public/images/` already holds reasonable sizes

## Related
- [[stack-overview]]
- [[admin-phase2-plan]]
- changelog `2026-05-19_next_to_vite_migration`
