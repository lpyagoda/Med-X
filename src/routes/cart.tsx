import type { MetaFunction } from "react-router";
import { CartPage } from "@/pages/CartPage";
import { buildMeta } from "@/lib/seo";

// Cart is per-user and has no SEO value — keep it out of the index.
export const meta: MetaFunction = () =>
  buildMeta({ pathname: "/cart", title: "Корзина", noindex: true });

export default CartPage;
