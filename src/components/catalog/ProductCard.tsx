import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { PillBadge } from "@/components/ui/PillBadge";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  variant?: "default" | "minimal";
};

function getProductDetailsHref(product: Product) {
  return `/product/${product.slug}`;
}

/**
 * Invisible link that covers the whole card. Lets the user click anywhere
 * on the card to navigate to the product, while keeping inner buttons fully
 * clickable thanks to their own `relative z-10` stacking.
 */
function CardOverlay({ product }: { product: Product }) {
  return (
    <Link
      to={getProductDetailsHref(product)}
      aria-label={product.title}
      className="absolute inset-0 z-[1] rounded-[28px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <span className="sr-only">{product.title}</span>
    </Link>
  );
}

export function ProductCard({ product, variant = "default" }: ProductCardProps) {
  const categoryLabel = product.categoryName;
  const brandLabel = product.brand;
  const { add, open } = useCart();

  function handleAddToCart() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        title: product.title,
        image: product.image,
        priceLabel: product.priceLabel,
        unitPrice: product.price,
      },
      1,
    );
    open();
  }

  if (variant === "minimal") {
    return (
      <article
        className="group relative flex min-h-[500px] flex-col overflow-hidden rounded-[28px] border border-white/60 bg-white/34 p-5 text-foreground shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:border-white hover:bg-white hover:shadow-[0_36px_92px_rgba(7,55,99,0.16)]"
        id={product.slug}
      >
        <CardOverlay product={product} />

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

        <header className="pointer-events-none relative z-10 pt-12">
          <h2 className="mt-5 max-w-80 text-xl font-medium leading-tight text-foreground">
            {product.title}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {product.shortDescription}
          </p>
        </header>

        <div className="pointer-events-none flex flex-1 items-center justify-center py-8">
          <div className="relative h-64 w-80 transition-transform duration-300 group-hover:-translate-y-1">
            <img
              alt={product.title}
              className="absolute inset-0 h-full w-full object-contain"
              src={product.image}
              loading="lazy"
            />
          </div>
        </div>

        <footer className="relative z-10">
          <p className="pointer-events-none text-xl font-semibold text-primary">
            {product.priceLabel}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button onClick={handleAddToCart} size="sm">
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
      className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-border/70 bg-white/82 shadow-[0_22px_60px_rgba(7,55,99,0.07)] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:bg-white hover:shadow-[0_34px_84px_rgba(7,55,99,0.13)]"
      id={product.slug}
    >
      <CardOverlay product={product} />

      <div className="pointer-events-none relative flex aspect-[4/3] items-center justify-center bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] px-8">
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
          <img
            alt={product.title}
            className="absolute inset-0 h-full w-full object-contain"
            src={product.image}
            loading="lazy"
          />
        </div>
      </div>

      <div className="pointer-events-none flex flex-1 flex-col p-6">
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
          <div className="pointer-events-auto relative z-10 mt-5 flex flex-col gap-2 sm:flex-row">
            <Button onClick={handleAddToCart} size="sm">
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
