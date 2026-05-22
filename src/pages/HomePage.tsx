import { useEffect, useState } from "react";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { DurrDentalBlock } from "@/components/home/DurrDentalBlock";
import { HomeBackgroundRays } from "@/components/home/HomeBackgroundRays";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCTA } from "@/components/home/HomeCTA";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";
import { useScrollBackground } from "@/lib/useScrollBackground";

export function HomePage() {
  // First paint: static data (instant). Then hydrate from Supabase so admin-
  // uploaded category images appear without a network round-trip blocking render.
  const [categories, setCategories] = useState(() => getCategories());
  const products = getProducts();
  const popularProducts = products.slice(0, 6);
  const { darkSentinelRef, isDarkBackground } = useScrollBackground();

  useEffect(() => {
    let cancelled = false;
    fetchPublicCategories()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setCategories(rows);
      })
      .catch(() => {
        // Public Supabase fetch failed (network/rls) — silently keep static data.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <HeroSection />

      <div style={{ backgroundColor: "#f6fbff" }}>
      <div className="relative isolate z-[1]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[5] h-40"
          style={{ background: "linear-gradient(to bottom, rgba(246,251,255,0) 0%, #f6fbff 100%)" }}
        />
        <div aria-hidden="true" className="home-grid-backdrop pointer-events-none absolute inset-0 z-0">
          <div className="home-continuous-grid absolute inset-0" />
          <div className="home-grid-vignette sticky top-0 h-svh w-full" />
        </div>
        <div className="relative z-10">
          <Section className="pt-8">
            <Container>
              <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <SectionTitle
                  title="Категории товаров"
                  description="Основные направления каталога: оборудование, расходные материалы, дезинфекция и запасные части."
                />
                <Button href="/catalog" variant="outline">
                  В каталог
                </Button>
              </div>
              <CategoryGrid categories={categories} className="mt-10" />
            </Container>
          </Section>

          <Section className="py-8 sm:py-10 lg:py-12">
            <Container>
              <DurrDentalBlock />
            </Container>
          </Section>

          <Section>
            <Container>
              <SectionTitle
                title="Популярные товары"
                description="Оборудование и позиции, которые чаще всего запрашивают для клиник и кабинетов."
              />
              <ProductGrid products={popularProducts} variant="minimal" className="mt-10" />
            </Container>
          </Section>
        </div>
      </div>

      <div ref={darkSentinelRef} aria-hidden="true" />
      <div
        className="relative isolate transition-colors duration-[1200ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ backgroundColor: isDarkBackground ? "#e8f3f9" : "transparent" }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-[10] h-24"
          style={{ background: "linear-gradient(to bottom, #f6fbff 0%, rgba(246,251,255,0) 100%)" }}
        />
        <HomeBackgroundRays visible={isDarkBackground} />
        <div className="relative z-[1]">
          <BenefitsSection />

          <Section className="py-14 sm:py-18 lg:py-24">
            <Container>
              <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                {/* Left: text + stats */}
                <div className="flex flex-col">
                  <div className="rounded-[24px] border border-border/60 bg-white p-8 shadow-[0_8px_32px_rgba(7,55,99,0.07)]">
                    <p className="text-sm font-medium text-muted">О компании</p>
                    <h2 className="mt-3 text-4xl font-bold leading-[1.08] text-foreground sm:text-5xl">
                      Стоматологическое оборудование с&nbsp;гарантией качества
                    </h2>
                    <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                      Компания занимается продажей стоматологического оборудования,
                      запасных частей и сопутствующих товаров для клиник, кабинетов и
                      лабораторий. Сайт помогает быстро показать ассортимент, принять
                      заявку и передать обращение менеджеру.
                    </p>
                    <Button href="/about" variant="outline" className="mt-8 self-start">
                      Подробнее о компании
                    </Button>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4">
                    {[
                      { value: "500+", label: "позиций в каталоге" },
                      { value: "8 лет", label: "на рынке" },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className="rounded-[20px] border border-border/60 bg-white p-6 shadow-[0_8px_24px_rgba(7,55,99,0.06)]"
                      >
                        <span className="block text-5xl font-normal text-foreground sm:text-6xl">
                          {stat.value}
                        </span>
                        <span className="mt-3 block text-base text-foreground">{stat.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: photo */}
                <div className="relative min-h-[280px] self-stretch overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(7,55,99,0.12)] sm:min-h-[360px] lg:min-h-0">
                  <img
                    src="/images/about-equipment-workshop.png"
                    alt="Стоматологическое оборудование"
                    className="absolute inset-0 h-full w-full object-cover object-center"
                    loading="lazy"
                  />
                </div>
              </div>
            </Container>
          </Section>

          <HomeCTA />
        </div>
      </div>
      </div>
    </>
  );
}
