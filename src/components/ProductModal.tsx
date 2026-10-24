import { Minus, Plus, ShoppingCart, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../features/cart/cart-context'
import { formatPrice } from '../features/catalog/format-price'

type ProductModalProps = {
  product: Product
  onClose: () => void
  onOrderNow: (productId: string, quantity: number) => void
}

export function ProductModal({ product, onClose, onOrderNow }: ProductModalProps) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    openerRef.current = document.activeElement as HTMLElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      openerRef.current?.focus()
    }
  }, [onClose])

  const addSelectedQuantity = () => {
    for (let unit = 0; unit < quantity; unit += 1) add(product.id)
    onClose()
  }

  return (
    <div className="product-modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-modal" role="dialog" aria-modal="true" aria-labelledby="product-modal-title">
        <button ref={closeRef} className="product-modal-close" type="button" aria-label="Fermer la fiche produit" onClick={onClose}>
          <X size={20} />
        </button>
        <div className={`product-modal-media product-image--${product.imageTone}`}>
          <img src={product.image} alt={`Flacon ${product.name}`} width="1254" height="1254" />
        </div>
        <div className="product-modal-content">
          <p className="eyebrow">Parfum {product.audience}</p>
          <h2 id="product-modal-title">{product.name}</h2>
          <p className="product-modal-price">{formatPrice(product.price)}</p>
          <div className="product-modal-format">
            <span>Format</span>
            <strong>{product.size}</strong>
          </div>
          <div className="product-modal-quantity">
            <span>Quantité</span>
            <div role="group" aria-label={`Quantité de ${product.name}`}>
              <button type="button" aria-label={`Retirer une unité de ${product.name}`} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={14} /></button>
              <strong>{quantity}</strong>
              <button type="button" aria-label={`Ajouter une unité de ${product.name}`} onClick={() => setQuantity((current) => current + 1)}><Plus size={14} /></button>
            </div>
          </div>
          <button className="product-modal-add" type="button" onClick={addSelectedQuantity}>Ajouter au panier</button>
          <button className="product-modal-order" type="button" onClick={() => onOrderNow(product.id, quantity)}>
            <ShoppingCart size={17} />Commander avec paiement à la livraison
          </button>
        </div>
      </section>
    </div>
  )
}
