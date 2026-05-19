import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { useCart } from "@/contexts/CartContext";

function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function CartPage() {
  const { items, count, totalKnown, remove, setQuantity, clear } = useCart();

  if (items.length === 0) {
    return (
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl rounded-[28px] border border-border/70 bg-white/86 p-10 text-center shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Корзина пуста
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">
              Перейдите в каталог, выберите оборудование и нажмите «В корзину».
            </p>
            <Link
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
              to="/catalog"
            >
              В каталог
            </Link>
          </div>
        </Container>
      </Section>
    );
  }

  return (
    <Section>
      <Container>
        <div className="flex flex-col gap-2">
          <p className="text-sm font-semibold text-primary">Корзина</p>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Ваши товары · {count} {count === 1 ? "позиция" : "позиций"}
          </h1>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          <div className="overflow-hidden rounded-[28px] border border-border/70 bg-white/86 shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur">
            <ul className="divide-y divide-border/70">
              {items.map((item) => (
                <li className="flex gap-4 p-5 sm:p-6" key={item.productId}>
                  <Link
                    aria-label={item.title}
                    className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#f8fcff,#eef7fb)] sm:h-28 sm:w-28"
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
                    <div className="flex items-start justify-between gap-3">
                      <Link
                        className="text-base font-semibold leading-snug text-foreground transition hover:text-primary"
                        to={item.slug ? `/product/${item.slug}` : "/catalog"}
                      >
                        {item.title}
                      </Link>
                      <button
                        aria-label="Убрать из корзины"
                        className="-mr-1 -mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-destructive"
                        onClick={() => remove(item.productId)}
                        type="button"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-primary">
                      {item.priceLabel || "Цена по запросу"}
                    </p>
                    <div className="mt-auto flex items-center justify-between gap-4 pt-3">
                      <div className="flex h-10 items-center gap-1 rounded-full border border-border bg-white/72 px-2">
                        <button
                          aria-label="Уменьшить количество"
                          className="flex h-7 w-7 items-center justify-center rounded-full text-muted transition hover:bg-card-soft hover:text-foreground"
                          onClick={() => setQuantity(item.productId, item.quantity - 1)}
                          type="button"
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm font-semibold text-primary">
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
                      {item.unitPrice != null ? (
                        <p className="text-sm font-semibold text-foreground">
                          {formatPrice(item.unitPrice * item.quantity)}
                        </p>
                      ) : (
                        <p className="text-sm text-muted">Цена уточняется</p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between border-t border-border/70 px-5 py-4 sm:px-6">
              <button
                className="inline-flex items-center gap-2 text-sm font-semibold text-muted transition hover:text-destructive"
                onClick={clear}
                type="button"
              >
                <Trash2 className="h-4 w-4" />
                Очистить корзину
              </button>
              <Link className="text-sm font-semibold text-primary" to="/catalog">
                Продолжить покупки →
              </Link>
            </div>
          </div>

          <aside className="rounded-[28px] border border-border/70 bg-white/86 p-6 shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur lg:sticky lg:top-28">
            <h2 className="text-lg font-semibold text-foreground">Итого</h2>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-muted">Позиций</dt>
                <dd className="font-semibold text-foreground">{count}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-muted">Сумма</dt>
                <dd className="font-semibold text-foreground">
                  {totalKnown > 0 ? formatPrice(totalKnown) : "По запросу"}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs leading-5 text-muted">
              Итоговую стоимость, наличие, сроки поставки и оплату подтвердит менеджер
              после оформления заказа.
            </p>
            <Link
              className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
              to="/checkout"
            >
              Оформить заказ
            </Link>
          </aside>
        </div>
      </Container>
    </Section>
  );
}
