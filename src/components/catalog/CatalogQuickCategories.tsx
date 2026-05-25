import { Link } from "react-router-dom";
import { categoryIcons } from "@/lib/categoryIcons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

type Props = {
  activeCategorySlug?: string;
  categories: Category[];
};

export function CatalogQuickCategories({ activeCategorySlug, categories }: Props) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 28px, black calc(100% - 28px), transparent)",
      }}
    >
      {categories.map((cat) => {
        const isActive = cat.slug === activeCategorySlug;
        const icon = categoryIcons[cat.slug];
        return (
          <Link
            key={cat.id}
            to={`/catalog/${cat.slug}`}
            className={cn(
              "flex shrink-0 items-center gap-2 rounded-2xl border px-3.5 py-2.5 text-sm font-medium transition-all",
              isActive
                ? "border-primary/30 bg-primary text-white shadow-[0_2px_12px_rgba(7,55,99,0.18)]"
                : "border-border/70 bg-white text-[#2d3d50] hover:border-primary/30 hover:bg-[#f0f5fb] hover:text-primary",
            )}
          >
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors",
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-[#f0f3f7] text-[#7a8fa6]",
              )}
            >
              {icon}
            </span>
            <span className="whitespace-nowrap leading-none">{cat.title}</span>
          </Link>
        );
      })}
    </div>
  );
}
