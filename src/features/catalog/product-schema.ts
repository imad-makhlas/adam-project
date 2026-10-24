import { z } from 'zod'

const trimmedText = (label: string, max: number) =>
  z.string().trim().min(1, `${label} est requis.`).max(max, `${label} est trop long.`)

const imageSchema = z.string().trim().refine(
  (value) => value.startsWith('/') || /^https:\/\//i.test(value),
  'L’image doit utiliser HTTPS ou un chemin local.',
)

export const audienceSchema = z.enum(['femme', 'homme'])

export const productInputSchema = z.object({
  slug: z.string().trim().min(1, 'Le slug est requis.').max(100).regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets.',
  ),
  name: trimmedText('Le nom', 120),
  audience: audienceSchema,
  size: trimmedText('Le format', 40),
  price: z.number().int('Le prix doit être un nombre entier.').positive('Le prix doit être positif.'),
  description: trimmedText('La description', 400),
  notes: z.tuple([
    trimmedText('La première note', 80),
    trimmedText('La deuxième note', 80),
    trimmedText('La troisième note', 80),
  ]),
  image: imageSchema,
  cloudinaryPublicId: z.string().trim().min(1).max(255).nullable(),
  available: z.boolean(),
  sortOrder: z.number().int().min(0),
}).strict()

export const productSchema = productInputSchema.extend({
  id: z.string().trim().min(1).max(100),
}).strict()

export const productListSchema = z.array(productSchema)

export type Audience = z.infer<typeof audienceSchema>
export type ProductInput = z.infer<typeof productInputSchema>
export type Product = z.infer<typeof productSchema>
