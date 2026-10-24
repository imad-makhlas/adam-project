import { z } from 'zod'

export const checkoutSchema = z.object({
  name: z.string().trim().min(2, 'Indiquez votre nom complet'),
  phone: z
    .string()
    .trim()
    .refine((value) => /^(?:(?:\+|00)212|0)[5-7]\d{8}$/.test(value.replace(/[\s.-]/g, '')), {
      message: 'Numéro marocain invalide',
    }),
  city: z.string().trim().min(2, 'Indiquez votre ville'),
  note: z.string().trim().max(180, 'Votre note est trop longue').optional(),
})

export type CheckoutValues = z.infer<typeof checkoutSchema>
