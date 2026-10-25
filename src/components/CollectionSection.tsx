import type { Audience } from '../features/catalog/catalog'
import { filterByAudience } from '../features/catalog/catalog'
import { products, type Product } from '../data/products'
import { ProductCard } from './ProductCard'

export function CollectionSection({ audience, onOpenProduct }: { audience: Audience; onOpenProduct: (product: Product) => void }) {
  const collection = filterByAudience(products, audience)
  const label = audience === 'femme' ? 'Femme' : 'Homme'

  return (
    <section className="collection" id={audience} aria-labelledby={`${audience}-title`}>
      <div className="section-heading" data-reveal="heading">
        <p className="eyebrow">Collection {label}</p>
        <h2 id={`${audience}-title`}>Parfums {label}</h2>
        <p>{audience === 'femme' ? 'Des compositions lumineuses, florales et enveloppantes.' : 'Des sillages boisés, minéraux et affirmés.'}</p>
      </div>
      <div className="product-grid">
        {collection.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={onOpenProduct} />
        ))}
      </div>
    </section>
  )
}
