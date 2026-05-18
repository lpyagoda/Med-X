import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";

export default async function CatalogPage() {
  const [categories, products] = await Promise.all([getCategories(), getProducts()]);

  return (
    <Section>
      <Container>
        <div className="grid gap-6 lg:grid-cols-[1fr_460px] lg:items-end">
          <SectionTitle
            title="Каталог оборудования"
            description="Стоматологическое оборудование, запасные части, расходные материалы и сопутствующие товары для клиник, кабинетов и лабораторий."
          />
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
