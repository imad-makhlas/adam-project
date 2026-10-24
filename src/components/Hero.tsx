import { ArrowRight, Check } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Présentation Parfumerie Bourgois">
      <img
        className="hero-backdrop"
        src="/assets/noirame-hero-campaign.png"
        alt="Collection de flacons de parfum aux reflets ambrés et dorés"
        width="2020"
        height="778"
        fetchPriority="high"
      />
      <div className="hero-copy">
        <p className="eyebrow">Parfumerie Bourgois · Fès</p>
        <h1>Le parfum qui<br /><em>révèle votre présence.</em></h1>
        <p className="hero-intro">
          Des signatures de caractère, sélectionnées pour accompagner chaque présence avec distinction.
        </p>
        <ul className="hero-promises" aria-label="Nos engagements">
          <li><span><Check aria-hidden="true" /></span>Livraison partout au Maroc</li>
          <li><span><Check aria-hidden="true" /></span>Parfums pour elle et pour lui</li>
          <li><span><Check aria-hidden="true" /></span>Commande rapide sur WhatsApp</li>
        </ul>
        <a className="primary-link" href="#femme">
          Découvrir la collection <ArrowRight size={16} />
        </a>
      </div>
    </section>
  )
}
