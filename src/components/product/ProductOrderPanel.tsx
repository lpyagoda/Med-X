import { Link } from "react-router-dom";
import { useState } from "react";
import { QuickOrderModal } from "@/components/product/QuickOrderModal";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/types/product";

type ProductOrderPanelProps = {
  product: Product;
};

export function ProductOrderPanel({ product }: ProductOrderPanelProps) {
  const [quantity, setQuantity] = useState(1);
  const [quickOpen, setQuickOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { add, open: openCart } = useCart();

  const availability = product.availability ?? "on-order";
  const availabilityLabel =
    product.availabilityLabel ?? (availability === "in-stock" ? "В наличии" : "Под заказ");
  const isInStock = availability === "in-stock";

  const decreaseQuantity = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const increaseQuantity = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

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
      quantity,
    );
    setAddedToCart(true);
    window.setTimeout(() => setAddedToCart(false), 1800);
    openCart();
  }

  return (
    <div className="flex h-full flex-col gap-6 lg:sticky lg:top-28">
      <aside className="rounded-[30px] border border-border/70 bg-white/86 p-6 shadow-[0_24px_70px_rgba(7,55,99,0.1)] backdrop-blur">
        <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-border/70 bg-white/80 px-3.5 py-1.5 text-sm font-semibold">
          <span
            className={`h-2 w-2 shrink-0 rounded-full ${isInStock ? "bg-emerald-500" : "bg-amber-500"}`}
          />
          <span className={isInStock ? "text-emerald-600" : "text-amber-600"}>
            {availabilityLabel}
          </span>
        </div>

        <p className="text-3xl font-semibold leading-none text-foreground sm:text-4xl">
          {product.priceLabel}
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-[minmax(0,1fr)_1.08fr] lg:grid-cols-1 xl:grid-cols-[minmax(0,1fr)_1.08fr]">
          <div className="flex h-12 items-center justify-between rounded-full border border-border bg-white/72 px-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
            <button
              aria-label="Уменьшить количество"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
              onClick={decreaseQuantity}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M6 12h12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
            <span className="min-w-8 text-center text-sm font-semibold text-primary">
              {quantity}
            </span>
            <button
              aria-label="Увеличить количество"
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
              onClick={increaseQuantity}
              type="button"
            >
              <svg
                aria-hidden="true"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M12 6v12M6 12h12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>
          </div>

          <button
            className="h-12 rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-[0_22px_44px_rgba(7,55,99,0.22)]"
            onClick={handleAddToCart}
            type="button"
          >
            {addedToCart ? "Добавлено в корзину" : "В корзину"}
          </button>
        </div>

        <button
          className="mt-3 h-12 w-full rounded-full border border-primary/35 bg-white/70 px-6 text-sm font-semibold text-primary transition hover:-translate-y-0.5 hover:border-primary/55 hover:bg-white"
          onClick={() => setQuickOpen(true)}
          type="button"
        >
          Купить в 1 клик
        </button>

        <Link
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-full text-sm font-semibold text-primary transition hover:bg-card-soft"
          to="/cart"
        >
          Перейти в корзину →
        </Link>

        <p className="mt-5 text-sm leading-6 text-muted">
          Итоговую стоимость, наличие, сроки поставки и доставку подтвердит
          менеджер.
        </p>
      </aside>

      <section className="rounded-[30px] border border-border/70 bg-white/86 p-6 text-center shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur">
        <img
          src="/SVG/envelope.svg"
          alt=""
          aria-hidden="true"
          className="mx-auto h-12 w-12"
        />
        <h2 className="mt-4 text-xl font-semibold text-foreground">
          Нужна консультация?
        </h2>
        <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-muted">
          Наши специалисты ответят на вопросы по товару, комплектации и срокам.
        </p>
        <div className="my-5 h-px bg-border" />
        <Link
          className="inline-flex min-h-10 items-center justify-center rounded-full px-5 text-sm font-semibold text-foreground transition hover:bg-card-soft hover:text-primary"
          to="/contacts"
        >
          Связаться с менеджером
        </Link>
      </section>

      <QuickOrderModal
        onClose={() => setQuickOpen(false)}
        open={quickOpen}
        product={product}
        quantity={quantity}
      />
    </div>
  );
}
