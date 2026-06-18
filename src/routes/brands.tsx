import { useLoaderData } from "react-router";
import type { MetaFunction } from "react-router";
import { BrandsPage } from "@/pages/BrandsPage";
import { fetchPublicBrands } from "@/lib/public/brands";
import { buildMeta, jsonLd, breadcrumbJsonLd } from "@/lib/seo";

export async function loader() {
  const brands = await fetchPublicBrands().catch(() => []);
  return { brands };
}

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/brands",
    title: "Бренды стоматологического оборудования",
    description:
      "Бренды оборудования и расходных материалов МЕД-ИКС: NSK, Dürr Dental и другие. Выберите производителя и смотрите товары в наличии с доставкой по России.",
    extra: [
      jsonLd(
        breadcrumbJsonLd([
          { name: "Главная", url: "/" },
          { name: "Бренды", url: "/brands" },
        ]),
      ),
    ],
  });

export default function BrandsRoute() {
  const { brands } = useLoaderData<typeof loader>();
  return <BrandsPage initialBrands={brands} />;
}
