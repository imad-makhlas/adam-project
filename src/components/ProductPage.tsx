import { ArrowLeft, Minus, Plus, ShoppingBag, ShieldCheck, Truck } from 'lucide-react'
import { useState } from 'react'
import { products, type Product } from '../data/products'
import { useCart } from '../features/cart/cart-context'
import { formatPrice } from '../features/catalog/format-price'
import { ProductCard } from './ProductCard'

type ProductPageProps = {
  product: Product
  onBack: () => void
  onOpenProduct: (product: Product) => void
  onOrderNow: (productId: string, quantity: number) => void
}

export function ProductPage({ product, onBack, onOpenProduct, onOrderNow }: ProductPageProps) {
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const suggestions = products
    .filter((candidate) => candidate.audience === product.audience && candidate.id !== product.id)
    .slice(0, 3)

  const addSelectedQuantity = () => {
    for (let unit = 0; unit < quantity; unit += 1) add(product.id)
  }

  return (
    <div className="product-page">
      <div className="product-page-breadcrumb">
        <a href="/" onClick={(event) => { event.preventDefault(); onBack() }}>
          <ArrowLeft size={15} aria-hidden="true" />Retour aux collections
        </a>
      </div>

      <section className="product-detail" aria-labelledby="product-page-title">
        <div className={`product-detail-media product-image--${product.imageTone}`}>
          <span>Parfumerie Bourgois</span>
          <img src={product.image} alt={`Flacon ${product.name}`} width="1254" height="1254" />
        </div>

        <div className="product-detail-content">
          <p className="eyebrow">Collection {product.audience}</p>
          <h1 id="product-page-title">{product.name}</h1>
          <p className="product-detail-price">{formatPrice(product.price)}</p>
          <p className="product-detail-description">{product.description}</p>

          <div className="product-detail-notes" aria-label="Notes olfactives">
            {product.notes.map((note) => <span key={note}>{note}</span>)}
          </div>

          <div className="product-detail-options">
            <div>
              <span>Format</span>
              <strong>{product.size}</strong>
            </div>
            <div className="product-detail-quantity">
              <span>Quantité</span>
              <div role="group" aria-label={`Quantité de ${product.name}`}>
                <button type="button" aria-label={`Retirer une unité de ${product.name}`} onClick={() => setQuantity((current) => Math.max(1, current - 1))}><Minus size={14} /></button>
                <strong>{quantity}</strong>
                <button type="button" aria-label={`Ajouter une unité de ${product.name}`} onClick={() => setQuantity((current) => current + 1)}><Plus size={14} /></button>
              </div>
            </div>
          </div>

          <button className="product-detail-add" type="button" onClick={addSelectedQuantity}>Ajouter au panier</button>
          <button className="product-detail-order" type="button" onClick={() => onOrderNow(product.id, quantity)}>
            <ShoppingBag size={17} aria-hidden="true" />Commander avec paiement à la livraison
          </button>

          <div className="product-detail-reassurance">
            <span><Truck size={16} aria-hidden="true" />Livraison partout au Maroc</span>
            <span><ShieldCheck size={16} aria-hidden="true" />Confirmation directe sur WhatsApp</span>
          </div>
        </div>
      </section>

      <section className="product-suggestions" aria-label="Parfums similaires">
        <div className="suggestions-heading">
          <p className="eyebrow">Vous aimerez aussi</p>
          <h2>D’autres signatures à découvrir</h2>
        </div>
        <div className="product-grid product-grid--suggestions">
          {suggestions.map((suggestion) => (
            <ProductCard key={suggestion.id} product={suggestion} onOpen={onOpenProduct} />
          ))}
        </div>
      </section>
    </div>
  )
}
