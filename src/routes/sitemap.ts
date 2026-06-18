import { getCategories, getProducts } from "@/lib/api";
import { fetchPublicCategories } from "@/lib/public/catalogue";
import { fetchPublicProducts } from "@/lib/public/products";
import { fetchPublicBrands } from "@/lib/public/brands";
import { absoluteUrl } from "@/lib/seo";

type Entry = { path: string; priority: string; changefreq: string };

/**
 * Dynamic sitemap built from the live catalogue on every request (cached 1h by
 * the CDN/nginx via Cache-Control). Static pages + every active category,
 * product and brand-filtered catalogue view.
 */
export async function loader() {
  const [categories, products, brands] = await Promise.all([
    fetchPublicCategories().catch(() => getCategories()),
    fetchPublicProducts().catch(() => getProducts()),
    fetchPublicBrands().catch(() => []),
  ]);

  const entries: Entry[] = [
    { path: "/", priority: "1.0", changefreq: "daily" },
    { path: "/catalog", priority: "0.9", changefreq: "daily" },
    { path: "/brands", priority: "0.7", changefreq: "weekly" },
    { path: "/about", priority: "0.6", changefreq: "monthly" },
    { path: "/contacts", priority: "0.6", changefreq: "monthly" },
    ...categories.map((c) => ({
      path: `/catalog/${c.slug}`,
      priority: "0.8",
      changefreq: "weekly",
    })),
    ...products.map((p) => ({
      path: `/product/${p.slug}`,
      priority: "0.7",
      changefreq: "weekly",
    })),
    ...brands.map((b) => ({
      path: `/catalog?brand=${encodeURIComponent(b.slug)}`,
      priority: "0.5",
      changefreq: "weekly",
    })),
  ];

  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${absoluteUrl(e.path).replace(/&/g, "&amp;")}</loc>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
