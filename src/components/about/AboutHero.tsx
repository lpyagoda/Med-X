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
    <Section className="pb-8 pt-24 sm:pt-28 lg:pt-28">
      <Container>
        <div className="relative overflow-hidden rounded-[36px] border border-border/70 bg-[linear-gradient(135deg,#ffffff_0%,#eef9fc_58%,#f8fcff_100%)] p-6 shadow-[0_28px_84px_rgba(7,55,99,0.08)] sm:p-8 lg:p-12">
          <img
            src="/images/about-hero-equipment-bg.png"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover object-right opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.97)_0%,rgba(255,255,255,0.85)_45%,rgba(255,255,255,0.1)_100%)]"
          />

          <div className="relative">
            <p className="text-sm font-semibold text-primary">MED-IX</p>
            <h1 className="mt-5 max-w-5xl text-3xl font-semibold leading-[1.06] text-foreground sm:text-4xl lg:text-5xl">
              Поставляем стоматологическое оборудование, запасные части и
              сопутствующие товары для клиник, кабинетов и зуботехнических
              лабораторий
            </h1>
          </div>

          <div className="relative mt-8 grid gap-8 lg:grid-cols-[1fr_minmax(0,1.1fr)] lg:items-end">
            <div>
              <p className="text-lg leading-8 text-muted">
                Помогаем подобрать нужные позиции под задачу, уточнить
                характеристики, стоимость, сроки поставки и условия заказа.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button className="w-full sm:w-fit" href="/catalog" size="lg">
                  Перейти в каталог
                </Button>
                <LeadModalTrigger
                  className="w-full sm:w-fit"
                  size="lg"
                  variant="outline"
                >
                  Оставить заявку
                </LeadModalTrigger>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {heroBadges.map((badge) => (
                <div
                  className={`${badge.animClass} rounded-2xl border border-white/80 bg-white/70 px-4 py-5 backdrop-blur-sm`}
                  key={badge.value}
                >
                  <p className="text-xl font-semibold leading-none text-foreground sm:text-2xl">
                    {badge.value}
                  </p>
                  <p className="mt-2 text-xs font-medium leading-tight text-muted sm:text-sm">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
