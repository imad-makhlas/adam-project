import { useState } from 'react'
import type { Product } from '../data/products'
import { useCart } from '../features/cart/cart-context'
import { formatPrice } from '../features/catalog/format-price'

export function ProductCard({ product, onOpen }: { product: Product; onOpen: (product: Product) => void }) {
  const { add } = useCart()
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article className="product-card" data-reveal="card">
      <div className={`product-image product-image--${product.imageTone}`}>
        {imageFailed ? (
          <div className="image-fallback" aria-label={`Visuel de ${product.name}`}>BOURGOIS</div>
        ) : (
          <img src={product.image} alt={`Flacon ${product.name}`} loading="lazy" width="1254" height="1254" onError={() => setImageFailed(true)} />
        )}
        {!product.available && <span className="availability-badge">Indisponible</span>}
      </div>
      <div className="product-card-content">
        <a className="product-card-title" href={`/parfum/${product.id}`} aria-label={`Voir ${product.name}`} onClick={(event) => { event.preventDefault(); onOpen(product) }}><h3>{product.name}</h3></a>
        <p>{formatPrice(product.price)}</p>
        <button type="button" onClick={() => add(product.id)} aria-label={`Ajouter ${product.name} au panier`} disabled={!product.available}>
          {product.available ? 'Ajouter au panier' : 'Indisponible'}
        </button>
      </div>
    </article>
  )
}
