import { describe, expect, it } from 'vitest'
import { addItem, calculateBagTotal, changeQuantity, removeItem, restoreBag, safeReadBag, safeWriteBag } from './cart'

describe('shopping bag', () => {
  it('combines repeated products instead of creating duplicate lines', () => {
    const first = addItem([], 'ame-blanche')
    expect(addItem(first, 'ame-blanche')).toEqual([{ productId: 'ame-blanche', quantity: 2 }])
  })

  it('removes a line when its quantity reaches zero', () => {
    const bag = [{ productId: 'ame-blanche', quantity: 1 }]
    expect(changeQuantity(bag, 'ame-blanche', 0)).toEqual([])
    expect(removeItem(bag, 'ame-blanche')).toEqual([])
  })

  it('calculates totals from current catalogue prices', () => {
    const bag = [
      { productId: 'ame-blanche', quantity: 2 },
      { productId: 'bois-noir', quantity: 1 },
    ]
    const prices = { 'ame-blanche': 690, 'bois-noir': 740 }
    expect(calculateBagTotal(bag, prices)).toBe(2120)
  })

  it('drops malformed and unavailable entries restored from storage', () => {
    const raw = JSON.stringify([
      { productId: 'ame-blanche', quantity: 2 },
      { productId: 'missing', quantity: 1 },
      { productId: 'bois-noir', quantity: -4 },
    ])
    expect(restoreBag(raw, new Set(['ame-blanche', 'bois-noir']))).toEqual([
      { productId: 'ame-blanche', quantity: 2 },
    ])
  })

  it('continues with an in-memory bag when browser storage is unavailable', () => {
    const blockedStorage = {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('full') },
    }
    expect(safeReadBag(blockedStorage, 'bag', new Set(['ame-blanche']))).toEqual([])
    expect(() => safeWriteBag(blockedStorage, 'bag', [{ productId: 'ame-blanche', quantity: 1 }])).not.toThrow()
  })
})
