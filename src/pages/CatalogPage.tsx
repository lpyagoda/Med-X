import { useEffect, useState } from "react";
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { CatalogQuickCategories } from "@/components/catalog/CatalogQuickCategories";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";

export function CatalogPage() {
  const [categories, setCategories] = useState(() => getCategories());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const products = getProducts();

  useEffect(() => {
    let cancelled = false;
    fetchPublicCategories()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setCategories(rows);
      })
      .catch(() => {
        // Fall back to static catalogue silently.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <MobileFilterDrawer
        categories={categories}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />

      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Container>
          <SectionTitle
            title="Каталог оборудования"
            description="Стоматологическое оборудование, запасные части, расходные материалы и сопутствующие товары для клиник, кабинетов и лабораторий."
          />
          <div className="mt-5 flex items-center gap-2">
            <PriceNotice />
          </div>

          <div className="mt-6">
            <CatalogQuickCategories categories={categories} />
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
            <CatalogCategoryNav categories={categories} />

            <ProductSearch
              products={products}
              searchPlaceholder="Поиск по названию, бренду, производителю или категории"
              onFilterClick={() => setMobileFilterOpen((v) => !v)}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
