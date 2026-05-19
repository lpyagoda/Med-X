import { useEffect, useState } from "react";
import { CategoryGrid } from "@/components/catalog/CategoryGrid";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { BenefitsSection } from "@/components/home/BenefitsSection";
import { DurrDentalBlock } from "@/components/home/DurrDentalBlock";
import { HeroSection } from "@/components/home/HeroSection";
import { HomeCTA } from "@/components/home/HomeCTA";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";

export function HomePage() {
  // First paint: static data (instant). Then hydrate from Supabase so admin-
  // uploaded category images appear without a network round-trip blocking render.
  const [categories, setCategories] = useState(() => getCategories());
  const products = getProducts();
  const popularProducts = products.slice(0, 6);

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

      <BenefitsSection />

      <Section className="bg-card-soft py-10 sm:py-12 lg:py-16">
        <Container>
          <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
            <div className="flex min-h-[360px] items-center rounded-[28px] border border-white/80 bg-white p-7 shadow-[0_24px_70px_rgba(7,55,99,0.08)] sm:p-10 lg:min-h-[430px] lg:p-14">
              <div className="max-w-xl">
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
                  MED-IX
                </p>
                <h2 className="mt-4 text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl">
                  О компании
                </h2>
                <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
                  Компания занимается продажей стоматологического оборудования,
                  запасных частей и сопутствующих товаров для клиник, кабинетов и
                  лабораторий. Сайт помогает быстро показать ассортимент, принять
                  заявку и передать обращение менеджеру.
                </p>
                <Button href="/about" variant="outline" className="mt-7">
                  Подробнее о компании
                </Button>
              </div>
            </div>

            <div className="relative min-h-[320px] overflow-hidden rounded-[28px] shadow-[0_24px_70px_rgba(7,55,99,0.1)] sm:min-h-[380px] lg:min-h-[430px]">
              <img
                src="/images/hero/dental-hero-bg.png"
                alt="Современный стоматологический кабинет"
                className="absolute inset-0 h-full w-full object-cover object-[72%_center]"
                loading="lazy"
              />
            </div>
          </div>
        </Container>
      </Section>

      <HomeCTA />
    </>
  );
}
