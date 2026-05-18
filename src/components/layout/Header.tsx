import Link from "next/link";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
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
        <Link className="shrink-0 text-lg font-bold text-foreground xl:text-xl" href="/">
          MED-IX
        </Link>

        <nav className="hidden md:block" aria-label="Основная навигация">
          <ul className="flex items-center gap-7 text-sm font-medium text-foreground xl:gap-9 xl:text-base">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <LeadModalTrigger size="sm">
          Оставить заявку
        </LeadModalTrigger>
      </div>
    </header>
  );
}
