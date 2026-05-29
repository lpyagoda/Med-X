import { cn } from "@/lib/utils";
import type { Brand } from "@/types/brand";

type CatalogBrandFilterProps = {
  activeBrandSlug: string;
  brands: Brand[];
  className?: string;
  onSelect: (slug: string) => void;
};

export function CatalogBrandFilter({
  activeBrandSlug,
  brands,
  className,
  onSelect,
}: CatalogBrandFilterProps) {
  return (
    <div className={cn("rounded-[24px] border border-border/80 bg-white/82 p-3 shadow-[0_18px_48px_rgba(7,55,99,0.06)] backdrop-blur", className)}>
      <div className="mb-2 px-1 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Бренд
      </div>
      <div className="flex flex-wrap gap-2">
        <Chip active={!activeBrandSlug} onClick={() => onSelect("")}>
          Все бренды
        </Chip>
        {brands.map((brand) => (
          <Chip
            key={brand.id}
            active={activeBrandSlug === brand.slug}
            onClick={() => onSelect(brand.slug)}
          >
            {brand.logo ? (
              <img
                src={brand.logo}
                alt=""
                className="h-4 w-auto max-w-[64px] object-contain"
                loading="lazy"
              />
            ) : null}
            <span>{brand.name}</span>
            <span className="text-xs opacity-70">{brand.productCount}</span>
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all",
        active
          ? "border-primary bg-primary text-white shadow-[0_12px_26px_rgba(7,55,99,0.18)]"
          : "border-border bg-white text-muted hover:border-primary/40 hover:text-primary",
      )}
    >
      {children}
    </button>
  );
}
