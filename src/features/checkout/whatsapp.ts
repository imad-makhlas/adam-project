export type WhatsAppLine = {
  name: string
  size: string
  quantity: number
  price: number
}

export type CustomerDetails = {
  name: string
  phone: string
  city: string
  note?: string
}

export type WhatsAppOrder = {
  merchantPhone: string
  customer: CustomerDetails
  lines: WhatsAppLine[]
}

const formatMad = new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 })

export function normalizeMoroccanPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  if (digits.startsWith('212')) return digits
  if (digits.startsWith('0')) return `212${digits.slice(1)}`
  return digits
}

export function buildOrderMessage({ customer, lines }: WhatsAppOrder): string {
  const total = lines.reduce((sum, line) => sum + line.price * line.quantity, 0)
  const lineText = lines
    .map(
      (line) =>
        `• ${line.quantity} × ${line.name} (${line.size}) — ${formatMad.format(line.price * line.quantity)} MAD`,
    )
    .join('\n')

  const note = customer.note?.trim() ? `\nNote : ${customer.note.trim()}` : ''
  return `Bonjour Parfumerie Bourgois,\n\nJe souhaite confirmer cette commande :\n${lineText}\n\nTotal : ${formatMad.format(total)} MAD\n\nNom : ${customer.name}\nTéléphone : ${normalizeMoroccanPhone(customer.phone)}\nVille : ${customer.city}${note}\n\nMerci de me confirmer la disponibilité et la livraison.`
}

export function buildOrderWhatsAppUrl(order: WhatsAppOrder): string {
  return `https://wa.me/${normalizeMoroccanPhone(order.merchantPhone)}?text=${encodeURIComponent(buildOrderMessage(order))}`
}

export function buildDirectWhatsAppUrl(
  merchantPhone: string,
  productName: string,
  size: string,
): string {
  const message = `Bonjour Parfumerie Bourgois.\nJe souhaite commander ${productName} — ${size}. Pouvez-vous me confirmer sa disponibilité ?`
  return `https://wa.me/${normalizeMoroccanPhone(merchantPhone)}?text=${encodeURIComponent(message)}`
}
