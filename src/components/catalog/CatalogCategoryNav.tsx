import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
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

type CategoryGroupProps = {
  category: Category;
  isActiveCategory: boolean;
  activeSubcategorySlug?: string;
  defaultExpanded: boolean;
};

function CategoryGroup({
  category,
  isActiveCategory,
  activeSubcategorySlug,
  defaultExpanded,
}: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasSubcategories = !!category.subcategories && category.subcategories.length > 0;

  return (
    <li className="border-b border-border/40 last:border-b-0">
      <button
        aria-expanded={hasSubcategories ? expanded : undefined}
        className={cn(
          "flex w-full items-center gap-2 px-2 py-2.5 text-left text-sm font-semibold transition-colors hover:text-primary",
          isActiveCategory ? "text-primary" : "text-foreground",
        )}
        onClick={() => {
          if (hasSubcategories) setExpanded((current) => !current);
        }}
        type="button"
      >
        <span className="min-w-0 flex-1 truncate">{category.title}</span>
        {hasSubcategories ? (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-4 w-4 shrink-0 text-muted transition-transform",
              expanded ? "rotate-180 text-primary" : "rotate-0",
            )}
          />
        ) : null}
      </button>

      {hasSubcategories && expanded ? (
        <div className="pb-2 pl-2 pr-1">
          <Link
            className="mb-1 flex items-center justify-between gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white! shadow-[0_8px_18px_rgba(7,55,99,0.18)] transition-colors hover:bg-primary-hover"
            to={`/catalog/${category.slug}`}
          >
            <span className="truncate">Все в «{category.title}»</span>
            <span aria-hidden="true">→</span>
          </Link>
          {category.subcategories!.map((subcategory) => {
            const isActiveSubcategory =
              isActiveCategory && subcategory.slug === activeSubcategorySlug;
            return (
              <Link
                className={cn(
                  "block rounded-lg px-2 py-1.5 text-sm leading-5 transition-colors hover:bg-card-soft hover:text-primary",
                  isActiveSubcategory
                    ? "bg-card-soft font-semibold text-primary"
                    : "text-muted",
                )}
                to={getSubcategoryHref(category.slug, subcategory.slug)}
                key={subcategory.id}
              >
                {subcategory.title}
              </Link>
            );
          })}
        </div>
      ) : null}
    </li>
  );
}

function CategoryLinks({
  activeCategorySlug,
  activeSubcategorySlug,
  categories,
}: Omit<CatalogCategoryNavProps, "className">) {
  return (
    <ul className="divide-y divide-border/40">
      {categories.map((category) => {
        const isActiveCategory = category.slug === activeCategorySlug;
        return (
          <CategoryGroup
            activeSubcategorySlug={activeSubcategorySlug}
            category={category}
            defaultExpanded={isActiveCategory}
            isActiveCategory={isActiveCategory}
            key={category.id}
          />
        );
      })}
    </ul>
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
        <div className="flex items-center justify-between gap-3 px-2 pb-3">
          <p className="text-sm font-semibold text-foreground">Категории</p>
          <Link className="text-sm font-semibold text-primary" to="/catalog">
            Все товары
          </Link>
        </div>
        <CategoryLinks
          activeCategorySlug={activeCategorySlug}
          activeSubcategorySlug={activeSubcategorySlug}
          categories={categories}
        />
      </div>

      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl bg-card-soft px-4 py-3 text-sm font-semibold text-foreground">
          Категории
          <span className="text-primary transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="mt-4 max-h-[60vh] overflow-auto pr-1">
          <div className="mb-3 px-2">
            <Link className="text-sm font-semibold text-primary" to="/catalog">
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
