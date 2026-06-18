import type { MetaFunction } from "react-router";
import { OfferPage } from "@/pages/legal/OfferPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({
    pathname: "/offer",
    title: "Публичная оферта",
    description: "Публичная оферта на поставку товаров МЕД-ИКС.",
  });

export default OfferPage;
