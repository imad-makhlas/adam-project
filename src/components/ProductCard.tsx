import { useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../features/cart/cart-context'
import { formatPrice } from '../features/catalog/format-price'

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const { add } = useCart()
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="product-card">
      <button className={`product-image product-image--${product.imageTone}`} type="button" aria-label={`Voir ${product.name}`} onClick={() => onOpen(product)}>
        {imageFailed ? (
          <div className="image-fallback" aria-label={`Visuel de ${product.name}`}>BOURGOIS</div>
        ) : (
          <img src={product.image} alt={`Flacon ${product.name}`} loading="lazy" width="1254" height="1254" onError={() => setImageFailed(true)} />
        )}
        {!product.available && <span className="availability-badge">Indisponible</span>}
      </button>
      <div className="product-card-content">
        <button className="product-card-title" type="button" onClick={() => onOpen(product)}><h3>{product.name}</h3></button>
        <p>{formatPrice(product.price)}</p>
        <button type="button" onClick={() => add(product.id)} aria-label={`Ajouter ${product.name} au panier`} disabled={!product.available}>
          {product.available ? 'Ajouter au panier' : 'Indisponible'}
        </button>
      </div>
    </article>
  )
}
