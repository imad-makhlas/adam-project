import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { products } from '../../data/products'
import { addItem, changeQuantity, removeItem, safeReadBag, safeWriteBag, type BagLine } from './cart'
import { CartContext } from './cart-context'

const STORAGE_KEY = 'noirame-bag'
const availableIds = new Set(products.filter((product) => product.available).map((product) => product.id))
export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<BagLine[]>(() => {
    if (typeof window === 'undefined') return []
    return safeReadBag(window.localStorage, STORAGE_KEY, availableIds)
  })

  useEffect(() => {
    safeWriteBag(window.localStorage, STORAGE_KEY, lines)
  }, [lines])

  const value = useMemo(
    () => ({
      lines,
      itemCount: lines.reduce((total, line) => total + line.quantity, 0),
      add: (productId: string) => {
        if (availableIds.has(productId)) setLines((current) => addItem(current, productId))
      },
      setQuantity: (productId: string, quantity: number) =>
        setLines((current) => changeQuantity(current, productId, quantity)),
      remove: (productId: string) => setLines((current) => removeItem(current, productId)),
    }),
    [lines],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
