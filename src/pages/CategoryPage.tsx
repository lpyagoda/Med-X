import { useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
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
import { fetchPublicCategories } from "@/lib/public/catalogue";

export function CategoryPage() {
  const { category: categorySlug } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState(() => getCategories());

  useEffect(() => {
    let cancelled = false;
    fetchPublicCategories()
      .then((rows) => {
        if (cancelled || rows.length === 0) return;
        setCategories(rows);
      })
      .catch(() => {
        // Silent fallback to static data
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const category = categorySlug
    ? categories.find((c) => c.slug === categorySlug) ?? getCategoryBySlug(categorySlug)
    : undefined;

  if (!category) {
    return <Navigate to="/404" replace />;
  }

  const activeSubcategorySlug = searchParams.get("subcategory") ?? undefined;
  const activeSubcategory = category.subcategories?.find(
    (subcategory) => subcategory.slug === activeSubcategorySlug,
  );
  const categoryProducts = getProductsByCategory(category.slug);
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
          <Link className="text-sm font-semibold text-primary" to="/catalog">
            ← В каталог
          </Link>
          <SectionTitle className="mt-5" title={title} description={description} />
        </div>

        {category.subcategories && category.subcategories.length > 0 ? (
          <div className="mt-8 flex flex-wrap gap-2.5">
            <Link
              className={cn(
                "inline-flex items-center rounded-full border px-[1.15rem] py-[0.625rem] text-[0.95rem] font-semibold transition-colors",
                !activeSubcategory
                  ? "border-primary bg-primary text-white! shadow-[0_12px_24px_rgba(7,55,99,0.18)]"
                  : "border-border bg-white text-primary hover:border-primary/45",
              )}
              to={`/catalog/${category.slug}`}
            >
              Все
            </Link>
            {category.subcategories.map((subcategory) => (
              <Link
                className={cn(
                  "inline-flex items-center rounded-full border px-[1.15rem] py-[0.625rem] text-[0.95rem] font-semibold transition-colors",
                  activeSubcategory?.slug === subcategory.slug
                    ? "border-primary bg-primary text-white! shadow-[0_12px_24px_rgba(7,55,99,0.18)]"
                    : "border-border bg-white text-primary hover:border-primary/45",
                )}
                to={`/catalog/${category.slug}?subcategory=${subcategory.slug}`}
                key={subcategory.id}
              >
                {subcategory.title}
              </Link>
            ))}
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
