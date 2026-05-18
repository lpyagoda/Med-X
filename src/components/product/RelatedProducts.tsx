import { ProductGrid } from "@/components/catalog/ProductGrid";
import type { Product } from "@/types/product";

type RelatedProductsProps = {
  products: Product[];
};

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-primary">Каталог</p>
          <h2 className="mt-2 text-3xl font-semibold leading-tight text-foreground">
            Похожие товары
          </h2>
        </div>
        <p className="max-w-xl text-sm leading-6 text-muted">
          Позиции из той же категории, которые могут подойти для сравнения или
          комплектации заказа.
        </p>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
