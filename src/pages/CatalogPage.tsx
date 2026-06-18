import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CatalogCategoryNav } from "@/components/catalog/CatalogCategoryNav";
import { CatalogQuickCategories } from "@/components/catalog/CatalogQuickCategories";
import { CatalogBrandFilter } from "@/components/catalog/CatalogBrandFilter";
import { MobileFilterDrawer } from "@/components/catalog/MobileFilterDrawer";
import { PriceNotice } from "@/components/catalog/PriceNotice";
import { ProductSearch } from "@/components/catalog/ProductSearch";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { getCategories, getProducts } from "@/lib/api";
import { getBrandSlug } from "@/lib/catalogBrands";
import { fetchPublicCategories } from "@/lib/public/catalogue";
import { fetchPublicProducts } from "@/lib/public/products";
import { fetchPublicBrands } from "@/lib/public/brands";
import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

export function CatalogPage({
  initialCategories,
  initialProducts,
  initialBrands,
}: {
  initialCategories?: Category[];
  initialProducts?: Product[];
  initialBrands?: Brand[];
} = {}) {
  const { category: activeCategorySlug } = useParams<{ category?: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  // Initial state comes from the SSR loader so hydration matches the server HTML;
  // the effect below then refreshes from the live DB for admin↔site sync.
  const [categories, setCategories] = useState(
    () => initialCategories ?? getCategories(),
  );
  const [products, setProducts] = useState(() => initialProducts ?? getProducts());
  const [brands, setBrands] = useState<Brand[]>(() => initialBrands ?? []);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const activeBrandSlug = searchParams.get("brand") ?? "";

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
    fetchPublicProducts()
      .then((rows) => {
        if (cancelled) return;
        // A resolved fetch is authoritative — use it even when empty (e.g. the
        // admin hid every product), otherwise the static seed leaks back in.
        setProducts(rows);
      })
      .catch(() => {
        // Network/RLS error only — keep the static products as a fallback.
      });
    fetchPublicBrands()
      .then((rows) => {
        if (cancelled) return;
        setBrands(rows);
      })
      .catch(() => {
        // No brands table / network — hide the brand filter silently.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const activeBrand = brands.find((brand) => brand.slug === activeBrandSlug);

  // Filter by brand. Brands carry a DB slug; products only carry brand text, so
  // we match either on that slug (derived from the product's brand name) or on
  // the brand name directly — robust for seeded and admin-created brands alike.
  const visibleProducts = useMemo(() => {
    if (!activeBrand) return products;
    const targetName = activeBrand.name.trim().toLowerCase();
    return products.filter(
      (product) =>
        getBrandSlug(product.brand) === activeBrand.slug ||
        product.brand.trim().toLowerCase() === targetName,
    );
  }, [products, activeBrand]);

  function selectBrand(slug: string) {
    setSearchParams(
      (params) => {
        if (slug) params.set("brand", slug);
        else params.delete("brand");
        return params;
      },
      { replace: true },
    );
  }

  return (
    <>
      <MobileFilterDrawer
        categories={categories}
        open={mobileFilterOpen}
        onClose={() => setMobileFilterOpen(false)}
      />

      <Section className="pt-28 sm:pt-32 lg:pt-36">
        <Container>
          <div className="lg:flex lg:items-end lg:justify-between lg:gap-6">
            <SectionTitle
              title="Каталог оборудования"
              description="Стоматологическое оборудование, запасные части, расходные материалы и сопутствующие товары для клиник, кабинетов и лабораторий."
            />
            <div className="mt-5 flex items-center gap-2 lg:mt-0 lg:shrink-0 lg:pb-1">
              <PriceNotice />
            </div>
          </div>

          <div className="mt-6 lg:hidden">
            <CatalogQuickCategories categories={categories} activeCategorySlug={activeCategorySlug} />
          </div>

          {brands.length > 0 ? (
            <CatalogBrandFilter
              className="mt-6"
              brands={brands}
              activeBrandSlug={activeBrandSlug}
              onSelect={selectBrand}
            />
          ) : null}

          <div className="mt-6 grid gap-8 lg:grid-cols-[340px_1fr] lg:items-start">
            <CatalogCategoryNav categories={categories} />

            <ProductSearch
              products={visibleProducts}
              searchPlaceholder="Поиск по названию, бренду, производителю или категории"
              onFilterClick={() => setMobileFilterOpen((v) => !v)}
              emptyDescription={
                activeBrand
                  ? `В каталоге пока нет товаров бренда «${activeBrand.name}» по этому запросу. Снимите фильтр по бренду или отправьте заявку на подбор.`
                  : undefined
              }
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
