import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

export function CartButton() {
  const { count, open } = useCart();

  return (
    <button
      aria-label={count > 0 ? `Корзина, товаров: ${count}` : "Корзина"}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white! shadow-[0_12px_28px_rgba(7,55,99,0.22)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
      onClick={open}
      type="button"
    >
      <ShoppingCart className="h-4 w-4" />
      {count > 0 ? (
        <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full border border-white bg-accent px-1.5 text-[11px] font-semibold leading-none text-primary">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </button>
  );
}
