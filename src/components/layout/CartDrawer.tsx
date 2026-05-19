import { useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function CartDrawer() {
  const { items, count, totalKnown, isOpen, close, remove, setQuantity, clear } = useCart();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      aria-hidden={!isOpen}
      className={`fixed inset-0 z-[120] ${isOpen ? "pointer-events-auto" : "pointer-events-none"}`}
    >
      <button
        aria-label="Закрыть корзину"
        className={`absolute inset-0 bg-foreground/30 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
        tabIndex={isOpen ? 0 : -1}
        type="button"
      />

      <aside
        aria-label="Корзина"
        aria-modal="true"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-[-24px_0_60px_rgba(7,55,99,0.18)] transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        role="dialog"
      >
        <header className="flex items-center justify-between border-b border-border/70 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Корзина
            </p>
            <h2 className="mt-1 text-lg font-semibold text-foreground">
              {count > 0
                ? `${count} ${count === 1 ? "позиция" : "позиций"}`
                : "Пока пусто"}
            </h2>
          </div>
          <button
            aria-label="Закрыть"
            className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
            onClick={close}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-base font-semibold text-foreground">Корзина пуста</p>
              <p className="mt-2 text-sm leading-6 text-muted">
                Откройте каталог и добавьте нужное оборудование.
              </p>
              <Link
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-primary px-5 text-sm font-semibold text-white! shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
                onClick={close}
                to="/catalog"
              >
                В каталог
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border/70">
              {items.map((item) => (
                <li className="flex gap-3 py-4" key={item.productId}>
                  <Link
                    aria-label={item.title}
                    className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(145deg,#f8fcff,#eef7fb)]"
                    onClick={close}
                    to={item.slug ? `/product/${item.slug}` : "/catalog"}
                  >
                    {item.image ? (
                      <img
                        alt=""
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                        src={item.image}
                      />
                    ) : null}
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <Link
                      className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition hover:text-primary"
                      onClick={close}
                      to={item.slug ? `/product/${item.slug}` : "/catalog"}
                    >
                      {item.title}
                    </Link>
                    <p className="mt-1 text-xs font-semibold text-primary">
                      {item.priceLabel || "По запросу"}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-3 pt-2">
                      <div className="flex h-9 items-center gap-0.5 rounded-full border border-border bg-white px-2">
                        <button
                          aria-label="Уменьшить количество"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          type="button"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-semibold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          aria-label="Увеличить количество"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
                          onClick={() => setQuantity(item.productId, item.quantity + 1)}
                          type="button"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.unitPrice != null ? (
                          <span className="text-sm font-semibold text-foreground">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted">Цена уточняется</span>
                        )}
                        <button
                          aria-label="Убрать"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-destructive"
                          onClick={() => remove(item.productId)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 ? (
          <footer className="border-t border-border/70 bg-white px-5 py-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted">Позиций</span>
              <span className="font-semibold text-foreground">{count}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-base">
              <span className="font-semibold text-foreground">Итого</span>
              <span className="font-semibold text-foreground">
                {totalKnown > 0 ? formatPrice(totalKnown) : "По запросу"}
              </span>
            </div>
            <Link
              className="mt-4 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white! shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
              onClick={close}
              to="/checkout"
            >
              Оформить заказ
            </Link>
            <button
              className="mt-2 inline-flex h-10 w-full items-center justify-center gap-2 rounded-full text-sm font-semibold text-muted transition hover:text-destructive"
              onClick={clear}
              type="button"
            >
              <Trash2 className="h-4 w-4" />
              Очистить корзину
            </button>
          </footer>
        ) : null}
      </aside>
    </div>,
    document.body,
  );
}
