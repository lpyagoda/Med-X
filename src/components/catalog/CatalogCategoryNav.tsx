import { useState, type ReactNode } from "react";
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

// ─── Icons ────────────────────────────────────────────────────────────────────

const categoryIcons: Record<string, ReactNode> = {
  "stomatologicheskie-ustanovki": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 21h16M8 21V10a4 4 0 0 1 8 0v11M8 14h8M12 6V3" />
      <circle cx="12" cy="2.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  "kompressory": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="10" width="20" height="10" rx="2" />
      <path d="M6 10V7a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v3" />
      <circle cx="12" cy="15" r="2" />
      <path d="M6 15h2m8 0h2" />
    </svg>
  ),
  "rentgen-oborudovanie": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v4m0 12v4M2 12h4m12 0h4M5.64 5.64l2.83 2.83m7.07 7.07 2.83 2.83M18.36 5.64l-2.83 2.83M7.05 16.95l-2.83 2.83" />
    </svg>
  ),
  "nakonechniki-i-motory": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" viewBox="0 0 107 148" aria-hidden="true">
      <path d="M38.9141 127.16L36.8512 140.225C36.3339 143.501 33.2559 145.736 29.9801 145.214L7.55741 141.64C4.20105 141.104 1.95881 137.891 2.61484 134.556L5.25013 121.16L10.5643 94.1466C12.4539 84.5412 15.7457 75.2659 20.3342 66.6183C24.3705 59.0115 29.3738 51.9588 35.2197 45.6357L50.9141 28.6602M50.9141 28.6602L46.7561 26.1654C44.8965 25.0496 44.2647 22.6552 45.3318 20.7672L54.5077 4.53293C55.5703 2.65303 57.9331 1.95585 59.846 2.95783L84.1711 15.6996C86.2043 16.7646 86.9262 19.3183 85.7515 21.2901L82.8502 26.1602M50.9141 28.6602L67.4141 37.6602M82.8502 26.1602L80.9141 29.4102L75.8744 37.8696C74.7783 39.7095 72.4273 40.3596 70.5416 39.3442L67.4141 37.6602M67.4141 37.6602L51.189 70.1103C48.0245 76.4392 45.8524 83.2172 44.7488 90.2066L38.9141 127.16M104.414 42.6602L80.9141 29.4102M87.9141 29.4102L82.8502 26.1602M23.4141 98.6602C25.0807 91.1602 29.4141 74.8602 33.4141 69.6602M5.25013 121.16C15.5436 125.76 26.7873 127.834 38.0445 127.208L38.9141 127.16" />
    </svg>
  ),
  "sterilizatsiya-i-dezinfektsiya": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  ),
  "mebel": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2M12 12v3M9 13.5h6" />
    </svg>
  ),
  "raskhodnye-materialy": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 8V21H3V8" />
      <path d="M1 3h22v5H1z" />
      <path d="M10 12h4" />
    </svg>
  ),
  "zapchasti-dlya-oborudovaniya": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  ),
  "zubotekhnicheskoe-oborudovanie": (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M9 3c-1 2-1 4 0 5s1 3 0 5c0 2 .5 4 1.5 5.5S12 21 12 21s1-.5 1.5-2.5S15 15 15 13c-1-2-1-3 0-5s1-3 0-5" />
      <path d="M9 3h6" />
    </svg>
  ),
};

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

      {/* ── Mobile ── */}
      <details className="group lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3.5 text-[13px] font-semibold text-[#2d3d50]">
          Категории
          <span className="text-primary transition-transform group-open:rotate-45">+</span>
        </summary>
        <div className="border-t border-[#edf3f9] p-2.5 max-h-[60vh] overflow-auto">
          <div className="mb-2 px-2">
            <Link className="text-[12px] font-semibold text-primary" to="/catalog">
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
