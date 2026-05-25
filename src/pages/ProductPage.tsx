import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
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
        let row = await fetchPublicProductBySlug(slug);
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

  const characteristics = [
    ...(view.brand ? [{ name: "Бренд", value: view.brand }] : []),
    ...(view.manufacturer ? [{ name: "Производитель", value: view.manufacturer }] : []),
    ...(view.characteristics ?? []),
  ];

  return (
    <Section className="pt-24 sm:pt-28 lg:pt-32">
      <Container>
        <ProductHero product={view} />

        <div className="mt-10 grid gap-8">
          <ProductCharacteristics characteristics={characteristics} />
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
