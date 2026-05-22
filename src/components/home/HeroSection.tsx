import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroReviewCard } from "@/components/home/HeroReviewCard";

const heroBadges = [
  {
    value: "2000+",
    label: "товаров в каталоге",
    className: "right-[28%] top-[12%] -rotate-[2deg] premium-float-subtle",
  },
  {
    value: "DÜRR Dental",
    label: "оригинальная продукция",
    className: "right-[5%] top-[52%] rotate-[1.5deg] premium-float-subtle-delayed",
  },
  {
    value: "30+ клиентов",
    label: "в стоматологической сфере",
    className: "left-[48%] top-[30%] rotate-[2.5deg] premium-float-subtle-slow",
  },
];

export function HeroSection() {
  return (
    <Section
      className="relative flex min-h-svh flex-col overflow-hidden bg-cover bg-center pb-0 pt-24 sm:pt-24"
      style={{ backgroundImage: "url('/images/hero/dental-hero-bg.png')" }}
    >
      {/* Subtle bottom depth vignette only — no left white fog */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, transparent 50%, rgba(7,55,99,0.42) 100%)",
        }}
      />

      {/* Localised blur behind the text area — fades to transparent to the right */}
      <div
        aria-hidden="true"
        className="hero-text-blur pointer-events-none absolute inset-0 z-[1]"
      />

      {/* Floating badges — hidden for now */}

      {/* Review card — absolute bottom-right */}
      <HeroReviewCard />

      {/* Text block — lower in hero, wider, directly on blurred photo */}
      <div className="relative z-[2] mt-auto pb-12 sm:pb-14 lg:pb-16">
        <Container>
          <div className="max-w-[960px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              МЕД-ИКС
            </p>
            <h1 className="text-[2.6rem] font-semibold leading-[1.04] text-white sm:text-[3.2rem] lg:text-[clamp(3rem,4.2vw,4rem)]">
              Стоматологическое оборудование, запасные части и комплектующие
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-white sm:text-[1.05rem]">
              Подберём оборудование, комплектующие и расходные позиции под задачи
              вашей клиники.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/catalog" size="lg">
                Смотреть каталог
              </Button>
              <LeadModalTrigger variant="outline" size="lg">
                Оставить заявку
              </LeadModalTrigger>
            </div>
          </div>
        </Container>
      </div>
    </Section>
  );
}
