import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type CatalogCategoryNavProps = {
  activeCategorySlug?: string;
  activeSubcategorySlug?: string;
  categories: Category[];
  className?: string;
};

function getSubcategoryHref(categorySlug: string, subcategorySlug: string) {
  return `/catalog/${categorySlug}?subcategory=${subcategorySlug}`;
}

function CategoryLinks({
  activeCategorySlug,
  activeSubcategorySlug,
  categories,
}: Omit<CatalogCategoryNavProps, "className">) {
  return (
    <div className="grid gap-3">
      {categories.map((category) => {
        const isActiveCategory = category.slug === activeCategorySlug;

        return (
          <div
            className={cn(
              "rounded-[22px] border bg-card-soft p-3 transition-colors",
              isActiveCategory
                ? "border-primary/25 bg-white shadow-[0_16px_34px_rgba(7,55,99,0.07)]"
                : "border-transparent",
            )}
            key={category.id}
          >
            <Link
              className={cn(
                "block rounded-2xl px-3 py-2 text-sm font-semibold transition-colors hover:bg-white hover:text-primary",
                isActiveCategory ? "text-primary" : "text-foreground",
              )}
              href={`/catalog/${category.slug}`}
            >
              {category.title}
            </Link>

            {category.subcategories && category.subcategories.length > 0 ? (
              <div className="mt-1 grid gap-1">
                {category.subcategories.map((subcategory) => {
                  const isActiveSubcategory =
                    isActiveCategory && subcategory.slug === activeSubcategorySlug;

                  return (
                    <Link
                      className={cn(
                        "rounded-xl px-3 py-2 text-sm leading-5 transition-colors hover:bg-white hover:text-primary",
                        isActiveSubcategory
                          ? "border border-[#ccc] bg-[#f5f5f5] font-semibold text-primary"
                          : "text-muted",
                      )}
                      href={getSubcategoryHref(category.slug, subcategory.slug)}
                      key={subcategory.id}
                    >
                      {subcategory.title}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

export function CatalogCategoryNav({
  activeCategorySlug,
  activeSubcategorySlug,
  categories,
  className,
}: CatalogCategoryNavProps) {
  return (
    <aside
      className={cn(
        "rounded-[28px] border border-border/80 bg-white/82 p-4 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur",
        className,
      )}
    >
      <div className="hidden lg:block">
        <div className="flex items-center justify-between gap-3 px-2">
          <p className="text-sm font-semibold text-foreground">Категории</p>
          <Link className="text-sm font-semibold text-primary" href="/catalog">
            Все товары
          </Link>
        </div>
        <div className="mt-4">
          <CategoryLinks
            activeCategorySlug={activeCategorySlug}
            activeSubcategorySlug={activeSubcategorySlug}
            categories={categories}
          />
        </div>
      </div>

      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl bg-card-soft px-4 py-3 text-sm font-semibold text-foreground">
          Категории
          <span className="text-primary transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1">
          <div className="mb-3 px-2">
            <Link className="text-sm font-semibold text-primary" href="/catalog">
              Все товары
            </Link>
          </div>
          <CategoryLinks
            activeCategorySlug={activeCategorySlug}
            activeSubcategorySlug={activeSubcategorySlug}
            categories={categories}
          />
        </div>
      </details>
    </aside>
  );
}
