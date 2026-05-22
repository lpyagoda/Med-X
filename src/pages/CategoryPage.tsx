import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { BrandSearch } from "@/components/catalog/BrandSearch";
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { cn } from "@/lib/utils";
import { getBrandSlug, getCategoryBrands } from "@/lib/catalogBrands";
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
  const activeBrandSlug = searchParams.get("brand") ?? undefined;
  const viewMode = searchParams.get("view") === "brands" ? "brands" : "products";
  const activeSubcategory = category.subcategories?.find(
    (subcategory) => subcategory.slug === activeSubcategorySlug,
  );
  const categoryProducts = useMemo(
    () => getProductsByCategory(category.slug),
    [category.slug],
  );
  const categoryBrands = useMemo(
    () => getCategoryBrands(category.slug, category.title, categoryProducts),
    [category.slug, category.title, categoryProducts],
  );
  const activeBrand = categoryBrands.find((brand) => brand.slug === activeBrandSlug);
  const scopedProducts = activeSubcategory
    ? categoryProducts.filter(
        (product) => product.subcategorySlug === activeSubcategory.slug,
      )
    : categoryProducts;
  const visibleProducts = activeBrand
    ? scopedProducts.filter((product) => getBrandSlug(product.brand) === activeBrand.slug)
    : scopedProducts;
  const title = activeSubcategory?.title ?? category.title;
  const description = activeSubcategory?.description ?? category.description;
  const productsModeHref = `/catalog/${category.slug}`;
  const brandsModeHref = `/catalog/${category.slug}?view=brands`;

  return (
    <Section className="pt-28 sm:pt-32 lg:pt-36">
      <Container>
        <div className="max-w-4xl">
          <Breadcrumbs
            items={[
              { label: "Главная", href: "/" },
              { label: "Каталог", href: "/catalog" },
              { label: title },
            ]}
          />

          <p className="mt-6 text-sm font-semibold text-primary">Категория</p>
          <h1 className="mt-3 text-3xl font-semibold leading-[1.08] text-foreground sm:text-4xl lg:text-5xl">
            {title}
          </h1>
          {description ? (
            <p className="mt-5 max-w-3xl text-base leading-7 text-muted sm:text-lg">
              {description}
            </p>
          ) : null}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:w-fit sm:flex-row sm:items-center">
          <div className="inline-flex rounded-full border border-border/80 bg-white/82 p-1 shadow-[0_16px_44px_rgba(7,55,99,0.07)] backdrop-blur">
            <Link
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all",
                viewMode === "products"
                  ? "bg-primary text-white shadow-[0_12px_26px_rgba(7,55,99,0.18)]"
                  : "text-muted hover:bg-card-soft hover:text-primary",
              )}
              to={productsModeHref}
            >
              Все товары
              <span className="text-xs opacity-80">{scopedProducts.length}</span>
            </Link>
            <Link
              className={cn(
                "inline-flex h-11 items-center gap-2 rounded-full px-5 text-sm font-semibold transition-all",
                viewMode === "brands"
                  ? "bg-primary text-white shadow-[0_12px_26px_rgba(7,55,99,0.18)]"
                  : "text-muted hover:bg-card-soft hover:text-primary",
              )}
              to={brandsModeHref}
            >
              Бренды
              <span className="text-xs opacity-80">{categoryBrands.length}</span>
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
          <CatalogCategoryNav
            activeCategorySlug={category.slug}
            activeSubcategorySlug={activeSubcategory?.slug}
            categories={categories}
            className="lg:sticky lg:top-28"
          />

          {viewMode === "brands" ? (
            <BrandSearch brands={categoryBrands} categorySlug={category.slug} />
          ) : (
            <ProductSearch
              emptyDescription={
                activeBrand
                  ? "В статическом каталоге пока нет товаров этого бренда. Попробуйте выбрать другой бренд или отправить заявку на подбор."
                  : "В этой категории нет товаров по выбранному запросу. Попробуйте изменить поиск или выбрать другую подкатегорию."
              }
              products={visibleProducts}
              searchPlaceholder={
                activeBrand
                  ? `Поиск среди товаров бренда «${activeBrand.name}»`
                  : `Поиск в категории «${title}»`
              }
            />
          )}
        </div>
      </Container>
    </Section>
  );
}
