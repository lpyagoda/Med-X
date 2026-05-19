import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductCharacteristics } from "@/components/product/ProductCharacteristics";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductHero } from "@/components/product/ProductHero";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProductBySlug, getProductsByCategory } from "@/lib/api";
import {
  fetchPublicProductBySlug,
  fetchPublicProductByTitle,
  fetchRelatedProducts,
} from "@/lib/public/products";
import type { Product } from "@/types/product";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const staticProduct = slug ? getProductBySlug(slug) : undefined;

  const [product, setProduct] = useState<Product | undefined>(staticProduct);
  const [related, setRelated] = useState<Product[]>(() =>
    staticProduct
      ? getProductsByCategory(staticProduct.categorySlug)
          .filter((item) => item.id !== staticProduct.id)
          .slice(0, 4)
      : [],
  );
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    let cancelled = false;
    setNotFound(false);

    (async () => {
      try {
        // 1) Try exact slug match in Supabase.
        let row = await fetchPublicProductBySlug(slug);
        // 2) Fallback to title match — covers the case when DB slugs differ
        //    from old static-data slugs (Phase 2 migration leftover).
        if (!row && staticProduct) {
          row = await fetchPublicProductByTitle(staticProduct.title);
        }
        if (cancelled) return;
        if (!row) {
          if (!staticProduct) setNotFound(true);
          return;
        }
        setProduct(row);
        const rows = await fetchRelatedProducts(row.categorySlug, row.id, 4);
        if (!cancelled && rows.length > 0) setRelated(rows);
      } catch {
        // Silent fallback to static data
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [slug, staticProduct]);

  if (notFound || (!product && !staticProduct)) {
    return <Navigate to="/404" replace />;
  }

  const view = product ?? staticProduct;
  if (!view) return null;

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: view.categoryName, href: `/catalog/${view.categorySlug}` },
            { label: view.title },
          ]}
        />

        <div className="mt-8">
          <ProductHero product={view} />
        </div>

        <div className="mt-10 grid gap-8">
          <ProductCharacteristics characteristics={view.characteristics} />
          <ProductDetails
            description={view.description}
            shortDescription={view.shortDescription}
          />
        </div>

        <div className="mt-14">
          <RelatedProducts products={related} />
        </div>
      </Container>
    </Section>
  );
}
