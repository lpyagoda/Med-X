---
name: project-architecture-map
description: One-screen map of Med-X — entry, routes, key folders, data flow
metadata:
  type: architecture
---

## Entry
```
index.html  →  src/main.tsx  →  <BrowserRouter><LeadModalProvider><App/></LeadModalProvider></BrowserRouter>
                                                                       ↓
                                                              src/App.tsx → <Routes>
```

## Routes (current)
| Path | Component | File |
|---|---|---|
| `/` | `HomePage` | `src/pages/HomePage.tsx` |
| `/catalog` | `CatalogPage` | `src/pages/CatalogPage.tsx` |
| `/catalog/:category` | `CategoryPage` | `src/pages/CategoryPage.tsx` |
| `/product/:slug` | `ProductPage` | `src/pages/ProductPage.tsx` |
| `/about` | `AboutPage` | `src/pages/AboutPage.tsx` |
| `/contacts` | `ContactsPage` | `src/pages/ContactsPage.tsx` |
| `*` | `NotFoundPage` | `src/pages/NotFoundPage.tsx` |

Planned admin routes — see [[routing-map]].

## Folder map
| Folder | What's inside | Touch carefully? |
|---|---|---|
| `src/pages/` | Route components, one per `<Route>` | yes — touches URL contract |
| `src/components/layout/` | `Header`, `Footer` | yes — global chrome |
| `src/components/ui/` | `Button`, `Container`, `Section`, `Modal`, `Input`, `Textarea`, `MagneticButton`, `PillBadge`, `SectionTitle` | yes — used everywhere |
| `src/components/forms/` | `LeadModal`, `LeadModalTrigger`, `MagneticLeadModalTrigger`, `ConsultationForm`, `ProductOrderForm` | medium — touches `LeadModalContext` and validations |
| `src/components/home/` | Hero, benefits, CTA, DurrDental blocks | only when redesigning |
| `src/components/about/` | About-page sections | only when redesigning |
| `src/components/catalog/` | `CategoryCard/Grid/List/Tags`, `ProductCard/Grid/Search`, `CatalogCategoryNav`, `CatalogToolbar`, `PriceNotice` | yes — central to catalogue UX |
| `src/components/product/` | `ProductHero`, `ProductCharacteristics`, `ProductDetails`, `ProductOrderPanel`, `Breadcrumbs`, `RelatedProducts` | yes |
| `src/contexts/LeadModalContext.tsx` | global lead-modal open state | careful — consumed by header + product pages |
| `src/data/catalog.ts`, `categories.ts`, `products.ts` | **static product data** — will be replaced by Supabase calls in Phase 2 | YES — central to Phase 2 migration |
| `src/lib/api.ts` | sync data accessors (`getCategories`, `getProducts`, etc.) + form-submit stubs | YES — will become Supabase queries |
| `src/lib/catalogSearch.ts`, `utils.ts`, `validations.ts` | helpers + zod schemas | yes |
| `src/types/` | TS types (`Product`, `Category`, `Subcategory`, `ConsultationFormData`, `ProductOrderFormData`, `NavItem`) | yes |
| `src/styles/globals.css` | Tailwind v4 `@theme inline` + custom CSS classes (`hero-glass`, `magnetic-button-*`, `premium-float-*`, `durr-grid`, `hero-rays`, etc.) | yes |
| `public/images/` | static assets — hero backgrounds, product renders | grow as needed |
| `obsidian/` | this knowledge base | always update after changes |

## Data flow (current)
```
src/data/{categories,products}.ts  →  src/lib/api.ts (sync accessors)  →  pages/* and components/*
```

All data is **static** at build time. No fetching, no async, no loading states.

## Data flow (planned, Phase 2)
```
Supabase (self-hosted, ./supabase/) ─┬─→  src/lib/supabase/client.ts
                                     │
                       admin pages   │
                       /admin/products → CRUD via @supabase/supabase-js
                                     │
                       public pages → (Phase 2.x — still optional) read via Supabase
```

For Phase 2 we **may keep public pages reading static data** and only wire admin to Supabase, to ship faster. To be decided when we get there.

## Related
- [[stack-overview]]
- [[routing-map]]
- [[data-model]]
- [[components-catalog]]
- [[admin-phase2-plan]]
