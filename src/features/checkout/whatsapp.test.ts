import { describe, expect, it } from 'vitest'
import { buildDirectWhatsAppUrl, buildOrderMessage, buildOrderWhatsAppUrl, normalizeMoroccanPhone } from './whatsapp'

describe('WhatsApp checkout', () => {
  it('normalizes common Moroccan phone formats', () => {
    expect(normalizeMoroccanPhone('06 12 34 56 78')).toBe('212612345678')
    expect(normalizeMoroccanPhone('+212 6 12 34 56 78')).toBe('212612345678')
  })

  it('creates an encoded multi-product order with customer details and total', () => {
    const order = {
      merchantPhone: '212600000000',
      customer: { name: 'Sara Amrani', phone: '0612345678', city: 'Rabat', note: 'Après 18h' },
      lines: [
        { name: 'Âme Blanche', size: '50 ml', quantity: 2, price: 690 },
        { name: 'Bois Noir', size: '75 ml', quantity: 1, price: 740 },
      ],
    }
    const url = buildOrderWhatsAppUrl(order)

    expect(url).toContain('https://wa.me/212600000000?text=')
    const message = decodeURIComponent(url.split('?text=')[1])
    expect(message).toContain('Sara Amrani')
    expect(message).toContain('Bonjour Parfumerie Bourgois')
    expect(message).toContain('Rabat')
    expect(message).toContain('2 × Âme Blanche')
    expect(message).toContain('Total : 2 120 MAD')
    expect(message).toContain('Après 18h')
    expect(buildOrderMessage(order)).toBe(message)
  })

  it('creates a short direct enquiry for one perfume', () => {
    const url = buildDirectWhatsAppUrl('212600000000', 'Âme Blanche', '50 ml')
    expect(decodeURIComponent(url)).toContain('Bonjour Parfumerie Bourgois')
    expect(decodeURIComponent(url)).toContain('Je souhaite commander Âme Blanche — 50 ml')
  })
})
