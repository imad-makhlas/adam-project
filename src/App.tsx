import { useState } from 'react'
import { BagDrawer } from './components/BagDrawer'
import { CollectionSection } from './components/CollectionSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrustStrip } from './components/TrustStrip'
import { ProductModal } from './components/ProductModal'
import { type Product } from './data/products'
import { CartProvider } from './features/cart/CartContext'
import { useCart } from './features/cart/cart-context'

function Storefront() {
  const [bagOpen, setBagOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { add } = useCart()
  const orderNow = (productId: string, quantity = 1) => {
    for (let unit = 0; unit < quantity; unit += 1) add(productId)
    setSelectedProduct(null)
    setBagOpen(true)
  }

  return (
    <div className="site-shell">
      <Header onOpenBag={() => setBagOpen(true)} />
      <main>
        <Hero />
        <CollectionSection audience="femme" onOpenProduct={setSelectedProduct} />
        <CollectionSection audience="homme" onOpenProduct={setSelectedProduct} />
        <TrustStrip />
      </main>
      <Footer />
      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
      {selectedProduct && (
        <ProductModal
          key={selectedProduct.id}
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onOrderNow={orderNow}
        />
      )}
    </div>
  )
}

export default function App() {
  return <CartProvider><Storefront /></CartProvider>
}
