import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { PillBadge } from "@/components/ui/PillBadge";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "minimal";
};

function getProductDetailsHref(product: Product) {
  return `/product/${product.slug}`;
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const categoryLabel = product.categoryName;
  const brandLabel = product.brand;

  if (variant === "minimal") {
    return (
      <article
        className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/34 p-5 text-foreground shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:shadow-[0_36px_92px_rgba(7,55,99,0.16)]"
        id={product.slug}
      >
        <div className="pointer-events-none absolute left-5 right-5 top-5 z-20 flex flex-wrap gap-2">
          {categoryLabel ? (
            <PillBadge className="bg-[color-mix(in_srgb,var(--accent)_13%,white)] text-primary">
              {categoryLabel}
            </PillBadge>
          ) : null}
          {brandLabel ? (
            <PillBadge className="text-muted">{brandLabel}</PillBadge>
          ) : null}
        </div>

        <header className="relative z-10 pt-12">
          <h2 className="mt-5 max-w-80 text-xl font-medium leading-tight text-foreground">
            {product.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
        </header>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative h-64 w-80 transition-transform duration-300 group-hover:-translate-y-1">
            <Image
              alt={product.title}
              className="object-contain"
              fill
              sizes="(max-width: 1280px) 44vw, 420px"
              src={product.image}
            />
          </div>
        </div>

        <footer className="relative z-10">
          <p className="text-xl font-semibold text-primary">{product.priceLabel}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button href={`/contacts?product=${product.slug}`} size="sm">
              Заказать
            </Button>
            <Button href={getProductDetailsHref(product)} size="sm" variant="outline">
              Подробнее
            </Button>
          </div>
        </footer>
      </article>
    );
  }

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-border/70 bg-white/82 shadow-[0_22px_60px_rgba(7,55,99,0.07)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-[0_34px_84px_rgba(7,55,99,0.13)]"
      id={product.slug}
    >
      <div className="relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] px-8">
        <div className="absolute left-4 right-4 top-4 z-10 flex flex-wrap gap-2">
          {categoryLabel ? (
            <PillBadge className="bg-[color-mix(in_srgb,var(--accent)_13%,white)] text-primary">
              {categoryLabel}
            </PillBadge>
          ) : null}
          {brandLabel ? (
            <PillBadge className="text-muted">{brandLabel}</PillBadge>
          ) : null}
        </div>

        <div className="relative h-56 w-full max-w-80 transition-transform duration-300 group-hover:-translate-y-1">
          <Image
            alt={product.title}
            className="object-contain"
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 50vw, 440px"
            src={product.image}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h2 className="text-xl font-semibold leading-snug text-foreground">
          {product.title}
        </h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
          {product.shortDescription}
        </p>

        <div className="mt-auto pt-6">
          <p className="text-2xl font-semibold leading-none text-primary">
            {product.priceLabel}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button href={`/contacts?product=${product.slug}`} size="sm">
              Заказать
            </Button>
            <Button href={getProductDetailsHref(product)} size="sm" variant="outline">
              Подробнее
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
