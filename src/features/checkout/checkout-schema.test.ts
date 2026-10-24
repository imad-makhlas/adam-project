import { describe, expect, it } from 'vitest'
import { checkoutSchema } from './checkout-schema'

describe('checkout form validation', () => {
  it('accepts a valid Moroccan WhatsApp customer', () => {
    const result = checkoutSchema.safeParse({
      name: 'Sara Amrani',
      phone: '0612345678',
      city: 'Rabat',
      note: '',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an invalid phone number and missing city', () => {
    const result = checkoutSchema.safeParse({
      name: 'Sara',
      phone: '123',
      city: '',
      note: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.flatten().fieldErrors.phone?.[0]).toBe('Numéro marocain invalide')
      expect(result.error.flatten().fieldErrors.city?.[0]).toBe('Indiquez votre ville')
    }
  })
})
