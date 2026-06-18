import type { MetaFunction } from "react-router";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { buildMeta } from "@/lib/seo";

// Real 404 status (not a soft-200) — important so search engines drop dead URLs.
export function loader() {
  throw new Response(null, { status: 404, statusText: "Not Found" });
}

export const meta: MetaFunction = () =>
  buildMeta({ pathname: "/404", title: "Страница не найдена", noindex: true });

// Rendered by the route ErrorBoundary after the loader throws 404.
export function ErrorBoundary() {
  return <NotFoundPage />;
}

export default function NotFoundRoute() {
  return <NotFoundPage />;
}
