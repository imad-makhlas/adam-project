import { ArrowUpRight } from 'lucide-react'
import { siteConfig } from '../config/site'
import { BrandLogo } from './BrandLogo'

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="footer-mark"><BrandLogo variant="footer" /></div>
        <p className="footer-tagline">Des parfums choisis pour votre présence.</p>
      </div>
      <div className="footer-links">
        {siteConfig.whatsapp ? <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp <ArrowUpRight size={13} /></a> : <span>Contact WhatsApp bientôt disponible</span>}
        {siteConfig.instagram && <a href={siteConfig.instagram} target="_blank" rel="noreferrer">Instagram <ArrowUpRight size={13} /></a>}
        {siteConfig.email && <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>}
        <details><summary>Livraison</summary><p>Les délais, frais et zones desservies sont confirmés avec notre équipe avant validation.</p></details>
        <details><summary>Retours</summary><p>Les conditions de retour applicables sont communiquées avant la confirmation de la commande.</p></details>
      </div>
      <p className="footer-legal">© {new Date().getFullYear()} Parfumerie Bourgois · Maroc</p>
    </footer>
  )
}
