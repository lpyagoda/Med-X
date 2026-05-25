import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
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
    <Section className="flex h-svh flex-col overflow-hidden pb-0 pt-0">
      {/* Photo area */}
      <div
        className="relative min-h-0 flex-1 bg-cover bg-center pt-24"
        style={{ backgroundImage: "url('/images/hero/dental-hero-bg.png')" }}
      >
        <HeroReviewCard />
      </div>

      {/* Text card — sits below the photo, never overlaps it */}
      <div
        className="w-full shrink-0 p-6 sm:p-8"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.92) 100%)" }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          МЕД-ИКС
        </p>
        <h1 className="text-[1.75rem] font-semibold leading-[1.08] text-foreground sm:text-[2.2rem] md:text-[2.8rem] lg:text-[clamp(2.4rem,3.6vw,3.4rem)]">
          Стоматологическое оборудование, запасные части и комплектующие
        </h1>
        <p className="mt-5 text-base text-muted sm:text-[1.05rem]" style={{ lineHeight: "1.2" }}>
          Подберём оборудование, комплектующие и расходные позиции под задачи
          вашей клиники.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          <Button href="/catalog" size="lg" className="w-full">
            Смотреть каталог
          </Button>
          <LeadModalTrigger variant="outline" size="lg" className="w-full">
            Оставить заявку
          </LeadModalTrigger>
        </div>
      </div>
    </Section>
  );
}
