import { useRef, useState, type MouseEvent } from "react";
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
  const ref = useRef<HTMLElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [hovered, setHovered] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setMouseX(e.clientX - rect.left);
  };

  return (
    <footer
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative border-t border-border/70 bg-white/62 backdrop-blur"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(400px at ${mouseX}px 0px, rgba(59,130,246,0.7), transparent 70%)`,
        }}
      />
      <Container className="grid gap-8 py-12 sm:grid-cols-2 md:grid-cols-[1.4fr_1fr_1.4fr_1.1fr]">
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
            <li className="flex flex-col gap-2">
              {[
                { label: "Телеграм", href: TELEGRAM_URL, icon: <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M21.7 3.4 2.6 10.9c-1 .4-1 1 .2 1.4l4.6 1.4 1.8 5.7c.2.7.4.9.9.9.4 0 .6-.2 1-.5l2-2 4.3 3.2c.8.4 1.4.2 1.6-.7l2.9-13.6c.3-1.3-.5-1.8-1.2-1.3Zm-3.9 4-7.7 7c-.3.3-.5.5-.6.8l-.3 2.7-1.2-4 9.8-6.1c.4-.3.8-.1.5.6Z" /></svg> },
                { label: "Ватсап", href: WHATSAPP_URL, icon: <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M19.1 4.9A9.85 9.85 0 0 0 12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.5 1.3 5L2 22l5.2-1.4c1.5.8 3.1 1.2 4.8 1.2 5.5 0 10-4.5 10-10 0-2.7-1-5.2-2.9-6.9ZM12 20c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3c-.8-1.4-1.3-3-1.3-4.6 0-4.5 3.7-8.3 8.3-8.3 2.2 0 4.3.9 5.9 2.4 1.6 1.6 2.4 3.7 2.4 5.9.1 4.7-3.6 8.5-8.2 8.5Zm4.5-6.2c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.2.2-.3.2-.6.1-1.4-.7-2.4-1.3-3.3-2.9-.2-.4.2-.4.6-1.2.1-.1 0-.3 0-.4 0-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1 2.7.1.2 1.8 2.8 4.5 3.9 1.7.7 2.3.7 3.1.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2-.1-.1-.2-.2-.5-.3Z" /></svg> },
                { label: "Макс", href: MAX_URL, icon: <svg aria-hidden="true" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24"><path d="M6 18V8.2c0-.5.5-.8.9-.5L12 11l5.1-3.3c.4-.3.9 0 .9.5V18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.1" /></svg> },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-white/85 px-3 py-1.5 text-xs font-medium text-primary transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white"
                >
                  {icon}{label}
                </a>
              ))}
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
