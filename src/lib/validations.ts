import { z } from "zod";

export const consultationFormSchema = z.object({
  name: z.string().trim().min(2, "Введите имя минимум из 2 символов"),
  phone: z.string().trim().min(6, "Введите телефон минимум из 6 символов"),
  comment: z.string().trim().optional(),
});

export const productOrderFormSchema = z.object({
  name: z.string().trim().min(2, "Введите имя минимум из 2 символов"),
  phone: z.string().trim().min(6, "Введите телефон минимум из 6 символов"),
  productId: z.string().min(1),
  productTitle: z.string().min(1),
});

export type ConsultationFormValues = z.infer<typeof consultationFormSchema>;
export type ProductOrderFormValues = z.infer<typeof productOrderFormSchema>;
