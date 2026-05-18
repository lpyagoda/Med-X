import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroReviewCard } from "@/components/home/HeroReviewCard";

const heroRays = [
  "hero-ray-1 left-[-5vw] top-[-32vh] h-[78vh] w-[10vw] -rotate-[45deg]",
  "hero-ray-2 left-[4vw] top-[-28vh] h-[150vh] w-[15vw] -rotate-[45deg]",
  "hero-ray-3 left-[19vw] top-[-42vh] h-[112vh] w-[9vw] -rotate-[52.5deg]",
  "hero-ray-4 left-[36vw] top-[-28vh] h-[106vh] w-[12vw] -rotate-[60deg]",
  "hero-ray-5 left-[-10vw] bottom-[-46vh] h-[52vh] w-[120vw] -rotate-[20deg]",
];

const heroBadges = [
  {
    value: "2000+",
    label: "товаров в каталоге",
    className: "right-[17%] top-[19%] premium-float-subtle",
  },
  {
    value: "DÜRR Dental",
    label: "оригинальная продукция",
    className: "right-[4%] top-[43%] premium-float-subtle-delayed",
  },
  {
    value: "30+ клиентов",
    label: "в стоматологической сфере",
    className: "right-[38%] bottom-[18%] premium-float-subtle-slow",
  },
];

export function HeroSection() {
  return (
    <Section
      className="relative flex min-h-svh items-center overflow-hidden bg-cover bg-center pb-12 pt-24 sm:pb-16 sm:pt-24 lg:pb-20 lg:pt-24"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgba(246, 251, 255, 0.96) 0%, rgba(246, 251, 255, 0.86) 42%, rgba(246, 251, 255, 0.2) 78%), url('/images/hero/dental-hero-bg.png')",
      }}
    >
      <div aria-hidden="true" className="hero-grid pointer-events-none absolute inset-0 z-[1]" />
      <div
        aria-hidden="true"
        className="hero-rays pointer-events-none absolute inset-0 z-[2]"
      >
        {heroRays.map((rayClass) => (
          <span className={`hero-ray absolute ${rayClass}`} key={rayClass} />
        ))}
      </div>
      {heroBadges.map((badge) => (
        <div
          className={`hero-glass pointer-events-none absolute z-10 hidden rounded-2xl px-5 py-4 lg:block ${badge.className}`}
          key={badge.value}
        >
          <p className="text-2xl font-semibold leading-none text-foreground">
            {badge.value}
          </p>
          <p className="mt-2 text-sm font-medium leading-tight text-muted">{badge.label}</p>
        </div>
      ))}
      <HeroReviewCard />

      <Container>
        <div className="relative z-10 max-w-5xl">
          <h1 className="text-4xl font-semibold leading-[1.03] text-foreground sm:text-5xl lg:text-[clamp(2.75rem,3.6vw,3.25rem)] 2xl:text-6xl">
            Стоматологическое оборудование, запасные части и комплектующие
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            Подберём оборудование, комплектующие и расходные позиции под задачи
            вашей клиники.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/catalog" size="lg">
              Смотреть каталог
            </Button>
            <LeadModalTrigger variant="outline" size="lg">
              Оставить заявку
            </LeadModalTrigger>
          </div>
        </div>
      </Container>
    </Section>
  );
}
