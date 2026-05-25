import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { categoryIcons } from "@/lib/categoryIcons";
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

// ─── CategoryGroup ────────────────────────────────────────────────────────────

type CategoryGroupProps = {
  category: Category;
  isActiveCategory: boolean;
  activeSubcategorySlug?: string;
  defaultExpanded: boolean;
};

function CategoryGroup({ category, isActiveCategory, activeSubcategorySlug, defaultExpanded }: CategoryGroupProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasSubcategories = !!category.subcategories?.length;
  const icon = categoryIcons[category.slug];
  const isHighlighted = isActiveCategory || expanded;

  return (
    <li>
      {/* ── Row ── */}
      <button
        type="button"
        aria-expanded={hasSubcategories ? expanded : undefined}
        onClick={() => { if (hasSubcategories) setExpanded((v) => !v); }}
        className={cn(
          "group flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left",
          "transition-all duration-150",
          // default
          "text-[#2d3d50]",
          // hover (only when not active)
          !isHighlighted && "hover:bg-[#f0f5fb] hover:text-primary",
          // active / expanded
          isHighlighted && "bg-[#ebf2fc] text-primary",
        )}
      >
        {/* Icon capsule */}
        <span className={cn(
          "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-lg",
          "transition-colors duration-150",
          isHighlighted
            ? "bg-primary/15 text-primary"
            : "bg-[#f0f3f7] text-[#7a8fa6] group-hover:bg-primary/10 group-hover:text-primary",
        )}>
          {icon}
        </span>

        {/* Title */}
        <span className="min-w-0 flex-1 truncate text-[15px] font-medium leading-[1.4]">
          {category.title}
        </span>

        {/* Chevron */}
        {hasSubcategories && (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "h-[15px] w-[15px] shrink-0 transition-transform duration-200",
              expanded ? "rotate-180 text-primary" : "text-[#aab8c6]",
            )}
          />
        )}
      </button>

      {/* ── Subcategories ── */}
      {hasSubcategories && expanded && (
        <ul className="mt-0.5 mb-1.5 ml-3 space-y-px">
          {/* All in category */}
          <li>
            <Link
              to={`/catalog/${category.slug}`}
              className={cn(
                "block rounded-lg px-2.5 py-2 text-[15px] font-medium leading-5",
                "transition-colors duration-100",
                "text-[#607083] hover:bg-[#f5f8fb] hover:text-primary",
              )}
            >
              Все в «{category.title}»
            </Link>
          </li>

          {/* Subcategory items */}
          {category.subcategories!.map((sub) => {
            const isSelected = isActiveCategory && sub.slug === activeSubcategorySlug;
            return (
              <li key={sub.id}>
                <Link
                  to={getSubcategoryHref(category.slug, sub.slug)}
                  className={cn(
                    "block rounded-lg px-2.5 py-2 text-[15px] leading-5",
                    "transition-colors duration-100",
                    isSelected
                      ? "bg-primary font-semibold text-white shadow-[0_2px_8px_rgba(7,55,99,0.18)]"
                      : "text-[#607083] hover:bg-[#f0f5fb] hover:text-primary",
                  )}
                >
                  {sub.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

// ─── CategoryLinks ─────────────────────────────────────────────────────────────

function CategoryLinks({ activeCategorySlug, activeSubcategorySlug, categories }: Omit<CatalogCategoryNavProps, "className">) {
  return (
    <ul className="space-y-px">
      {categories.map((category) => (
        <CategoryGroup
          key={category.id}
          category={category}
          isActiveCategory={category.slug === activeCategorySlug}
          activeSubcategorySlug={activeSubcategorySlug}
          defaultExpanded={category.slug === activeCategorySlug}
        />
      ))}
    </ul>
  );
}

// ─── CatalogCategoryNav ────────────────────────────────────────────────────────

export function CatalogCategoryNav({ activeCategorySlug, activeSubcategorySlug, categories, className }: CatalogCategoryNavProps) {
  return (
    <aside className={cn(
      "overflow-hidden rounded-[22px] border border-[#dce9f3] bg-white",
      "shadow-[0_4px_24px_rgba(7,55,99,0.07)]",
      className,
    )}>
      {/* ── Desktop ── */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-[#edf3f9] px-4 py-3.5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#2d3d50]">
            Категории
          </p>
          <Link
            to="/catalog"
            className="text-[12px] font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Все товары
          </Link>
        </div>

        {/* List */}
        <div className="p-2.5">
          <CategoryLinks
            activeCategorySlug={activeCategorySlug}
            activeSubcategorySlug={activeSubcategorySlug}
            categories={categories}
          />
        </div>
      </div>

    </aside>
  );
}
