import { Button } from "@/components/ui/Button";
import { LeadModalTrigger } from "@/components/forms/LeadModalTrigger";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { HeroReviewCard } from "@/components/home/HeroReviewCard";

export function HeroSection() {
  return (
    <Section
      className="relative flex h-svh flex-col overflow-hidden pb-0 pt-0 lg:min-h-svh lg:bg-cover lg:bg-center lg:pt-24"
      style={{ backgroundImage: "url('/images/hero/dental-hero-bg.png')" }}
    >
      {/* Mobile: photo fills top area */}
      <div
        className="relative min-h-0 flex-1 bg-cover bg-center pt-24 lg:hidden"
        style={{ backgroundImage: "url('/images/hero/dental-hero-bg.png')" }}
      >
        <HeroReviewCard />
      </div>

      {/* Desktop: overlays on full-screen bg */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{ background: "linear-gradient(to bottom, transparent 50%, rgba(7,55,99,0.42) 100%)" }}
      />
      <div aria-hidden="true" className="hero-text-blur pointer-events-none absolute inset-0 z-[1] hidden lg:block" />
      <div className="hidden lg:block"><HeroReviewCard /></div>

      {/* Mobile: white text card below photo */}
      <div
        className="w-full shrink-0 p-6 sm:p-8 lg:hidden"
        style={{ background: "linear-gradient(to bottom, rgba(255,255,255,0.72) 0%, rgba(255,255,255,0.92) 100%)" }}
      >
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          МЕД-ИКС
        </p>
        <h1 className="text-[1.75rem] font-semibold leading-[1.08] text-foreground sm:text-[2.2rem] md:text-[2.8rem]">
          Стоматологическое оборудование, запасные части и комплектующие
        </h1>
        <p className="mt-5 text-base text-muted sm:text-[1.05rem]" style={{ lineHeight: "1.2" }}>
          Подберём оборудование, комплектующие и расходные позиции под задачи вашей клиники.
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

      {/* Desktop: white text overlaid at bottom of photo */}
      <div className="relative z-[2] mt-auto hidden pb-12 lg:block lg:pb-16">
        <Container>
          <div className="max-w-[960px]">
            <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              МЕД-ИКС
            </p>
            <h1 className="text-[2rem] font-semibold leading-[1.08] text-white sm:text-[2.6rem] md:text-[3.2rem] lg:text-[clamp(3rem,4.2vw,4rem)]">
              Стоматологическое оборудование, запасные части и комплектующие
            </h1>
            <p className="mt-5 max-w-[520px] text-base leading-7 text-white sm:text-[1.05rem]">
              Подберём оборудование, комплектующие и расходные позиции под задачи вашей клиники.
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
