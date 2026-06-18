import { SITE_URL } from "@/lib/seo";

/**
 * robots.txt served by the SSR server. Opens the public site to crawlers,
 * hides the admin panel and per-user pages, and points both engines at the
 * sitemap. Clean-param tells Yandex to ignore tracking params (dedup).
 */
export function loader() {
  const body = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /cart
Disallow: /checkout

Clean-param: utm_source&utm_medium&utm_campaign&utm_term&utm_content&yclid&gclid

Sitemap: ${SITE_URL}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
