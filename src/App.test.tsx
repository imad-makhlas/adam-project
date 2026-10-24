import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'
import { BagDrawer } from './components/BagDrawer'
import { CartProvider } from './features/cart/CartContext'

describe('Parfumerie Bourgois storefront', () => {
  beforeEach(() => window.localStorage.clear())
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
    expect(screen.getAllByText('Ajouter au panier')).toHaveLength(6)
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

  it('presents the campaign hero with clear Moroccan shopping promises', () => {
    render(<App />)

    const hero = screen.getByRole('region', { name: 'Présentation Parfumerie Bourgois' })
    expect(within(hero).getByRole('heading', { name: 'Le parfum qui révèle votre présence.' })).toBeInTheDocument()
    expect(within(hero).getByText('Livraison partout au Maroc')).toBeInTheDocument()
    expect(within(hero).getByText('Parfums pour elle et pour lui')).toBeInTheDocument()
    expect(within(hero).getByText('Commande rapide sur WhatsApp')).toBeInTheDocument()
    expect(within(hero).getByRole('link', { name: 'Découvrir la collection' })).toHaveAttribute('href', '#femme')
  })

  it('adds a perfume to the bag and exposes checkout', async () => {
    const user = userEvent.setup()
    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Ajouter Âme Blanche au panier' }))
    expect(screen.getByRole('button', { name: 'Ouvrir le panier, 1 article' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ouvrir le panier, 1 article' }))
    const drawer = screen.getByRole('dialog', { name: 'Votre sélection' })
    expect(drawer).toBeInTheDocument()
    expect(within(drawer).getByText('690 MAD')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continuer sur WhatsApp' })).toBeInTheDocument()
  })

  it('opens a simple product view and sends the selected quantity to checkout', async () => {
    const user = userEvent.setup()
    render(<App />)

    const boisNoirCard = screen.getByRole('heading', { name: 'Bois Noir' }).closest('article')
    if (!boisNoirCard) throw new Error('Carte Bois Noir introuvable')
    expect(within(boisNoirCard).queryByText('Boisé, précis et profondément moderne.')).not.toBeInTheDocument()
    expect(within(boisNoirCard).queryByText('Poivre noir · Cèdre · Vétiver')).not.toBeInTheDocument()

    await user.click(within(boisNoirCard).getByRole('button', { name: 'Voir Bois Noir' }))
    const productDialog = screen.getByRole('dialog', { name: 'Bois Noir' })
    expect(within(productDialog).getByText(/740\s*MAD/)).toBeInTheDocument()
    expect(within(productDialog).getByText('75 ml')).toBeInTheDocument()

    const quantity = within(productDialog).getByRole('group', { name: 'Quantité de Bois Noir' })
    await user.click(within(quantity).getByRole('button', { name: 'Ajouter une unité de Bois Noir' }))
    expect(within(quantity).getByText('2')).toBeInTheDocument()
    await user.click(within(productDialog).getByRole('button', { name: 'Commander avec paiement à la livraison' }))

    const drawer = screen.getByRole('dialog', { name: 'Votre sélection' })
    expect(within(drawer).getByRole('heading', { name: 'Bois Noir' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Ouvrir le panier, 2 articles' })).toBeInTheDocument()
  })

  it('announces checkout errors and closes the modal with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.click(screen.getByRole('button', { name: 'Ajouter Âme Blanche au panier' }))
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
    window.localStorage.setItem('noirame-bag', JSON.stringify([{ productId: 'ame-blanche', quantity: 1 }]))
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
