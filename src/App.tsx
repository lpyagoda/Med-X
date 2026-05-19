import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LeadModal } from "@/components/forms/LeadModal";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { CookieBanner } from "@/components/legal/CookieBanner";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { HomePage } from "@/pages/HomePage";
import { CatalogPage } from "@/pages/CatalogPage";
import { CategoryPage } from "@/pages/CategoryPage";
import { ProductPage } from "@/pages/ProductPage";
import { CartPage } from "@/pages/CartPage";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { AboutPage } from "@/pages/AboutPage";
import { ContactsPage } from "@/pages/ContactsPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { PrivacyPage } from "@/pages/legal/PrivacyPage";
import { OfferPage } from "@/pages/legal/OfferPage";
import { PersonalDataPage } from "@/pages/legal/PersonalDataPage";
import { RequisitesPage } from "@/pages/legal/RequisitesPage";
import { AdminToaster } from "@/components/admin/ui/toast";

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

export function App() {
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

          {/* Public site */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <HomePage />
              </PublicLayout>
            }
          />
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
        </Routes>
      </Suspense>
    </>
  );
}
