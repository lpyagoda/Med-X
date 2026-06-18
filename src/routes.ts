import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from "@react-router/dev/routes";

export default [
  // ---- Resource routes (no UI): served as text/xml ----
  route("robots.txt", "routes/robots.ts"),
  route("sitemap.xml", "routes/sitemap.ts"),

  // ---- Public site: shared chrome (Header/Footer/modals) via a layout route ----
  layout("routes/public-layout.tsx", [
    index("routes/home.tsx"),
    route("catalog", "routes/catalog.tsx"),
    route("brands", "routes/brands.tsx"),
    route("catalog/:category", "routes/category.tsx"),
    route("product/:slug", "routes/product.tsx"),
    route("cart", "routes/cart.tsx"),
    route("checkout", "routes/checkout.tsx"),
    route("about", "routes/about.tsx"),
    route("contacts", "routes/contacts.tsx"),
    route("privacy", "routes/privacy.tsx"),
    route("offer", "routes/offer.tsx"),
    route("personal-data", "routes/personal-data.tsx"),
    route("requisites", "routes/requisites.tsx"),
    route("*", "routes/not-found.tsx"),
  ]),

  // ---- Admin: client-rendered, its own chrome, never indexed ----
  route("admin/login", "routes/admin/login.tsx"),
  ...prefix("admin", [
    layout("routes/admin/layout.tsx", [
      index("routes/admin/index.tsx"),
      route("products", "routes/admin/products.tsx"),
      route("products/new", "routes/admin/product-new.tsx"),
      route("products/import", "routes/admin/products-import.tsx"),
      route("products/:id", "routes/admin/product-edit.tsx"),
      route("categories", "routes/admin/categories.tsx"),
      route("brands", "routes/admin/brands.tsx"),
      route("orders", "routes/admin/orders.tsx"),
      route("orders/:id", "routes/admin/order-detail.tsx"),
      route("leads", "routes/admin/leads.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
