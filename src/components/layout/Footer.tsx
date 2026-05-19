import { Link } from "react-router-dom";
import { categories } from "@/data/categories";
import { Container } from "@/components/ui/Container";
import { SocialIcons } from "@/components/layout/SocialIcons";
import {
  EMAIL,
  MAX_URL,
  PRIMARY_PHONE,
  SECONDARY_PHONE,
  TELEGRAM_URL,
  WHATSAPP_URL,
  WORK_HOURS,
} from "@/lib/contacts";
import { LEGAL_ENTITY } from "@/lib/legal";
import type { NavItem } from "@/types/navigation";

const navItems: NavItem[] = [
  { label: "Главная", href: "/" },
  { label: "Каталог", href: "/catalog" },
  { label: "О компании", href: "/about" },
  { label: "Контакты", href: "/contacts" },
];

const linkClass = "transition-colors hover:text-primary";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-white/62 backdrop-blur">
      <Container className="grid gap-8 py-12 md:grid-cols-[1.4fr_1fr_1.4fr_1.1fr]">
        <div>
          <Link className="text-xl font-bold text-primary" to="/">
            MED-IX
          </Link>
          <p className="mt-5 max-w-md text-sm leading-6 text-muted">
            Поставщик стоматологического оборудования, комплектующих и расходных
            позиций для клиник, кабинетов и лабораторий.
          </p>
          <SocialIcons className="mt-6" size="sm" variant="subtle" />
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Навигация</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link className={linkClass} to={item.href}>
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
                <Link className={linkClass} to={`/catalog/${category.slug}`}>
                  {category.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-foreground">Контакты</p>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>
              <a className={linkClass} href={PRIMARY_PHONE.href}>
                {PRIMARY_PHONE.label}
              </a>
            </li>
            <li>
              <a className={linkClass} href={SECONDARY_PHONE.href}>
                {SECONDARY_PHONE.label}
              </a>
            </li>
            <li>
              <a className={linkClass} href={EMAIL.href}>
                {EMAIL.label}
              </a>
            </li>
            <li className="pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Мессенджеры
            </li>
            <li className="flex flex-wrap gap-x-3 gap-y-1">
              <a className={linkClass} href={TELEGRAM_URL} rel="noreferrer" target="_blank">
                Telegram
              </a>
              <span className="text-muted/50">·</span>
              <a className={linkClass} href={WHATSAPP_URL} rel="noreferrer" target="_blank">
                WhatsApp
              </a>
              <span className="text-muted/50">·</span>
              <a className={linkClass} href={MAX_URL} rel="noreferrer" target="_blank">
                MAX
              </a>
            </li>
            <li className="pt-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Режим работы
            </li>
            <li>
              {WORK_HOURS.hours}
              <span className="ml-1 text-muted/80">· {WORK_HOURS.weekend}</span>
            </li>
          </ul>
        </div>
      </Container>

      <div className="border-t border-border/60 bg-white/50">
        <Container className="flex flex-col gap-3 py-5 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-x-2 gap-y-1">
            <span>{LEGAL_ENTITY.shortName}</span>
            <span className="text-muted/50">·</span>
            <span>ИНН {LEGAL_ENTITY.inn}</span>
            <span className="text-muted/50">·</span>
            <Link className={linkClass} to="/requisites">
              Реквизиты
            </Link>
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            <Link className={linkClass} to="/offer">
              Публичная оферта
            </Link>
            <Link className={linkClass} to="/privacy">
              Политика конфиденциальности
            </Link>
            <Link className={linkClass} to="/personal-data">
              Согласие на обработку перс. данных
            </Link>
          </div>
        </Container>
        <Container className="pb-4 text-[11px] leading-5 text-muted/80">
          Информация о товарах, ценах, наличии и комплектации, размещённая на сайте,
          носит справочный характер и не является публичной офертой по смыслу ст.
          437 ГК РФ. Финальные условия согласовываются с менеджером.
        </Container>
      </div>
    </footer>
  );
}
