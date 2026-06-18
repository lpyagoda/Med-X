import type { MetaFunction } from "react-router";
import { CheckoutPage } from "@/pages/CheckoutPage";
import { buildMeta } from "@/lib/seo";

export const meta: MetaFunction = () =>
  buildMeta({ pathname: "/checkout", title: "Оформление заказа", noindex: true });

export default CheckoutPage;
