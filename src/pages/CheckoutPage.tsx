import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Input } from "@/components/ui/Input";
import { Section } from "@/components/ui/Section";
import { PrivacyConsent } from "@/components/legal/PrivacyConsent";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/public/orders";
import {
  productOrderFormSchema,
  type ProductOrderFormValues,
} from "@/lib/validations";

function formatPrice(value: number): string {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

export function CheckoutPage() {
  const { items, count, totalKnown, clear } = useCart();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [agreed, setAgreed] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
  } = useForm<ProductOrderFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      productId: "cart",
      productTitle: "cart",
    },
    resolver: zodResolver(productOrderFormSchema),
  });

  if (items.length === 0 && orderNumber == null) {
    return <Navigate to="/cart" replace />;
  }

  async function onSubmit(values: ProductOrderFormValues) {
    setSubmitError(null);
    try {
      const created = await createOrder({
        customerName: values.name,
        customerPhone: values.phone,
        type: "cart",
        items,
      });
      setOrderNumber(created.number);
      clear();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось оформить заказ";
      setSubmitError(message);
    }
  }

  if (orderNumber != null) {
    return (
      <Section>
        <Container>
          <div className="mx-auto max-w-2xl rounded-[28px] border border-border/70 bg-white/86 p-10 text-center shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur">
            <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
              Заказ № {orderNumber} оформлен
            </h1>
            <p className="mt-4 text-base leading-7 text-muted">
              Спасибо! Менеджер свяжется с вами для подтверждения наличия, оплаты и
              доставки. Сохраните номер заказа на случай уточнений.
            </p>
            <Link
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-primary px-6 text-sm font-semibold text-white shadow-[0_18px_38px_rgba(7,55,99,0.18)] transition hover:-translate-y-0.5 hover:bg-primary-hover"
              to="/catalog"
            >
              Вернуться в каталог
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
          <Link className="text-sm font-semibold text-primary" to="/cart">
            ← В корзину
          </Link>
          <h1 className="text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Оформление заказа
          </h1>
          <p className="max-w-2xl text-base leading-7 text-muted">
            Оставьте имя и телефон — менеджер свяжется, уточнит наличие, стоимость
            доставки и удобный способ оплаты.
          </p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
          <section className="rounded-[28px] border border-border/70 bg-white/86 p-6 shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur sm:p-8">
            <h2 className="text-lg font-semibold text-foreground">Ваш заказ</h2>
            <ul className="mt-6 divide-y divide-border/70">
              {items.map((item) => (
                <li className="flex items-center gap-4 py-4 first:pt-0 last:pb-0" key={item.productId}>
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[linear-gradient(145deg,#f8fcff,#eef7fb)]">
                    {item.image ? (
                      <img
                        alt=""
                        className="h-full w-full object-contain p-2"
                        loading="lazy"
                        src={item.image}
                      />
                    ) : null}
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-base font-semibold leading-snug text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {item.quantity} шт. ·{" "}
                      {item.unitPrice != null
                        ? formatPrice(item.unitPrice)
                        : item.priceLabel || "Цена по запросу"}
                    </p>
                  </div>
                  <p className="shrink-0 text-base font-semibold text-foreground">
                    {item.unitPrice != null
                      ? formatPrice(item.unitPrice * item.quantity)
                      : item.priceLabel || "По запросу"}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 border-t border-border/70 pt-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Позиций</span>
                <span className="font-semibold text-foreground">{count}</span>
              </div>
              <div className="mt-2 flex items-center justify-between text-lg">
                <span className="font-semibold text-foreground">Итого</span>
                <span className="font-semibold text-foreground">
                  {totalKnown > 0 ? formatPrice(totalKnown) : "По запросу"}
                </span>
              </div>
            </div>
          </section>

          <form
            className="rounded-[28px] border border-border/70 bg-white/86 p-6 shadow-[0_24px_70px_rgba(7,55,99,0.08)] backdrop-blur lg:sticky lg:top-28"
            onSubmit={handleSubmit(onSubmit)}
          >
            <h2 className="text-base font-semibold text-foreground">Контактные данные</h2>
            <div className="mt-4 grid gap-3">
              <Input
                disabled={isSubmitting}
                error={errors.name?.message}
                label="Имя"
                placeholder="Ваше имя"
                {...register("name")}
              />
              <Input
                disabled={isSubmitting}
                error={errors.phone?.message}
                label="Телефон"
                placeholder="+7"
                type="tel"
                {...register("phone")}
              />
            </div>

            <PrivacyConsent className="mt-4" checked={agreed} onChange={setAgreed} />

            {submitError ? (
              <p className="mt-3 text-sm text-destructive">{submitError}</p>
            ) : null}

            <Button
              className="mt-5 w-full"
              disabled={isSubmitting || !agreed}
              size="sm"
              type="submit"
            >
              {isSubmitting ? "Отправляем..." : "Оформить заказ"}
            </Button>
          </form>
        </div>
      </Container>
    </Section>
  );
}
