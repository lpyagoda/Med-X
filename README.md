# Med-X

B2B-каталог стоматологического оборудования, запчастей и расходных материалов.

## Stack
Vite 7 · React 19 · TypeScript 5 · Tailwind v4 · react-router-dom 7 · react-hook-form + zod 4

## Scripts
```bash
npm install         # install deps (once)
npm run dev         # dev server on http://localhost:5173
npm run build       # type-check + production build into dist/
npm run preview     # serve dist/ on http://localhost:4173
npm run lint
```

## Layout
- `src/pages/` — route components
- `src/components/` — UI building blocks
- `src/data/` — static catalogue data (moves to Supabase in Phase 2)
- `src/styles/globals.css` — Tailwind v4 tokens & custom classes
- `obsidian/` — project knowledge base (architecture, decisions, changelog) — **read before non-trivial edits**

## Deployment
Production runs on `188.225.86.146:3030`. See `obsidian/architecture/deployment.md`.
