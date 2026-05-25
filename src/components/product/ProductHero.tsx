import { ProductGallery } from "@/components/product/ProductGallery";
import { ProductOrderPanel } from "@/components/product/ProductOrderPanel";
import type { Product } from "@/types/product";

type ProductHeroProps = {
  product: Product;
};

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
      {/* Gallery — full-bleed on mobile, card on desktop */}
      <div className="overflow-hidden w-screen [margin-left:calc(50%-50vw)] lg:w-auto lg:[margin-left:0] lg:rounded-[34px] lg:border lg:border-border/70 lg:bg-white/82 lg:shadow-[0_26px_80px_rgba(7,55,99,0.08)] lg:backdrop-blur">
        <ProductGallery
          alt={product.title}
          brandLabel={product.brand}
          categoryLabel={product.subcategoryName ?? product.categoryName}
          fallbackImage={product.image}
          images={product.images ?? []}
        />
      </div>

      <ProductOrderPanel product={product} />
    </div>
  );
}
