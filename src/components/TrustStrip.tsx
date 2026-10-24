import { Check, MessageCircle, Truck } from 'lucide-react'

export function TrustStrip() {
  return (
    <section className="trust-strip" id="livraison" aria-label="Services">
      <div><Truck size={22} /><span><strong>Livraison partout au Maroc</strong><small>Expédition suivie</small></span></div>
      <div><Check size={22} /><span><strong>Paiement à la livraison</strong><small>Simple et rassurant</small></span></div>
      <div><MessageCircle size={22} /><span><strong>Commande via WhatsApp</strong><small>Confirmation personnalisée</small></span></div>
    </section>
  )
}
