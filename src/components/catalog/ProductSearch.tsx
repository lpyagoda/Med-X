import { useEffect, useMemo, useState } from "react";
import { CatalogToolbar } from "@/components/catalog/CatalogToolbar";
import { Pagination } from "@/components/catalog/Pagination";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { scoreProductForQuery } from "@/lib/catalogSearch";
import type { Product } from "@/types/product";

type ProductSearchProps = {
  emptyDescription?: string;
  emptyTitle?: string;
  onFilterClick?: () => void;
  products: Product[];
  searchPlaceholder?: string;
};

const PAGE_SIZE = 20;

export function ProductSearch({
  emptyDescription = "Попробуйте изменить запрос или выбрать другую категорию.",
  emptyTitle = "Товары не найдены",
  onFilterClick,
  products,
  searchPlaceholder,
}: ProductSearchProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  // Sort by relevance when there's a query; otherwise keep input order.
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return products;
    return products
      .map((product) => ({ product, score: scoreProductForQuery(product, trimmed) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((entry) => entry.product);
  }, [products, query]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));

  // Reset to the first page whenever the result set shape changes (new query
  // or the parent passed a different product list).
  useEffect(() => {
    setPage(1);
  }, [query, products]);

  // If pagination state outlives the data (e.g. items were removed), clamp it.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageStart = (page - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <div>
      <CatalogToolbar
        count={filteredProducts.length}
        onFilterClick={onFilterClick}
        onQueryChange={setQuery}
        placeholder={searchPlaceholder}
        query={query}
        total={products.length}
      />

      {filteredProducts.length > 0 ? (
        <>
          <ProductGrid className="mt-6" products={visibleProducts} />
          {totalPages > 1 ? (
            <Pagination
              className="mt-8"
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(next) => {
                setPage(next);
                if (typeof window !== "undefined") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            />
          ) : null}
        </>
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
