import { useLoaderData } from "react-router";
import type { LoaderFunctionArgs, MetaFunction } from "react-router";
import { ProductPage } from "@/pages/ProductPage";
import { getProductBySlug } from "@/lib/api";
import {
  fetchPublicProductBySlug,
  fetchPublicProductByTitle,
  fetchRelatedProducts,
} from "@/lib/public/products";
import { buildMeta, jsonLd, breadcrumbJsonLd, absoluteUrl, SITE_NAME } from "@/lib/seo";
import type { Product } from "@/types/product";

type LoaderData = { product: Product; related: Product[] };

export async function loader({ params }: LoaderFunctionArgs): Promise<LoaderData> {
  const slug = params.slug ?? "";

  // Live DB first; fall back to the static seed (by slug, then by title) so old
  // links keep resolving after a re-seed. A genuinely missing product → real 404.
  let product = await fetchPublicProductBySlug(slug).catch(() => null);
  if (!product) {
    const staticProduct = getProductBySlug(slug);
    if (staticProduct) {
      product =
        (await fetchPublicProductByTitle(staticProduct.title).catch(() => null)) ??
        staticProduct;
    }
  }
  if (!product) {
    throw new Response(null, { status: 404, statusText: "Not Found" });
  }

  const related = await fetchRelatedProducts(product.categorySlug, product.id, 4).catch(
    () => [],
  );

  return { product, related };
}

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  if (!data) return buildMeta({ pathname: "/", noindex: true });
  const { product } = data;
  const path = `/product/${product.slug}`;

  // Commercial, keyword-first description: action + product + brand + availability
  // + delivery/warranty, then the short description if it still fits ~160 chars.
  const brand = product.brand ? ` (${product.brand})` : "";
  const availability =
    product.availabilityLabel ||
    (product.availability === "in-stock" ? "в наличии" : "под заказ");
  const base = `Купить «${product.title}»${brand} в МЕД-ИКС — ${availability}, доставка по России, гарантия.`;
  // Append the short description only if it adds something beyond the title.
  const tail =
    product.shortDescription &&
    product.shortDescription.trim().toLowerCase() !== product.title.trim().toLowerCase()
      ? ` ${product.shortDescription.trim()}`
      : "";
  const full = `${base}${tail}`;
  const description = full.length > 160 ? `${full.slice(0, 157).trimEnd()}…` : full;

  const productLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description,
    image: product.image ? absoluteUrl(product.image) : undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    sku: product.id,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(path),
      priceCurrency: "RUB",
      ...(product.price != null ? { price: product.price } : {}),
      availability:
        product.availability === "in-stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/PreOrder",
      seller: { "@type": "Organization", name: SITE_NAME },
    },
  };

  return buildMeta({
    pathname: path,
    title: `${product.title} — купить`,
    description,
    image: product.image ? absoluteUrl(product.image) : undefined,
    extra: [
      jsonLd(productLd),
      jsonLd(
        breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
          ...(product.categorySlug
            ? [{ name: product.categoryName, url: `/catalog/${product.categorySlug}` }]
            : []),
          { name: product.title, url: path },
        ]),
      ),
    ],
  });
};

export default function ProductRoute() {
  const { product, related } = useLoaderData<typeof loader>();
  return <ProductPage product={product} related={related} />;
}
