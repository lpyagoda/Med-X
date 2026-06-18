import type { MetaDescriptor } from "react-router";

/** Canonical production origin. Single source of truth for absolute URLs. */
export const SITE_URL = "https://med-ix.ru";
export const SITE_NAME = "МЕД-ИКС";
// Latin spelling kept as an alias so search catches both "мед-икс" and "med-ix".
export const SITE_NAME_LATIN = "MED-IX";
// Keyword-first title; brand appended by buildMeta as "… | МЕД-ИКС".
export const DEFAULT_TITLE = "Стоматологическое оборудование и расходные материалы | МЕД-ИКС";
export const DEFAULT_DESCRIPTION =
  "Поставка стоматологического оборудования, запчастей и расходных материалов для клиник и зуботехнических лабораторий. Официальные бренды, гарантия, доставка по России.";
const OG_IMAGE = `${SITE_URL}/images/hero/dental-hero-bg.png`;

/** Absolute URL for a site-relative path (always against the canonical origin). */
export function absoluteUrl(pathname: string): string {
  if (pathname.startsWith("http")) return pathname;
  return `${SITE_URL}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

type BuildMetaArgs = {
  title?: string;
  description?: string;
  /** Site-relative path of the current page, e.g. "/catalog". */
  pathname: string;
  image?: string;
  /** Set true on pages that must never be indexed (cart, checkout, admin). */
  noindex?: boolean;
  /** Extra descriptors (e.g. JSON-LD) appended as-is. */
  extra?: MetaDescriptor[];
};

/**
 * Builds a complete, consistent meta block for a route: title, description,
 * canonical, Open Graph + Twitter card, robots. Used by every public route's
 * `meta` export so the head is uniform across the site.
 */
export function buildMeta({
  title,
  description,
  pathname,
  image = OG_IMAGE,
  noindex = false,
  extra = [],
}: BuildMetaArgs): MetaDescriptor[] {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const desc = description ?? DEFAULT_DESCRIPTION;
  const canonical = absoluteUrl(pathname);

  return [
    { title: fullTitle },
    { name: "description", content: desc },
    {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow",
    },
    { tagName: "link", rel: "canonical", href: canonical },

    // Open Graph
    { property: "og:type", content: "website" },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: desc },
    { property: "og:url", content: canonical },
    { property: "og:image", content: image },
    { property: "og:locale", content: "ru_RU" },

    // Twitter
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: desc },
    { name: "twitter:image", content: image },

    ...extra,
  ];
}

/** Wraps a JSON-LD object as a meta descriptor React Router renders as a script tag. */
export function jsonLd(data: Record<string, unknown>): MetaDescriptor {
  return {
    "script:ld+json": data,
  } as MetaDescriptor;
}

/** Organisation schema — emitted on the home page. */
export function organizationJsonLd(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    alternateName: SITE_NAME_LATIN,
    url: SITE_URL,
    logo: `${SITE_URL}/SVG/logo.svg`,
    description: DEFAULT_DESCRIPTION,
  };
}

type Breadcrumb = { name: string; url: string };

/** BreadcrumbList schema from an ordered list of {name, url} (urls are made absolute). */
export function breadcrumbJsonLd(items: Breadcrumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}
