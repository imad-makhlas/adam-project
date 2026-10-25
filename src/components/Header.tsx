import { Heart, ShoppingBag, Sparkles, Truck } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useCart } from '../features/cart/cart-context'
import { BrandLogo } from './BrandLogo'

function AnnouncementGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div className="announcement-group" aria-hidden={hidden || undefined}>
      <span className="announcement-item"><Sparkles aria-hidden="true" />Nouveautés &amp; éditions exclusives</span>
      <span className="announcement-separator" aria-hidden="true">◆</span>
      <span className="announcement-item"><Heart aria-hidden="true" />Parfums pour elle &amp; pour lui</span>
      <span className="announcement-separator" aria-hidden="true">◆</span>
      <span className="announcement-item"><Truck aria-hidden="true" />Livraison partout au Maroc</span>
      <span className="announcement-separator" aria-hidden="true">◆</span>
    </div>
  )
}

export function Header({ onOpenBag }: { onOpenBag: () => void }) {
  const { itemCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [menuOpen])

  return (
    <>
      <div className="announcement" role="region" aria-label="Annonces">
        <div className="announcement-track">
          <AnnouncementGroup />
          <AnnouncementGroup hidden />
        </div>
      </div>
      <header ref={headerRef} className="site-header">
        <button
          className={menuOpen ? 'mobile-menu-button is-open' : 'mobile-menu-button'}
          type="button"
          aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={menuOpen}
          aria-controls="navigation-principale"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="menu-line" />
          <span className="menu-line" />
        </button>
        <a className="wordmark" href="/" aria-label="Parfumerie Bourgois, accueil">
          <BrandLogo />
        </a>
        <nav id="navigation-principale" className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Navigation principale">
          <a href="/#femme" onClick={() => setMenuOpen(false)}>Femme</a>
          <a href="/#homme" onClick={() => setMenuOpen(false)}>Homme</a>
          <a href="/#livraison" onClick={() => setMenuOpen(false)}>Livraison</a>
        </nav>
        <button
          className="bag-button"
          type="button"
          onClick={onOpenBag}
          aria-label={`Ouvrir le panier, ${itemCount} article${itemCount === 1 ? '' : 's'}`}
        >
          <ShoppingBag size={19} strokeWidth={1.7} />
          <span>Panier</span>
          <span className="bag-count">{itemCount}</span>
        </button>
      </header>
      {menuOpen && <div className="mobile-menu-scrim" aria-hidden="true" />}
    </>
  )
}
