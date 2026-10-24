export type BagLine = {
  productId: string
  quantity: number
}

type StorageLike = Pick<Storage, 'getItem' | 'setItem'>

export function addItem(bag: BagLine[], productId: string): BagLine[] {
  const existing = bag.find((line) => line.productId === productId)
  if (!existing) return [...bag, { productId, quantity: 1 }]

  return bag.map((line) =>
    line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line,
  )
}

export function changeQuantity(bag: BagLine[], productId: string, quantity: number): BagLine[] {
  if (quantity <= 0) return removeItem(bag, productId)
  return bag.map((line) => (line.productId === productId ? { ...line, quantity } : line))
}

export function removeItem(bag: BagLine[], productId: string): BagLine[] {
  return bag.filter((line) => line.productId !== productId)
}

export function calculateBagTotal(
  bag: BagLine[],
  prices: Record<string, number>,
): number {
  return bag.reduce((total, line) => total + (prices[line.productId] ?? 0) * line.quantity, 0)
}

export function restoreBag(raw: string | null, availableIds: Set<string>): BagLine[] {
  if (!raw) return []

  try {
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (line): line is BagLine =>
        typeof line === 'object' &&
        line !== null &&
        'productId' in line &&
        typeof line.productId === 'string' &&
        availableIds.has(line.productId) &&
        'quantity' in line &&
        Number.isInteger(line.quantity) &&
        Number(line.quantity) > 0,
    )
  } catch {
    return []
  }
}

export function safeReadBag(storage: StorageLike, key: string, availableIds: Set<string>): BagLine[] {
  try {
    return restoreBag(storage.getItem(key), availableIds)
  } catch {
    return []
  }
}

export function safeWriteBag(storage: StorageLike, key: string, bag: BagLine[]): void {
  try {
    storage.setItem(key, JSON.stringify(bag))
  } catch {
    // The bag remains available in memory when privacy settings or quota block storage.
  }
}
