import { ProductCard } from "@/components/catalog/ProductCard";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

type ProductGridProps = {
  className?: string;
  products: Product[];
  variant?: "default" | "minimal";
};

export function ProductGrid({ className, products, variant = "default" }: ProductGridProps) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} variant={variant} />
      ))}
    </div>
  );
}
