import { Check, MessageCircle, Truck } from 'lucide-react'

export function TrustStrip() {
  return (
    <section className="trust-strip" id="livraison" aria-label="Services">
      <div data-reveal="service"><Truck size={22} /><span><strong>Livraison partout au Maroc</strong><small>Expédition suivie</small></span></div>
      <div data-reveal="service"><Check size={22} /><span><strong>Paiement à la livraison</strong><small>Simple et rassurant</small></span></div>
      <div data-reveal="service"><MessageCircle size={22} /><span><strong>Commande via WhatsApp</strong><small>Confirmation personnalisée</small></span></div>
    </section>
  )
}
