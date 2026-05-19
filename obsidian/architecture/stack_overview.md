---
name: stack-overview
description: Frameworks, versions, configs and quirks of the Med-X build
metadata:
  type: architecture
---

## Core
- **Vite 7** (`vite.config.ts`) — `@vitejs/plugin-react` + `@tailwindcss/vite` plugin
- **React 19.2.4** + react-dom 19.2.4
- **TypeScript 5** — project references: `tsconfig.json` → `tsconfig.app.json` (browser code) + `tsconfig.node.json` (vite config)
- **Tailwind CSS v4** — *no* `tailwind.config.*`, *no* `postcss.config.*`. Tokens live in `@theme inline` block inside `src/styles/globals.css`. Plugin: `@tailwindcss/vite`.

## Routing
- **react-router-dom v7** — `<BrowserRouter>` wraps the app in `src/main.tsx`, `<Routes>` declared in `src/App.tsx`

## Forms & validation
- **react-hook-form 7** + **zod 4** (validators in `src/lib/validations.ts`)
- `@hookform/resolvers` bridges zod schemas to RHF

## Fonts
- Loaded from Google Fonts via `<link>` in `index.html` (Wix Madefor Display + Wix Madefor Text)
- CSS vars `--font-wix-display`, `--font-wix-text` defined in `src/styles/globals.css :root`

## Path alias
- `@/*` → `./src/*` (declared in both `tsconfig.app.json#compilerOptions.paths` and `vite.config.ts#resolve.alias`)

## TS strictness
- `strict: true`
- `verbatimModuleSyntax: true` — must use `import type` for type-only imports
- `erasableSyntaxOnly: true` — no enums/namespaces, only erasable TS

## What we do NOT have
- No SSR, no SSG, no prerender — pure SPA
- No SEO consideration (per product decision)
- No image optimisation pipeline — static assets in `/public/images/`, served as-is
- No `postcss.config.*` — Tailwind v4 vite plugin handles everything
- No `tailwind.config.*` — same reason
- No backend yet — Phase 2 brings self-hosted Supabase (`supabase/` folder via CLI)

## Build artefacts
- `dist/` is the build output (gitignored)
- `node_modules/.tmp/*.tsbuildinfo` — TS incremental cache

## Related
- [[project-architecture-map]]
- [[adr-001-migration-next-to-vite]]
