import { ArrowUpRight, Instagram, MapPin, MessageCircle, Music2, ShieldCheck, Truck, Youtube } from 'lucide-react'
import { siteConfig } from '../config/site'
import { BrandLogo } from './BrandLogo'

const socialLinks = [
  { name: 'WhatsApp', href: `https://wa.me/${siteConfig.whatsapp}`, Icon: MessageCircle },
  { name: 'Instagram', href: siteConfig.instagram, Icon: Instagram },
  { name: 'TikTok', href: siteConfig.tiktok, Icon: Music2 },
  { name: 'YouTube', href: siteConfig.youtube, Icon: Youtube },
]

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand" data-reveal="footer">
          <div className="footer-mark"><BrandLogo variant="footer" /></div>
          <p>Des parfums choisis avec exigence pour révéler chaque présence.</p>
          <span><MapPin size={15} />Fès, Maroc</span>
        </div>

        <nav className="footer-column" aria-label="Navigation du pied de page" data-reveal="footer">
          <p>Collections</p>
          <a href="/#femme">Collection Femme</a>
          <a href="/#homme">Collection Homme</a>
          <a href="/#livraison">Livraison &amp; services</a>
          <a href="/#top">Retour en haut</a>
        </nav>

        <div className="footer-column footer-service" data-reveal="footer">
          <p>Nos engagements</p>
          <span><Truck size={16} />Livraison partout au Maroc</span>
          <span><ShieldCheck size={16} />Paiement à la livraison</span>
          <small>Disponibilité et délai confirmés avec notre équipe avant l’envoi.</small>
        </div>

        <div className="footer-social-area" data-reveal="footer">
          <p>Suivez-nous</p>
          <span>Découvrez les nouveautés et nos sélections parfumées.</span>
          <div className="social-links">
            {socialLinks.map(({ name, href, Icon }) => (
              <a key={name} href={href} target="_blank" rel="noreferrer" aria-label={name}>
                <Icon aria-hidden="true" size={18} />
                <span>{name}</span>
                <ArrowUpRight aria-hidden="true" size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Parfumerie Bourgois · Maroc</p>
        <span>Élégance · Authenticité · Présence</span>
      </div>
    </footer>
  )
}
