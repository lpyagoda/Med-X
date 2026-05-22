import { normalizeCatalogQuery } from "@/lib/catalogSearch";
import type { Product } from "@/types/product";

type BrandSeed = {
  logoText: string;
  name: string;
  shortName?: string;
  slug: string;
};

export type CategoryBrand = BrandSeed & {
  id: string;
  productCount: number;
  subtitle: string;
};

const categoryBrandSeeds: Record<string, BrandSeed[]> = {
  "stomatologicheskie-ustanovki": [
    {
      logoText: "Diplomat",
      name: "Diplomat Dental",
      shortName: "Diplomat",
      slug: "diplomat-dental",
    },
    { logoText: "MED-IX", name: "MED-IX", slug: "med-ix" },
    {
      logoText: "Stern Weber",
      name: "Stern Weber",
      shortName: "Stern Weber",
      slug: "stern-weber",
    },
    {
      logoText: "Chirana",
      name: "Chirana Medical",
      shortName: "Chirana",
      slug: "chirana-medical",
    },
    { logoText: "Fedesa", name: "Fedesa", slug: "fedesa" },
    { logoText: "Mercury", name: "Mercury", slug: "mercury" },
    { logoText: "AJAX", name: "Ajax", slug: "ajax" },
    { logoText: "DCI Edge", name: "DCI Edge", slug: "dci-edge" },
  ],
  kompressory: [
    { logoText: "DÜRR", name: "DÜRR Dental", slug: "durr-dental" },
    { logoText: "AirClean", name: "AirClean", slug: "airclean" },
    { logoText: "Cattani", name: "Cattani", slug: "cattani" },
    { logoText: "EKOM", name: "EKOM", slug: "ekom" },
    { logoText: "METASYS", name: "METASYS", slug: "metasys" },
    { logoText: "W&H", name: "W&H", slug: "w-h" },
  ],
  "rentgen-oborudovanie": [
    { logoText: "Vatech", name: "Vatech", slug: "vatech" },
    { logoText: "MED-IX", name: "MED-IX", slug: "med-ix" },
    { logoText: "Planmeca", name: "Planmeca", slug: "planmeca" },
    {
      logoText: "Carestream",
      name: "Carestream Dental",
      shortName: "Carestream",
      slug: "carestream-dental",
    },
    { logoText: "NewTom", name: "NewTom", slug: "newtom" },
    { logoText: "Acteon", name: "Acteon", slug: "acteon" },
  ],
  "nakonechniki-i-motory": [
    { logoText: "NSK", name: "NSK", slug: "nsk" },
    { logoText: "Woodpecker", name: "Woodpecker", slug: "woodpecker" },
    { logoText: "W&H", name: "W&H", slug: "w-h" },
    { logoText: "Bien-Air", name: "Bien-Air", slug: "bien-air" },
    { logoText: "KaVo", name: "KaVo", slug: "kavo" },
    { logoText: "Dentsply", name: "Dentsply Sirona", slug: "dentsply-sirona" },
  ],
  "sterilizatsiya-i-dezinfektsiya": [
    { logoText: "MELAG", name: "MELAG", slug: "melag" },
    { logoText: "DÜRR", name: "DÜRR Dental", slug: "durr-dental" },
    { logoText: "Euronda", name: "Euronda", slug: "euronda" },
    { logoText: "Woson", name: "Woson", slug: "woson" },
    { logoText: "Tuttnauer", name: "Tuttnauer", slug: "tuttnauer" },
    { logoText: "Mocom", name: "Mocom", slug: "mocom" },
  ],
  mebel: [
    { logoText: "MediCab", name: "MediCab", slug: "medicab" },
    { logoText: "MED-IX", name: "MED-IX", slug: "med-ix" },
    { logoText: "Tecno-Gaz", name: "Tecno-Gaz", slug: "tecno-gaz" },
    { logoText: "Interdent", name: "Interdent", slug: "interdent" },
  ],
  "raskhodnye-materialy": [
    { logoText: "MedComfort", name: "MedComfort", slug: "medcomfort" },
    { logoText: "DÜRR", name: "DÜRR Dental", slug: "durr-dental" },
    { logoText: "Roeko", name: "Roeko", slug: "roeko" },
    { logoText: "Euronda", name: "Euronda", slug: "euronda" },
  ],
  "zapchasti-dlya-oborudovaniya": [
    { logoText: "MED-IX Parts", name: "MED-IX Parts", slug: "med-ix-parts" },
    { logoText: "AirClean", name: "AirClean", slug: "airclean" },
    { logoText: "NSK", name: "NSK", slug: "nsk" },
    { logoText: "DÜRR", name: "DÜRR Dental", slug: "durr-dental" },
    { logoText: "KaVo", name: "KaVo", slug: "kavo" },
    { logoText: "W&H", name: "W&H", slug: "w-h" },
  ],
  "zubotekhnicheskoe-oborudovanie": [
    { logoText: "Renfert", name: "Renfert", slug: "renfert" },
    { logoText: "LabCeram", name: "LabCeram", slug: "labceram" },
    { logoText: "Ivoclar", name: "Ivoclar", slug: "ivoclar" },
    { logoText: "VITA", name: "VITA", slug: "vita" },
    { logoText: "Zhermack", name: "Zhermack", slug: "zhermack" },
    { logoText: "Amann", name: "Amann Girrbach", slug: "amann-girrbach" },
  ],
};

export function getBrandSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replaceAll("ü", "u")
    .replaceAll("ö", "o")
    .replaceAll("ä", "a")
    .replaceAll("ß", "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function countProductsByBrand(products: Product[], brandSlug: string) {
  return products.filter((product) => getBrandSlug(product.brand) === brandSlug).length;
}

function toCategoryBrand(
  seed: BrandSeed,
  categorySlug: string,
  categoryTitle: string,
  products: Product[],
): CategoryBrand {
  return {
    ...seed,
    id: `${categorySlug}-${seed.slug}`,
    productCount: countProductsByBrand(products, seed.slug),
    subtitle: `${categoryTitle} ${seed.shortName ?? seed.name}`,
  };
}

export function getCategoryBrands(
  categorySlug: string,
  categoryTitle: string,
  products: Product[],
) {
  const seeds = categoryBrandSeeds[categorySlug] ?? [];
  const brands = new Map<string, CategoryBrand>();

  seeds.forEach((seed) => {
    brands.set(seed.slug, toCategoryBrand(seed, categorySlug, categoryTitle, products));
  });

  products.forEach((product) => {
    const slug = getBrandSlug(product.brand);
    if (!slug || brands.has(slug)) return;

    brands.set(
      slug,
      toCategoryBrand(
        {
          logoText: product.brand,
          name: product.brand,
          slug,
        },
        categorySlug,
        categoryTitle,
        products,
      ),
    );
  });

  return Array.from(brands.values());
}

export function matchesBrandQuery(brand: CategoryBrand, query: string) {
  const searchValue = normalizeCatalogQuery(query);

  if (!searchValue) {
    return true;
  }

  return [brand.name, brand.logoText, brand.subtitle].some((field) =>
    normalizeCatalogQuery(field).includes(searchValue),
  );
}
