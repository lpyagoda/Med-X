import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/product/Breadcrumbs";
import { ProductCharacteristics } from "@/components/product/ProductCharacteristics";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductHero } from "@/components/product/ProductHero";
import { RelatedProducts } from "@/components/product/RelatedProducts";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { getProductBySlug, getProducts, getProductsByCategory } from "@/lib/api";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();

  return products.map((product) => ({
    slug: product.slug,
  }));
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = (await getProductsByCategory(product.categorySlug))
    .filter((item) => item.id !== product.id)
    .slice(0, 4);

  return (
    <Section>
      <Container>
        <Breadcrumbs
          items={[
            { label: "Главная", href: "/" },
            { label: "Каталог", href: "/catalog" },
            { label: product.categoryName, href: `/catalog/${product.categorySlug}` },
            { label: product.title },
          ]}
        />

        <div className="mt-8">
          <ProductHero product={product} />
        </div>

        <div className="mt-10 grid gap-8">
          <ProductCharacteristics characteristics={product.characteristics} />
          <ProductDetails
            description={product.description}
            shortDescription={product.shortDescription}
          />
        </div>

        <div className="mt-14">
          <RelatedProducts products={relatedProducts} />
        </div>
      </Container>
    </Section>
  );
}
