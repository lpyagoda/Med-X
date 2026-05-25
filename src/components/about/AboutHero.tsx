import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

const heroBadges = [
  {
    value: "2000+",
    label: "товаров в каталоге",
    animClass: "premium-float-subtle",
  },
  {
    value: "DÜRR Dental",
    label: "оригинальная продукция",
    animClass: "premium-float-subtle-delayed",
  },
  {
    value: "30+ клиентов",
    label: "в стоматологической сфере",
    animClass: "premium-float-subtle-slow",
  },
] as const;

export function AboutHero() {
  return (
    <Section className="relative overflow-hidden pb-12 pt-24 sm:pt-28 lg:pt-28">
      {/* Full-bleed background image */}
      <img
        src="/images/about-hero-equipment-bg.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-60"
        loading="eager"
      />

      {/* Content */}
      <Container className="relative">
        <div className="max-w-2xl rounded-2xl bg-white/80 p-6 backdrop-blur-sm sm:p-8">
          <p className="text-sm font-semibold text-primary">MED-IX</p>
          <h1 className="mt-4 text-2xl font-semibold leading-[1.06] text-foreground sm:text-3xl lg:text-4xl">
            Поставляем стоматологическое оборудование, запасные части и
            сопутствующие товары для клиник, кабинетов и зуботехнических
            лабораторий
          </h1>
          <p className="mt-5 text-base text-muted" style={{ lineHeight: "1.2" }}>
            Помогаем подобрать нужные позиции под задачу, уточнить
            характеристики, стоимость, сроки поставки и условия заказа.
          </p>

          {/* Badges — horizontal with wrap */}
          <div className="mt-5 flex flex-wrap gap-2">
            {heroBadges.map((badge) => (
              <div
                key={badge.value}
                className="rounded-xl border border-white/80 bg-white/70 px-3 py-2 backdrop-blur-sm"
              >
                <p className="text-sm font-semibold leading-none text-foreground">{badge.value}</p>
                <p className="mt-1 text-xs font-medium leading-tight text-muted">{badge.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col gap-3">
            <Button href="/catalog" size="lg" className="w-full">
              Перейти в каталог
            </Button>
            <LeadModalTrigger size="lg" variant="outline" className="w-full">
              Оставить заявку
            </LeadModalTrigger>
          </div>
        </div>
      </Container>
    </Section>
  );
}
