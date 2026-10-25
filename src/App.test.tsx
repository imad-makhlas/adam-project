import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { BagDrawer } from './components/BagDrawer'
import { CartProvider } from './features/cart/CartContext'

describe('Parfumerie Bourgois storefront', () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.replaceState({}, '', '/')
  })
  afterEach(() => vi.unstubAllGlobals())
  it('presents separate women and men collections with Moroccan purchase reassurance', () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Parfumerie Bourgois, accueil' })).toBeInTheDocument()
    expect(screen.getByText(/© \d{4} Parfumerie Bourgois · Maroc/)).toBeInTheDocument()
    expect(screen.getByText('Parfumerie Bourgois · Fès')).toBeInTheDocument()

    const announcements = screen.getByRole('region', { name: 'Annonces' })
    const primaryAnnouncements = announcements.querySelector('.announcement-group:not([aria-hidden])')
    if (!primaryAnnouncements) throw new Error('Séquence d’annonces accessible introuvable')
    expect(within(primaryAnnouncements as HTMLElement).getByText('Nouveautés & éditions exclusives')).toBeInTheDocument()
    expect(within(primaryAnnouncements as HTMLElement).getByText('Parfums pour elle & pour lui')).toBeInTheDocument()
    expect(within(primaryAnnouncements as HTMLElement).getByText('Livraison partout au Maroc')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parfums Femme' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Parfums Homme' })).toBeInTheDocument()
    const services = screen.getByRole('region', { name: 'Services' })
    expect(within(services).getByText('Livraison partout au Maroc')).toBeInTheDocument()
    expect(within(services).getByText('Paiement à la livraison')).toBeInTheDocument()
    expect(screen.queryByText(/à configurer/i)).not.toBeInTheDocument()
    expect(screen.getAllByText('Ajouter au panier')).toHaveLength(8)
  })

  it('uses the approved gold perfume bottle artwork in the header logo', () => {
    render(<App />)

    const homeLink = screen.getByRole('link', { name: 'Parfumerie Bourgois, accueil' })
    const logoArtwork = homeLink.querySelector('img')

    expect(logoArtwork).toHaveAttribute('src', '/assets/parfumerie-bourgois-emblem.png')
    expect(logoArtwork).toHaveAttribute('alt', '')
  })

  it('provides a duplicated hidden announcement sequence for seamless motion', () => {
    render(<App />)

    const announcements = screen.getByRole('region', { name: 'Annonces' })
    const sequences = announcements.querySelectorAll('.announcement-group')

    expect(sequences).toHaveLength(2)
    expect(sequences[0]).not.toHaveAttribute('aria-hidden')
    expect(sequences[1]).toHaveAttribute('aria-hidden', 'true')
    expect(within(sequences[1] as HTMLElement).getByText('Livraison partout au Maroc')).toBeInTheDocument()
  })

  it('presents an editorial hero with direct routes to both collections', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: 'Présentation Parfumerie Bourgois' })
    expect(within(hero).getByRole('heading', { name: 'Découvrez votre signature' })).toBeInTheDocument()
    expect(within(hero).getByRole('img', { name: 'Flacons de parfums dans la boutique Parfumerie Bourgois' })).toHaveAttribute('src', '/assets/bourgois-hero-editorial.webp')
    expect(within(hero).getByText('Livraison partout au Maroc')).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: 'Collection Femme' })).toHaveAttribute('href', '#femme')
    expect(within(hero).getByRole('link', { name: 'Collection Homme' })).toHaveAttribute('href', '#homme')
  })

  it('offers professional navigation and four social contact buttons in the footer', () => {
    render(<App />)

    const footer = screen.getByRole('contentinfo')
    expect(within(footer).getByRole('link', { name: 'Collection Femme' })).toHaveAttribute('href', '/#femme')
    expect(within(footer).getByRole('link', { name: 'Collection Homme' })).toHaveAttribute('href', '/#homme')
    expect(within(footer).getByRole('link', { name: 'WhatsApp' })).toHaveAttribute('href', 'https://wa.me/212776755124')
    expect(within(footer).getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', expect.stringContaining('instagram.com'))
    expect(within(footer).getByRole('link', { name: 'TikTok' })).toHaveAttribute('href', expect.stringContaining('tiktok.com'))
    expect(within(footer).getByRole('link', { name: 'YouTube' })).toHaveAttribute('href', expect.stringContaining('youtube.com'))
  })

  it('reveals animated content when it enters the viewport', () => {
    let onIntersect: IntersectionObserverCallback = () => undefined
    const observe = vi.fn()
    const unobserve = vi.fn()
    vi.stubGlobal('IntersectionObserver', class {
      constructor(callback: IntersectionObserverCallback) { onIntersect = callback }
      observe = observe
      unobserve = unobserve
      disconnect = vi.fn()
    })

    render(<App />)
    const card = screen.getByRole('heading', { name: 'Miss Dior' }).closest('article')
    if (!card) throw new Error('Carte Miss Dior introuvable')

    expect(card).toHaveAttribute('data-reveal')
    expect(observe).toHaveBeenCalledWith(card)
    onIntersect(
      [{ isIntersecting: true, target: card } as unknown as IntersectionObserverEntry],
      {} as IntersectionObserver,
    )
    expect(card).toHaveClass('is-revealed')
    expect(unobserve).toHaveBeenCalledWith(card)
  })

  it('shows reveal content immediately when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined)
    render(<App />)

    const card = screen.getByRole('heading', { name: 'Miss Dior' }).closest('article')
    expect(card).toHaveClass('is-revealed')
  })

  it('adds a perfume to the bag and exposes checkout', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ajouter Miss Dior au panier' }))
    expect(screen.getByRole('button', { name: 'Ouvrir le panier, 1 article' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ouvrir le panier, 1 article' }))
    const drawer = screen.getByRole('dialog', { name: 'Votre sélection' })
    expect(drawer).toBeInTheDocument()
    expect(within(drawer).getByText('899 MAD')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuer sur WhatsApp' })).toBeInTheDocument()
  })

  it('opens a dedicated product page with related perfumes and sends its quantity to checkout', async () => {
    const user = userEvent.setup()
    render(<App />)

    const lacosteCard = screen.getByRole('heading', { name: 'Lacoste Original' }).closest('article')
    if (!lacosteCard) throw new Error('Carte Lacoste Original introuvable')
    expect(within(lacosteCard).queryByText('Une fraîcheur aromatique nette et élégante.')).not.toBeInTheDocument()
    expect(within(lacosteCard).queryByText('Bergamote · Lavande · Patchouli')).not.toBeInTheDocument()

    await user.click(within(lacosteCard).getByRole('link', { name: 'Voir Lacoste Original' }))
    expect(window.location.pathname).toBe('/parfum/lacoste-original')

    const productPage = screen.getByRole('main')
    expect(within(productPage).getByRole('heading', { name: 'Lacoste Original', level: 1 })).toBeInTheDocument()
    expect(within(productPage).getByText(/649\s*MAD/)).toBeInTheDocument()
    expect(within(productPage).getByText('100 ml')).toBeInTheDocument()
    expect(within(productPage).getByText('Une fraîcheur aromatique nette et élégante.')).toBeInTheDocument()

    const suggestions = within(productPage).getByRole('region', { name: 'Parfums similaires' })
    expect(within(suggestions).queryByRole('heading', { name: 'Lacoste Original' })).not.toBeInTheDocument()
    expect(within(suggestions).getAllByRole('article')).toHaveLength(3)

    const quantity = within(productPage).getByRole('group', { name: 'Quantité de Lacoste Original' })
    await user.click(within(quantity).getByRole('button', { name: 'Ajouter une unité de Lacoste Original' }))
    expect(within(quantity).getByText('2')).toBeInTheDocument()
    await user.click(within(productPage).getByRole('button', { name: 'Commander avec paiement à la livraison' }))

    const drawer = screen.getByRole('dialog', { name: 'Votre sélection' })
    expect(within(drawer).getByRole('heading', { name: 'Lacoste Original' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ouvrir le panier, 2 articles' })).toBeInTheDocument()
  })

  it('renders a shared product URL directly and returns to the catalogue with browser history', async () => {
    window.history.replaceState({}, '', '/parfum/miss-dior')
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Miss Dior', level: 1 })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Parfums Femme' })).not.toBeInTheDocument()

    act(() => {
      window.history.pushState({}, '', '/')
      window.dispatchEvent(new PopStateEvent('popstate'))
    })

    expect(await screen.findByRole('heading', { name: 'Parfums Femme' })).toBeInTheDocument()
  })

  it('exposes an accessible animated mobile menu state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const menuButton = screen.getByRole('button', { name: 'Ouvrir le menu' })
    expect(menuButton).toHaveAttribute('aria-expanded', 'false')
    expect(menuButton).toHaveAttribute('aria-controls', 'navigation-principale')

    await user.click(menuButton)
    expect(screen.getByRole('button', { name: 'Fermer le menu' })).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getByRole('navigation', { name: 'Navigation principale' })).toHaveClass('is-open')
  })

  it('closes the mobile menu when the shopper clicks outside the header', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    await user.click(screen.getByRole('main'))

    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes the mobile menu with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ouvrir le menu' }))
    await user.keyboard('{Escape}')

    expect(screen.getByRole('button', { name: 'Ouvrir le menu' })).toHaveAttribute('aria-expanded', 'false')
  })

  it('announces checkout errors and closes the modal with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Ajouter Miss Dior au panier' }))
    const opener = screen.getByRole('button', { name: 'Ouvrir le panier, 1 article' })
    await user.click(opener)
    await user.click(screen.getByRole('button', { name: 'Continuer sur WhatsApp' }))

    expect(screen.getByRole('alert')).toHaveTextContent('Vérifiez les informations demandées')
    expect(screen.getByRole('textbox', { name: /Téléphone/ })).toHaveAttribute('aria-invalid', 'true')

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: 'Votre sélection' })).not.toBeInTheDocument()
    expect(opener).toHaveFocus()
  })

  it('redirects the completed order without displaying a copy-message panel', async () => {
    const user = userEvent.setup()
    const redirect = vi.fn()
    window.localStorage.setItem('noirame-bag', JSON.stringify([{ productId: 'miss-dior', quantity: 1 }]))
    render(<CartProvider><BagDrawer open onClose={() => undefined} onWhatsAppRedirect={redirect} /></CartProvider>)

    await user.type(screen.getByLabelText('Nom complet'), 'Imad M')
    await user.type(screen.getByLabelText('Téléphone'), '0776755124')
    await user.type(screen.getByLabelText('Ville'), 'Casablanca')
    await user.click(screen.getByRole('button', { name: 'Continuer sur WhatsApp' }))

    expect(redirect).toHaveBeenCalledWith(expect.stringContaining('https://wa.me/212776755124?text='))
    expect(screen.queryByText('WhatsApp ne s’ouvre pas ?')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Copier le message' })).not.toBeInTheDocument()
  })
})
