import { useState } from 'react'
import { BagDrawer } from './components/BagDrawer'
import { CollectionSection } from './components/CollectionSection'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Hero } from './components/Hero'
import { TrustStrip } from './components/TrustStrip'
import { ProductPage } from './components/ProductPage'
import { products, type Product } from './data/products'
import { CartProvider } from './features/cart/CartContext'
import { useCart } from './features/cart/cart-context'
import { useScrollReveal } from './features/motion/useScrollReveal'
import { useBrowserPath } from './features/navigation/useBrowserPath'

function Storefront() {
  const [bagOpen, setBagOpen] = useState(false)
  const { add } = useCart()
  const { pathname, navigate } = useBrowserPath()
  const productId = pathname.match(/^\/parfum\/([^/]+)\/?$/)?.[1]
  const selectedProduct = products.find((product) => product.id === productId)
  useScrollReveal(pathname)

  const openProduct = (product: Product) => navigate(`/parfum/${product.id}`)
  const orderNow = (productId: string, quantity = 1) => {
    for (let unit = 0; unit < quantity; unit += 1) add(productId)
    setBagOpen(true)
  }

  return (
    <div className="site-shell">
      <Header onOpenBag={() => setBagOpen(true)} />
      <main>
        {selectedProduct ? (
          <ProductPage
            key={selectedProduct.id}
            product={selectedProduct}
            onBack={() => navigate('/')}
            onOpenProduct={openProduct}
            onOrderNow={orderNow}
          />
        ) : (
          <>
            <Hero />
            <CollectionSection audience="femme" onOpenProduct={openProduct} />
            <CollectionSection audience="homme" onOpenProduct={openProduct} />
            <TrustStrip />
          </>
        )}
      </main>
      <Footer />
      <BagDrawer open={bagOpen} onClose={() => setBagOpen(false)} />
    </div>
  )
}

export default function App() {
  return <CartProvider><Storefront /></CartProvider>
}
