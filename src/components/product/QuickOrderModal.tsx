import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { PrivacyConsent } from "@/components/legal/PrivacyConsent";
import { createOrder } from "@/lib/public/orders";
import {
  productOrderFormSchema,
  type ProductOrderFormValues,
} from "@/lib/validations";
import type { Product } from "@/types/product";

type QuickOrderModalProps = {
  onClose: () => void;
  open: boolean;
  product: Product;
  quantity: number;
};

export function QuickOrderModal({ onClose, open, product, quantity }: QuickOrderModalProps) {
  const [orderNumber, setOrderNumber] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [agreed, setAgreed] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ProductOrderFormValues>({
    defaultValues: {
      name: "",
      phone: "",
      productId: product.id,
      productTitle: product.title,
    },
    resolver: zodResolver(productOrderFormSchema),
  });

  function handleClose() {
    setOrderNumber(null);
    setSubmitError(null);
    setAgreed(false);
    reset({ name: "", phone: "", productId: product.id, productTitle: product.title });
    onClose();
  }

  async function onSubmit(values: ProductOrderFormValues) {
    setSubmitError(null);
    try {
      const created = await createOrder({
        customerName: values.name,
        customerPhone: values.phone,
        type: "quick",
        items: [
          {
            productId: product.id,
            slug: product.slug,
            title: product.title,
            image: product.image,
            priceLabel: product.priceLabel,
            unitPrice: product.price,
            quantity,
          },
        ],
      });
      setOrderNumber(created.number);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Не удалось отправить заявку";
      setSubmitError(message);
    }
  }

  return (
    <Modal onClose={handleClose} open={open} title="Купить в 1 клик">
      {orderNumber != null ? (
        <div>
          <h2 className="text-xl font-semibold text-foreground">Заявка отправлена</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Номер заявки № {orderNumber}. Менеджер свяжется с вами в ближайшее время для
            подтверждения деталей.
          </p>
          <Button className="mt-6 w-full" onClick={handleClose} type="button">
            Понятно
          </Button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold text-foreground">Купить в 1 клик</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            «{product.title}» — {quantity} шт. Оставьте телефон, менеджер сам перезвонит
            и уточнит детали оплаты и доставки.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit(onSubmit)}>
            <input type="hidden" {...register("productId")} />
            <input type="hidden" {...register("productTitle")} />

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

            <PrivacyConsent checked={agreed} onChange={setAgreed} />

            {submitError ? (
              <p className="text-sm text-destructive">{submitError}</p>
            ) : null}

            <Button
              className="w-full"
              disabled={isSubmitting || !agreed}
              type="submit"
            >
              {isSubmitting ? "Отправляем..." : "Отправить заявку"}
            </Button>
          </form>
        </div>
      )}
    </Modal>
  );
}
