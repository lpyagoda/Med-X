"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { submitConsultationForm } from "@/lib/api";
import {
  consultationFormSchema,
  type ConsultationFormValues,
} from "@/lib/validations";
import type { ConsultationFormData } from "@/types/forms";

export function ConsultationForm({ submitLabel = "Оставить заявку" }: { submitLabel?: string }) {
  const [isSuccess, setIsSuccess] = useState(false);
  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    reset,
  } = useForm<ConsultationFormValues>({
    defaultValues: {
      comment: "",
      name: "",
      phone: "",
    },
    resolver: zodResolver(consultationFormSchema),
  });

  const onSubmit = async (values: ConsultationFormValues) => {
    const data: ConsultationFormData = {
      comment: values.comment || undefined,
      name: values.name,
      phone: values.phone,
    };

    await submitConsultationForm(data);
    setIsSuccess(true);
    reset({
      comment: "",
      name: "",
      phone: "",
    });
  };

  if (isSuccess) {
    return (
      <div className="rounded-[24px] border border-accent/30 bg-[color-mix(in_srgb,var(--accent)_10%,white)] p-6">
        <p className="text-base font-semibold text-foreground">Заявка отправлена.</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Менеджер свяжется с вами для уточнения деталей.
        </p>
      </div>
    );
  }

  return (
    <form className="grid gap-4" onSubmit={handleSubmit(onSubmit)}>
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
      <Textarea
        disabled={isSubmitting}
        error={errors.comment?.message}
        label="Комментарий"
        placeholder="Кратко опишите задачу"
        {...register("comment")}
      />

      <Button className="mt-2 w-full sm:w-fit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Отправляем..." : submitLabel}
      </Button>
    </form>
  );
}
