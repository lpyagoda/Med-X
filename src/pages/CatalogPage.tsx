import { useEffect, useState } from "react";
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";

export function CatalogPage() {
  // Start with static data for instant paint, hydrate from Supabase so admin
  // edits (new categories, renames, images) show up without a hard refresh.
  const [categories, setCategories] = useState(() => getCategories());
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
    <Section>
      <Container>
        <SectionTitle
          title="Каталог оборудования"
          description="Стоматологическое оборудование, запасные части, расходные материалы и сопутствующие товары для клиник, кабинетов и лабораторий."
        />
        <div className="mt-6">
          <PriceNotice />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
          <CatalogCategoryNav categories={categories} />

          <ProductSearch
            products={products}
            searchPlaceholder="Поиск по названию, бренду, производителю или категории"
          />
        </div>
      </Container>
    </Section>
  );
}
