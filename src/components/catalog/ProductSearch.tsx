import { useMemo, useState } from "react";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { matchesProductQuery } from "@/lib/catalogSearch";
import type { Product } from "@/types/product";

type ProductSearchProps = {
  emptyDescription?: string;
  emptyTitle?: string;
  products: Product[];
  searchPlaceholder?: string;
};

export function ProductSearch({
  emptyDescription = "Попробуйте изменить запрос или выбрать другую категорию.",
  emptyTitle = "Товары не найдены",
  products,
  searchPlaceholder,
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const filteredProducts = useMemo(
    () => products.filter((product) => matchesProductQuery(product, query)),
    [products, query],
  );

  return (
    <div>
      <CatalogToolbar
        count={filteredProducts.length}
        onQueryChange={setQuery}
        placeholder={searchPlaceholder}
        query={query}
        total={products.length}
      />

      {filteredProducts.length > 0 ? (
        <ProductGrid className="mt-6" products={filteredProducts} />
      ) : (
        <div className="mt-6 rounded-[28px] border border-dashed border-border bg-white/72 p-10 text-center shadow-[0_18px_48px_rgba(7,55,99,0.04)]">
          <p className="text-xl font-semibold text-foreground">{emptyTitle}</p>
          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted">
            {emptyDescription}
          </p>
        </div>
      )}
    </div>
  );
}
