import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PrivacyConsent } from "@/components/legal/PrivacyConsent";
import { submitProductOrder } from "@/lib/api";
import {
  productOrderFormSchema,
  type ProductOrderFormValues,
} from "@/lib/validations";
import type { ProductOrderFormData } from "@/types/forms";

type ProductOrderFormProps = {
  productId: string;
  productTitle: string;
};

export function ProductOrderForm({ productId, productTitle }: ProductOrderFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
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
      productId,
      productTitle,
    },
    resolver: zodResolver(productOrderFormSchema),
  });

  const onSubmit = async (values: ProductOrderFormValues) => {
    const data: ProductOrderFormData = {
      name: values.name,
      phone: values.phone,
      productId: values.productId,
      productTitle: values.productTitle,
    };

    await submitProductOrder(data);
    setIsSuccess(true);
    reset({
      name: "",
      phone: "",
      productId,
      productTitle,
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-[22px] border border-accent/30 bg-[color-mix(in_srgb,var(--accent)_10%,white)] p-5">
        <p className="text-sm font-semibold text-foreground">
          Заявка на товар отправлена.
        </p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Менеджер свяжется с вами для уточнения наличия, оплаты и доставки.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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

      <Button className="w-full" disabled={isSubmitting || !agreed} type="submit">
        {isSubmitting ? "Отправляем..." : "Отправить заявку"}
      </Button>
    </form>
  );
}
