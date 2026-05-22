import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { CartButton } from "@/components/layout/CartButton";
import { SocialIcons } from "@/components/layout/SocialIcons";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { PRIMARY_PHONE, SECONDARY_PHONE } from "@/lib/contacts";
import type { NavItem } from "@/types/navigation";

const navItems: NavItem[] = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-3 md:px-0">
        <div className="container-frame flex min-h-14 items-center justify-between gap-4 rounded-[20px] border border-white/70 bg-white/58 px-4 shadow-[0_16px_44px_rgba(16,24,40,0.12)] backdrop-blur-xl md:px-5 xl:min-h-16 xl:rounded-[24px] xl:px-6 2xl:min-h-[72px] 2xl:rounded-[28px] 2xl:px-7">
          <Link className="shrink-0" to="/" onClick={() => setMobileOpen(false)}>
            <img src="/SVG/logo.svg" alt="MED-IX" className="h-6 w-auto xl:h-7 2xl:h-8" />
          </Link>

          <nav className="hidden md:block" aria-label="Основная навигация">
            <ul className="flex items-center gap-7 text-sm font-medium text-foreground xl:gap-9 xl:text-base">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link className="transition-colors hover:text-primary" to={item.href}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3 xl:gap-4">
            <div className="hidden flex-col items-end leading-tight xl:flex">
              <a
                className="text-base font-bold tracking-tight text-foreground transition-colors hover:text-primary"
                href={PRIMARY_PHONE.href}
              >
                {PRIMARY_PHONE.label}
              </a>
              <a
                className="text-xs font-semibold text-muted transition-colors hover:text-primary"
                href={SECONDARY_PHONE.href}
              >
                {SECONDARY_PHONE.label}
              </a>
            </div>

            <SocialIcons className="hidden md:flex" size="sm" variant="subtle" />

            <CartButton />
            <LeadModalTrigger className="hidden sm:inline-flex" size="sm">
              Оставить заявку
            </LeadModalTrigger>

            {/* Burger button — mobile only */}
            <button
              aria-label={mobileOpen ? "Закрыть меню" : "Открыть меню"}
              aria-expanded={mobileOpen}
              className="relative flex h-11 w-11 shrink-0 flex-col items-center justify-center gap-[5px] rounded-full bg-white/80 shadow-[0_2px_8px_rgba(7,55,99,0.10)] transition hover:bg-white md:hidden"
              onClick={() => setMobileOpen((v) => !v)}
              type="button"
            >
              <span
                className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-200 ${mobileOpen ? "translate-y-[7px] rotate-45" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-200 ${mobileOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block h-0.5 w-5 rounded-full bg-foreground transition-all duration-200 ${mobileOpen ? "-translate-y-[7px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile nav panel */}
      <nav
        aria-label="Мобильная навигация"
        className={`fixed left-4 right-4 top-[4.5rem] z-40 overflow-hidden rounded-[20px] border border-white/70 bg-white/95 shadow-[0_16px_44px_rgba(16,24,40,0.14)] backdrop-blur-xl transition-all duration-200 md:hidden ${
          mobileOpen ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 -translate-y-2"
        }`}
      >
        <ul className="flex flex-col divide-y divide-border/40 px-2 py-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                className="flex min-h-[52px] items-center px-4 text-base font-medium text-foreground transition-colors hover:text-primary"
                to={item.href}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="border-t border-border/40 px-4 py-4">
          <a
            className="block text-base font-bold text-primary"
            href={PRIMARY_PHONE.href}
          >
            {PRIMARY_PHONE.label}
          </a>
          <a
            className="mt-1 block text-sm text-muted"
            href={SECONDARY_PHONE.href}
          >
            {SECONDARY_PHONE.label}
          </a>
          <LeadModalTrigger className="mt-4 w-full" size="sm" onClick={() => setMobileOpen(false)}>
            Оставить заявку
          </LeadModalTrigger>
        </div>
      </nav>
    </>
  );
}
