import Link from "next/link";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import type { NavItem } from "@/types/navigation";

const navItems: NavItem[] = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/62 backdrop-blur">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1.4fr_1fr]">
        <div>
          <Link className="text-xl font-bold text-primary" href="/">
            MED-IX
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted">
            Поставщик стоматологического оборудования, комплектующих и расходных
            позиций для клиник, кабинетов и лабораторий.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Навигация</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className="transition-colors hover:text-primary" href={item.href}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Категории</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {categories.map((category) => (
              <li key={category.id}>
                <Link
                  className="transition-colors hover:text-primary"
                  href={`/catalog/${category.slug}`}
                >
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Контакты</p>
          <div className="mt-4 space-y-3 text-sm text-muted">
            <p>
              <Link className="transition-colors hover:text-primary" href="tel:+79821981521">
                +7 982 198-15-21
              </Link>
            </p>
            <p>
              <Link className="transition-colors hover:text-primary" href="tel:+79180844462">
                +7 918 084-44-62
              </Link>
            </p>
            <p>
              <Link className="transition-colors hover:text-primary" href="mailto:Rada-Med-X@yandex.ru">
                Rada-Med-X@yandex.ru
              </Link>
            </p>
            <p>Telegram / MAX</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
