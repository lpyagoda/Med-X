import { Link } from "react-router-dom";
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
  return (
    <header className="fixed left-0 right-0 top-0 z-50 px-4 pt-3 md:px-0">
      <div className="container-frame flex min-h-14 items-center justify-between gap-4 rounded-[20px] border border-white/70 bg-white/58 px-4 shadow-[0_16px_44px_rgba(16,24,40,0.12)] backdrop-blur-xl md:px-5 xl:min-h-16 xl:rounded-[24px] xl:px-6 2xl:min-h-[72px] 2xl:rounded-[28px] 2xl:px-7">
        <Link className="shrink-0 text-lg font-bold text-foreground xl:text-xl" to="/">
          MED-IX
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
        </div>
      </div>
    </header>
  );
}
