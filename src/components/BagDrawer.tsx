import { zodResolver } from '@hookform/resolvers/zod'
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { siteConfig } from '../config/site'
import { products } from '../data/products'
import { useCart } from '../features/cart/cart-context'
import { calculateBagTotal } from '../features/cart/cart'
import { checkoutSchema, type CheckoutValues } from '../features/checkout/checkout-schema'
import { buildOrderWhatsAppUrl } from '../features/checkout/whatsapp'

const priceMap = Object.fromEntries(products.map((product) => [product.id, product.price]))

type BagDrawerProps = {
  open: boolean
  onClose: () => void
  onWhatsAppRedirect?: (url: string) => void
}

export function BagDrawer({
  open,
  onClose,
  onWhatsAppRedirect = (url) => window.location.assign(url),
}: BagDrawerProps) {
  const { lines, setQuantity, remove } = useCart()
  const dialogRef = useRef<HTMLElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLElement | null>(null)
  const [hasSubmitErrors, setHasSubmitErrors] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { name: '', phone: '', city: '', note: '' },
  })

  useEffect(() => {
    if (!open) return
    openerRef.current = document.activeElement as HTMLElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return
      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input, textarea'))
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      openerRef.current?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  const detailedLines = lines.flatMap((line) => {
    const product = products.find((item) => item.id === line.productId)
    return product ? [{ ...line, product }] : []
  })
  const total = calculateBagTotal(lines, priceMap)

  const submit = (customer: CheckoutValues) => {
    setHasSubmitErrors(false)
    const order = {
      merchantPhone: siteConfig.whatsapp,
      customer,
      lines: detailedLines.map(({ quantity, product }) => ({
        name: product.name,
        size: product.size,
        quantity,
        price: product.price,
      })),
    }
    onWhatsAppRedirect(buildOrderWhatsAppUrl(order))
  }

  return (
    <div className="drawer-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside ref={dialogRef} className="bag-drawer" role="dialog" aria-modal="true" aria-labelledby="bag-title">
        <div className="drawer-header">
          <div>
            <p className="eyebrow">Panier</p>
            <h2 id="bag-title">Votre sélection</h2>
          </div>
          <button ref={closeRef} type="button" aria-label="Fermer le panier" onClick={onClose}><X /></button>
        </div>

        {detailedLines.length === 0 ? (
          <div className="empty-bag">
            <ShoppingBag size={32} strokeWidth={1.2} />
            <p>Votre panier est encore vide.</p>
            <button type="button" onClick={onClose}>Découvrir les parfums</button>
          </div>
        ) : (
          <>
            <div className="bag-lines">
              {detailedLines.map(({ product, quantity }) => (
                <article className="bag-line" key={product.id}>
                  <img src={product.image} alt="" width="82" height="98" />
                  <div>
                    <h3>{product.name}</h3>
                    <p>{product.size} · {product.price} MAD</p>
                    <div className="quantity-control" aria-label={`Quantité de ${product.name}`}>
                      <button type="button" aria-label={`Retirer une unité de ${product.name}`} onClick={() => setQuantity(product.id, quantity - 1)}><Minus size={13} /></button>
                      <span>{quantity}</span>
                      <button type="button" aria-label={`Ajouter une unité de ${product.name}`} onClick={() => setQuantity(product.id, quantity + 1)}><Plus size={13} /></button>
                    </div>
                  </div>
                  <button className="remove-line" type="button" aria-label={`Supprimer ${product.name}`} onClick={() => remove(product.id)}><Trash2 size={16} /></button>
                </article>
              ))}
            </div>

            <div className="bag-total"><span>Total</span><strong>{total} MAD</strong></div>

            <form className="checkout-form" onSubmit={handleSubmit(submit, () => setHasSubmitErrors(true))} noValidate>
              <p>Vos coordonnées</p>
              {hasSubmitErrors && <p className="form-alert" role="alert">Vérifiez les informations demandées.</p>}
              <label htmlFor="checkout-name">Nom complet<input id="checkout-name" {...register('name')} placeholder="Votre nom" aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? 'name-error' : undefined} />{errors.name && <small id="name-error">{errors.name.message}</small>}</label>
              <div className="form-row">
                <label htmlFor="checkout-phone">Téléphone<input id="checkout-phone" {...register('phone')} inputMode="tel" placeholder="06 00 00 00 00" aria-invalid={Boolean(errors.phone)} aria-describedby={errors.phone ? 'phone-error' : undefined} />{errors.phone && <small id="phone-error">{errors.phone.message}</small>}</label>
                <label htmlFor="checkout-city">Ville<input id="checkout-city" {...register('city')} placeholder="Casablanca" aria-invalid={Boolean(errors.city)} aria-describedby={errors.city ? 'city-error' : undefined} />{errors.city && <small id="city-error">{errors.city.message}</small>}</label>
              </div>
              <label htmlFor="checkout-note">Note <span>(facultatif)</span><textarea id="checkout-note" {...register('note')} rows={2} placeholder="Quartier, horaire…" aria-invalid={Boolean(errors.note)} aria-describedby={errors.note ? 'note-error' : undefined} />{errors.note && <small id="note-error">{errors.note.message}</small>}</label>
              <button className="whatsapp-checkout" type="submit" aria-label="Continuer sur WhatsApp">Continuer sur WhatsApp <span>↗</span></button>
              <small className="checkout-note">Votre commande sera confirmée avec notre équipe sur WhatsApp.</small>
            </form>
          </>
        )}
      </aside>
    </div>
  )
}
