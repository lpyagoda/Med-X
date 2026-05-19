---
name: routing-map
description: Every route in the SPA — current + planned admin
metadata:
  type: architecture
---

All routes declared in `src/App.tsx` via `<Routes>` from `react-router-dom@7`.

## Public routes (live)
| Path | Component | Notes |
|---|---|---|
| `/` | `HomePage` | hero + featured categories + popular products + DurrDental + CTA |
| `/catalog` | `CatalogPage` | full catalogue with sidebar nav + search |
| `/catalog/:category` | `CategoryPage` | one category, subcategory chips via `?subcategory=` query; chips wrap, no white card |
| `/product/:slug` | `ProductPage` | product detail; gallery + 1-click + add-to-cart |
| `/cart` | `CartPage` | shopping cart (LocalStorage) |
| `/checkout` | `CheckoutPage` | name + phone → creates `orders` + `order_items` |
| `/about` | `AboutPage` | static company info |
| `/contacts` | `ContactsPage` | contact info + consultation form |
| `/requisites` | `RequisitesPage` | реквизиты ИП + банк |
| `/privacy` | `PrivacyPage` | Политика обработки перс. данных |
| `/personal-data` | `PersonalDataPage` | Текст согласия для форм |
| `/offer` | `OfferPage` | Публичная оферта |
| `*` | `NotFoundPage` | catch-all |

## Admin routes (live)
| Path | Component | Notes |
|---|---|---|
| `/admin/login` | `AdminLoginPage` | Supabase Auth |
| `/admin` | redirect to `/admin/products` | dashboard later |
| `/admin/products` | `AdminProductsListPage` | table + filters + search + **XLSX export** |
| `/admin/products/new` | `AdminProductFormPage` | create |
| `/admin/products/:id` | `AdminProductFormPage` | edit |
| `/admin/products/import` | `AdminProductsImportPage` | xlsx upload + preview + commit |
| `/admin/categories` | `AdminCategoriesPage` | CRUD for categories + inline subcategories editor |
| `/admin/orders` | `AdminOrdersListPage` | list of orders |
| `/admin/orders/:id` | `AdminOrderDetailPage` | order detail + items + status |
| `/admin/leads` | `AdminLeadsPage` | inbox of form submissions |

## Auth gate
Wrap admin routes in `<RequireAdmin>` (HOC/wrapper). Reads cookie, redirects to `/admin/login` if missing/invalid. See [[adr-003-admin-auth-env]].

## SPA fallback (deployment)
Server must rewrite **all** unknown paths to `/index.html` so react-router can handle them. Current Next.js production at `188.225.86.146:3030` is being replaced. New nginx vhost will need `try_files $uri /index.html;`.

## Related
- [[project-architecture-map]]
- [[admin-phase2-plan]]
- [[adr-003-admin-auth-env]]
