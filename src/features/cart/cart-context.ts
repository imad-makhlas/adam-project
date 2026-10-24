import { createContext, useContext } from 'react'
import type { BagLine } from './cart'

export type CartContextValue = {
  lines: BagLine[]
  itemCount: number
  add: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  remove: (productId: string) => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const value = useContext(CartContext)
  if (!value) throw new Error('useCart must be used inside CartProvider')
  return value
}
