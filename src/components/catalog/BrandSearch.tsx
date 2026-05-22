import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Search } from "lucide-react";
import { matchesBrandQuery, type CategoryBrand } from "@/lib/catalogBrands";
import { cn } from "@/lib/utils";

type BrandSearchProps = {
  brands: CategoryBrand[];
  categorySlug: string;
};

function formatBrandCount(count: number) {
  const mod10 = count % 10;
  const mod100 = count % 100;

  if (mod10 === 1 && mod100 !== 11) return `${count} бренд`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${count} бренда`;
  }
  return `${count} брендов`;
}

function getBrandHref(categorySlug: string, brandSlug: string) {
  return `/catalog/${categorySlug}?brand=${brandSlug}`;
}

export function BrandSearch({ brands, categorySlug }: BrandSearchProps) {
  const [query, setQuery] = useState("");
  const filteredBrands = useMemo(
    () => brands.filter((brand) => matchesBrandQuery(brand, query)),
    [brands, query],
  );

  return (
    <div>
      <div className="rounded-[28px] border border-border/70 bg-white/82 p-5 shadow-[0_20px_58px_rgba(7,55,99,0.07)] backdrop-blur">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-primary">Бренды в категории</p>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Выберите бренд, чтобы перейти к товарам этой категории.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center xl:w-auto">
            <label className="relative block min-w-0 flex-1 xl:w-[22rem]">
              <span className="sr-only">Поиск по брендам или товарам</span>
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-primary/70"
              />
              <input
                className="h-12 w-full rounded-full border border-border bg-white px-11 text-sm text-foreground shadow-inner outline-none transition focus:border-primary/35 focus:ring-4 focus:ring-primary/10"
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Поиск по брендам или товарам"
                type="search"
                value={query}
              />
            </label>

            <div className="flex h-12 shrink-0 items-center justify-center rounded-full border border-border/70 bg-card-soft px-5 text-sm font-semibold text-foreground">
              {formatBrandCount(filteredBrands.length)}
            </div>
          </div>
        </div>
      </div>

      {filteredBrands.length > 0 ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredBrands.map((brand) => {
            const compactLogo = brand.logoText.length > 11;

            return (
              <Link
                className="group relative flex h-[300px] flex-col overflow-hidden rounded-[26px] border border-border/70 bg-white/86 p-5 shadow-[0_20px_56px_rgba(7,55,99,0.06)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:bg-white hover:shadow-[0_30px_78px_rgba(7,55,99,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                key={brand.id}
                to={getBrandHref(categorySlug, brand.slug)}
              >
                <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-card-soft text-primary opacity-80 transition-all duration-300 group-hover:border-primary/25 group-hover:bg-[color-mix(in_srgb,var(--accent)_12%,white)] group-hover:opacity-100">
                  <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
                </span>

                <div className="flex flex-1 items-center justify-center px-3 pt-6">
                  <div className="flex min-h-24 w-full items-center justify-center rounded-[22px] border border-white/80 bg-[linear-gradient(145deg,#ffffff,#eff8fc)] px-4 py-6 shadow-inner">
                    <span
                      className={cn(
                        "max-w-full text-center font-display font-semibold leading-tight text-primary",
                        compactLogo ? "text-xl" : "text-2xl",
                      )}
                    >
                      {brand.logoText}
                    </span>
                  </div>
                </div>

                <div className="pt-4">
                  <p className="truncate text-base font-semibold text-foreground">
                    {brand.name}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted">
                    {brand.subtitle}
                  </p>
                  {brand.productCount > 0 ? (
                    <p className="mt-3 text-xs font-semibold text-primary">
                      {brand.productCount} в каталоге
                    </p>
                  ) : (
                    <p className="mt-3 text-xs font-semibold text-muted">
                      Подбор по запросу
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="mt-6 rounded-[28px] border border-dashed border-border bg-white/72 p-10 text-center shadow-[0_18px_48px_rgba(7,55,99,0.04)]">
          <p className="text-xl font-semibold text-foreground">Бренды не найдены</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
            Попробуйте изменить запрос или вернуться к полному списку брендов.
          </p>
        </div>
      )}
    </div>
  );
}
