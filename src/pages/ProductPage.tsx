import { ProductCharacteristics } from "@/components/product/ProductCharacteristics";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductHero } from "@/components/product/ProductHero";
import { ProductOrderPanel } from "@/components/product/ProductOrderPanel";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import type { Product } from "@/types/product";

/**
 * Presentational product page. Data (product + related) is fetched server-side
 * in the route loader (routes/product.tsx) so the full product is in the SSR
 * HTML for search engines; this component only renders it.
 */
export function ProductPage({
  product,
  related,
}: {
  product: Product;
  related: Product[];
}) {
  const characteristics = [
    ...(product.brand ? [{ name: "Бренд", value: product.brand }] : []),
    ...(product.manufacturer ? [{ name: "Производитель", value: product.manufacturer }] : []),
    ...(product.characteristics ?? []),
  ];

  return (
    <Section className="pt-24 sm:pt-28 lg:pt-32">
      <Container>
        {/* Desktop: two-column grid spanning the full page */}
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
          {/* Left column: gallery + chars + description */}
          <div className="flex flex-col gap-8">
            <ProductHero product={product} />
            {/* Chars + description sit under the gallery on desktop */}
            <div className="hidden lg:flex lg:flex-col lg:gap-8">
              <ProductCharacteristics characteristics={characteristics} />
              <ProductDetails
                description={product.description}
                shortDescription={product.shortDescription}
              />
            </div>
          </div>

          {/* Right column: order panel */}
          <ProductOrderPanel product={product} />
        </div>

        {/* Mobile: chars + description below order panel */}
        <div className="mt-8 flex flex-col gap-8 lg:hidden">
          <ProductCharacteristics characteristics={characteristics} />
          <ProductDetails
            description={product.description}
            shortDescription={product.shortDescription}
          />
        </div>

        <div className="mt-14">
          <RelatedProducts products={related} />
        </div>
      </Container>
    </Section>
  );
}
