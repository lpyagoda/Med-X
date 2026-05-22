import { lazy, Suspense } from "react";
import { useLenis } from "@/lib/useLenis";
import { Navigate, Route, Routes } from "react-router-dom";
import { LeadModal } from "@/components/forms/LeadModal";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { AdminToaster } from "@/components/admin/ui/toast";

// Public pages — lazy loaded so each route is a separate chunk.
// HomePage is kept eager as it's the most-visited entry point.
import { HomePage } from "@/pages/HomePage";
const CatalogPage = lazy(() =>
  import("@/pages/CatalogPage").then((m) => ({ default: m.CatalogPage })),
);
const CategoryPage = lazy(() =>
  import("@/pages/CategoryPage").then((m) => ({ default: m.CategoryPage })),
);
const ProductPage = lazy(() =>
  import("@/pages/ProductPage").then((m) => ({ default: m.ProductPage })),
);
const CartPage = lazy(() =>
  import("@/pages/CartPage").then((m) => ({ default: m.CartPage })),
);
const CheckoutPage = lazy(() =>
  import("@/pages/CheckoutPage").then((m) => ({ default: m.CheckoutPage })),
);
const AboutPage = lazy(() =>
  import("@/pages/AboutPage").then((m) => ({ default: m.AboutPage })),
);
const ContactsPage = lazy(() =>
  import("@/pages/ContactsPage").then((m) => ({ default: m.ContactsPage })),
);
const NotFoundPage = lazy(() =>
  import("@/pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage })),
);
const PrivacyPage = lazy(() =>
  import("@/pages/legal/PrivacyPage").then((m) => ({ default: m.PrivacyPage })),
);
const OfferPage = lazy(() =>
  import("@/pages/legal/OfferPage").then((m) => ({ default: m.OfferPage })),
);
const PersonalDataPage = lazy(() =>
  import("@/pages/legal/PersonalDataPage").then((m) => ({ default: m.PersonalDataPage })),
);
const RequisitesPage = lazy(() =>
  import("@/pages/legal/RequisitesPage").then((m) => ({ default: m.RequisitesPage })),
);

// Admin chunks lazy-loaded — keeps the public bundle slim (no xlsx / supabase admin code there).
const AdminLoginPage = lazy(() =>
  import("@/pages/admin/AdminLoginPage").then((mod) => ({ default: mod.AdminLoginPage })),
);
const AdminLayout = lazy(() =>
  import("@/pages/admin/AdminLayout").then((mod) => ({ default: mod.AdminLayout })),
);
const AdminProductsListPage = lazy(() =>
  import("@/pages/admin/AdminProductsListPage").then((mod) => ({
    default: mod.AdminProductsListPage,
  })),
);
const AdminProductFormPage = lazy(() =>
  import("@/pages/admin/AdminProductFormPage").then((mod) => ({
    default: mod.AdminProductFormPage,
  })),
);
const AdminProductsImportPage = lazy(() =>
  import("@/pages/admin/AdminProductsImportPage").then((mod) => ({
    default: mod.AdminProductsImportPage,
  })),
);
const AdminCategoriesPage = lazy(() =>
  import("@/pages/admin/AdminCategoriesPage").then((mod) => ({
    default: mod.AdminCategoriesPage,
  })),
);
const AdminLeadsPage = lazy(() =>
  import("@/pages/admin/AdminLeadsPage").then((mod) => ({
    default: mod.AdminLeadsPage,
  })),
);
const AdminOrdersListPage = lazy(() =>
  import("@/pages/admin/AdminOrdersListPage").then((mod) => ({
    default: mod.AdminOrdersListPage,
  })),
);
const AdminOrderDetailPage = lazy(() =>
  import("@/pages/admin/AdminOrderDetailPage").then((mod) => ({
    default: mod.AdminOrderDetailPage,
  })),
);

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-0">{children}</main>
      <Footer />
      <LeadModal />
      <CartDrawer />
      <CookieBanner />
    </div>
  );
}

function AdminLoading() {
  return (
    <div className="admin-scope flex min-h-screen items-center justify-center text-sm text-admin-muted-fg">
      Загрузка…
    </div>
  );
}

/** Minimal full-height blank shown while a public page chunk loads. */
function PublicLoading() {
  return <div className="min-h-screen" aria-hidden="true" />;
}

export function App() {
  useLenis();

  return (
    <>
      <AdminToaster />
      <ScrollToTop />
      <Suspense fallback={<AdminLoading />}>
        <Routes>
          {/* Admin login is public */}
          <Route path="/admin/login" element={<AdminLoginPage />} />

          {/* Admin area — guarded, its own layout, no public chrome */}
          <Route
            path="/admin"
            element={
              <RequireAdmin>
                <AdminLayout />
              </RequireAdmin>
            }
          >
            <Route index element={<Navigate to="/admin/products" replace />} />
            <Route path="products" element={<AdminProductsListPage />} />
            <Route path="products/new" element={<AdminProductFormPage />} />
            <Route path="products/import" element={<AdminProductsImportPage />} />
            <Route path="products/:id" element={<AdminProductFormPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="orders" element={<AdminOrdersListPage />} />
            <Route path="orders/:id" element={<AdminOrderDetailPage />} />
            <Route path="leads" element={<AdminLeadsPage />} />
          </Route>

          {/* Public site — each page is a separate lazy chunk; Suspense shows a
              blank full-height div while the small chunk downloads. */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
          <Suspense fallback={<PublicLoading />}>
            <Route
              path="/catalog"
              element={
                <PublicLayout>
                  <CatalogPage />
                </PublicLayout>
              }
            />
            <Route
              path="/catalog/:category"
              element={
                <PublicLayout>
                  <CategoryPage />
                </PublicLayout>
              }
            />
            <Route
              path="/product/:slug"
              element={
                <PublicLayout>
                  <ProductPage />
                </PublicLayout>
              }
            />
            <Route
              path="/cart"
              element={
                <PublicLayout>
                  <CartPage />
                </PublicLayout>
              }
            />
            <Route
              path="/checkout"
              element={
                <PublicLayout>
                  <CheckoutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/about"
              element={
                <PublicLayout>
                  <AboutPage />
                </PublicLayout>
              }
            />
            <Route
              path="/contacts"
              element={
                <PublicLayout>
                  <ContactsPage />
                </PublicLayout>
              }
            />
            <Route
              path="/privacy"
              element={
                <PublicLayout>
                  <PrivacyPage />
                </PublicLayout>
              }
            />
            <Route
              path="/offer"
              element={
                <PublicLayout>
                  <OfferPage />
                </PublicLayout>
              }
            />
            <Route
              path="/personal-data"
              element={
                <PublicLayout>
                  <PersonalDataPage />
                </PublicLayout>
              }
            />
            <Route
              path="/requisites"
              element={
                <PublicLayout>
                  <RequisitesPage />
                </PublicLayout>
              }
            />
            <Route
              path="*"
              element={
                <PublicLayout>
                  <NotFoundPage />
                </PublicLayout>
              }
            />
          </Suspense>
        </Routes>
      </Suspense>
    </>
  );
}
