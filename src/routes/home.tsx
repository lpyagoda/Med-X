import type { MetaFunction } from "react-router";
import { HomePage } from "@/pages/HomePage";
import { buildMeta, jsonLd, organizationJsonLd } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/",
    title: "Стоматологическое оборудование — поставка по России",
    description:
      "Поставка стоматологического оборудования, запчастей и расходных материалов для клиник и зуботехнических лабораторий. Официальные бренды, гарантия, доставка по России.",
    extra: [jsonLd(organizationJsonLd())],
  });

export default HomePage;
