import Image from "next/image";
import { ProductOrderPanel } from "@/components/product/ProductOrderPanel";
import type { Product } from "@/types/product";

type ProductHeroProps = {
  product: Product;
};

export function ProductHero({ product }: ProductHeroProps) {
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-stretch">
      <div className="h-full overflow-hidden rounded-[34px] border border-border/70 bg-white/82 shadow-[0_26px_80px_rgba(7,55,99,0.08)] backdrop-blur">
        <div className="grid h-full gap-8 p-6 sm:p-8 xl:grid-cols-[0.9fr_1.1fr] xl:items-center">
          <div className="flex min-h-[340px] items-center justify-center rounded-[28px] bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] p-8 sm:min-h-[460px]">
            <div className="relative h-72 w-full max-w-lg sm:h-96">
              <Image
                alt={product.title}
                className="object-contain"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                src={product.image}
              />
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-primary">
              {product.subcategoryName ?? product.categoryName}
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {product.brand}
            </p>
            <h1 className="mt-5 text-3xl font-semibold leading-[1.05] text-foreground sm:text-5xl">
              {product.title}
            </h1>
            <p className="mt-5 text-base leading-7 text-muted sm:text-lg">
              {product.shortDescription}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/70 bg-white/76 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Бренд
                </dt>
                <dd className="mt-2 font-semibold text-foreground">{product.brand}</dd>
              </div>
              <div className="rounded-2xl border border-border/70 bg-white/76 p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  Производитель
                </dt>
                <dd className="mt-2 font-semibold text-foreground">
                  {product.manufacturer}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <ProductOrderPanel product={product} />
    </div>
  );
}
