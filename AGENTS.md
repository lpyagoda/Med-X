# Med-X — project guide for AI agents

## Stack
- **Vite 7** + **React 19** + **TypeScript 5** + **Tailwind CSS v4** (via `@tailwindcss/vite`, no postcss.config)
- **react-router-dom v7** for client-side routing
- **react-hook-form + zod 4** for forms
- **No SEO** — pure SPA; no SSR, no prerender
- **No backend yet** — products and categories are static `src/data/*.ts`. Phase 2 brings self-hosted Supabase

## Layout
```
src/
├── App.tsx          ← <Routes> for the whole app
├── main.tsx         ← createRoot + BrowserRouter + LeadModalProvider
├── pages/           ← route components (HomePage, CatalogPage, …)
├── components/      ← reusable UI (catalog/, product/, home/, about/, forms/, layout/, ui/)
├── contexts/        ← React contexts
├── data/            ← static product/category data (will move to Supabase in Phase 2)
├── lib/             ← api, utils, validations
├── styles/          ← globals.css (Tailwind v4 + @theme inline + custom classes)
└── types/           ← TS types

obsidian/            ← project knowledge base (architecture, decisions, changelog)
```

## Conventions
- Internal navigation → `<Link to="...">` from `react-router-dom`
- External links / `tel:` / `mailto:` → plain `<a href="...">`
- Images → plain `<img>` (no auto-optimisation; static assets live in `/public/images/`)
- Fonts → loaded from Google Fonts via `<link>` in `index.html`; CSS vars `--font-wix-display`, `--font-wix-text` in `globals.css`
- Path alias `@/*` → `./src/*` (declared in `tsconfig.app.json` and `vite.config.ts`)
- Tailwind v4: do **not** create `tailwind.config.js`; theme tokens go into `@theme inline` block in `src/styles/globals.css`

## Memory protocol
- Before any non-trivial change, read `obsidian/` files relevant to the area you're touching
- After a change, update the relevant `obsidian/` files and append a line to `obsidian/changelog/`
- See `obsidian/MEMORY.md` for the index

## Deployment
- Production lives at `188.225.86.146:3030` (server `delau.pro`, `/var/www/med-x/`)
- Currently runs the **old Next.js build** via pm2 process `med-x`; SPA re-deploy is pending
- When re-deploying: `npm run build` → upload `dist/` → serve via nginx with SPA fallback to `index.html`
