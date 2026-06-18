import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { CatalogPage } from "@/pages/CatalogPage";
import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";
import { fetchPublicProducts } from "@/lib/public/products";
import { fetchPublicBrands } from "@/lib/public/brands";
import { buildMeta, jsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function loader() {
  const [categories, products, brands] = await Promise.all([
    fetchPublicCategories().catch(() => getCategories()),
    fetchPublicProducts().catch(() => getProducts()),
    fetchPublicBrands().catch(() => []),
  ]);
  return { categories, products, brands };
}

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/catalog",
    title: "Каталог стоматологического оборудования — цены, наличие",
    description:
      "Каталог стоматологического оборудования, запчастей и расходников: установки, наконечники, компрессоры, рентген. Актуальные цены, наличие, доставка по России.",
    extra: [
      jsonLd(
        breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Каталог", url: "/catalog" },
        ]),
      ),
    ],
  });

export default function CatalogRoute() {
  const { categories, products, brands } = useLoaderData<typeof loader>();
  return (
    <CatalogPage
      initialCategories={categories}
      initialProducts={products}
      initialBrands={brands}
    />
  );
}
