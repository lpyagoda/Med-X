import { Outlet } from "react-router";
import { useLenis } from "@/lib/useLenis";
import { LeadModal } from "@/components/forms/LeadModal";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { CookieBanner } from "@/components/legal/CookieBanner";

/**
 * Public chrome shared by every visitor-facing route. Header/Footer/modals
 * render once; the matched page fills <Outlet />. Lenis smooth-wheel is mounted
 * here (not in the admin tree) so it never hijacks the admin scroll container.
 */
export default function PublicLayout() {
  useLenis();
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 pt-0">
        <Outlet />
      </main>
      <Footer />
      <LeadModal />
      <CartDrawer />
      <CookieBanner />
    </div>
  );
}
