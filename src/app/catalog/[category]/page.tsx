import Link from "next/link";
import { notFound } from "next/navigation";
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { cn } from "@/lib/utils";
import {
  getCategories,
  getCategoryBySlug,
  getProductsByCategory,
} from "@/lib/api";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
  searchParams?: Promise<{
    subcategory?: string | string[];
  }>;
};

function getSingleSearchParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

export async function generateStaticParams() {
  const categories = await getCategories();

  return categories.map((category) => ({
    category: category.slug,
  }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const [{ category: categorySlug }, searchParamsValue, categories] = await Promise.all([
    params,
    searchParams,
    getCategories(),
  ]);
  const category = await getCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  const activeSubcategorySlug = getSingleSearchParam(searchParamsValue?.subcategory);
  const activeSubcategory = category.subcategories?.find(
    (subcategory) => subcategory.slug === activeSubcategorySlug,
  );
  const categoryProducts = await getProductsByCategory(category.slug);
  const visibleProducts = activeSubcategory
    ? categoryProducts.filter(
        (product) => product.subcategorySlug === activeSubcategory.slug,
      )
    : categoryProducts;
  const title = activeSubcategory?.title ?? category.title;
  const description = activeSubcategory?.description ?? category.description;

  return (
    <Section>
      <Container>
        <div>
          <Link className="text-sm font-semibold text-primary" href="/catalog">
            ← В каталог
          </Link>
          <SectionTitle className="mt-5" title={title} description={description} />
        </div>

        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="mt-8 rounded-[28px] border border-border/80 bg-white/76 p-4 shadow-[0_18px_48px_rgba(7,55,99,0.05)] backdrop-blur">
            <p className="px-2 text-sm font-semibold text-foreground">Подкатегории</p>
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
              <Link
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                  !activeSubcategory
                    ? "border-primary bg-primary !text-white"
                    : "border-border bg-white text-primary hover:border-primary/35",
                )}
                href={`/catalog/${category.slug}`}
              >
                Все
              </Link>
              {category.subcategories.map((subcategory) => (
                <Link
                  className={cn(
                    "shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
                    activeSubcategory?.slug === subcategory.slug
                      ? "border-primary bg-primary !text-white"
                      : "border-border bg-white text-primary hover:border-primary/35",
                  )}
                  href={`/catalog/${category.slug}?subcategory=${subcategory.slug}`}
                  key={subcategory.id}
                >
                  {subcategory.title}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
          <CatalogCategoryNav
            activeCategorySlug={category.slug}
            activeSubcategorySlug={activeSubcategory?.slug}
            categories={categories}
          />

          <ProductSearch
            emptyDescription="В этой категории нет товаров по выбранному запросу. Попробуйте изменить поиск или выбрать другую подкатегорию."
            products={visibleProducts}
            searchPlaceholder={`Поиск в категории «${title}»`}
          />
        </div>
      </Container>
    </Section>
  );
}
