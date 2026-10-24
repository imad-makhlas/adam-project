import { describe, expect, it } from 'vitest'
import { productInputSchema, productSchema } from './product-schema'

const validInput = {
  slug: 'ame-blanche',
  name: 'Âme Blanche',
  audience: 'femme' as const,
  size: '50 ml',
  price: 690,
  description: 'Une lumière douce, propre et enveloppante.',
  notes: ['Bergamote', 'Iris', 'Musc blanc'],
  image: '/assets/parfum-femme.png',
  cloudinaryPublicId: null,
  available: true,
  sortOrder: 0,
}

describe('productInputSchema', () => {
  it('normalizes a valid product and exactly three notes', () => {
    const result = productInputSchema.parse({
      ...validInput,
      name: '  Âme Blanche  ',
      notes: ['  Bergamote ', 'Iris', ' Musc blanc  '],
    })

    expect(result.name).toBe('Âme Blanche')
    expect(result.notes).toEqual(['Bergamote', 'Iris', 'Musc blanc'])
  })

  it.each([
    { field: 'price', value: 0 },
    { field: 'price', value: 690.5 },
    { field: 'audience', value: 'mixte' },
    { field: 'notes', value: ['Iris', 'Musc'] },
    { field: 'notes', value: ['Iris', 'Musc', 'Vanille', 'Rose'] },
    { field: 'image', value: 'javascript:alert(1)' },
  ])('rejects an invalid $field', ({ field, value }) => {
    expect(productInputSchema.safeParse({ ...validInput, [field]: value }).success).toBe(false)
  })

  it('rejects unknown fields', () => {
    expect(productInputSchema.safeParse({ ...validInput, apiSecret: 'never' }).success).toBe(false)
  })
})

describe('productSchema', () => {
  it('requires the stable product identifier', () => {
    expect(productSchema.safeParse(validInput).success).toBe(false)
    expect(productSchema.safeParse({ ...validInput, id: 'ame-blanche' }).success).toBe(true)
  })

  it('accepts a secure remote image URL', () => {
    expect(productSchema.safeParse({
      ...validInput,
      id: 'cloudinary-product',
      image: 'https://res.cloudinary.com/demo/image/upload/sample.jpg',
      cloudinaryPublicId: 'noirame/products/sample',
    }).success).toBe(true)
  })
})
