import { ArrowRight, Truck } from 'lucide-react'

export function Hero() {
  return (
    <section className="hero" id="top" aria-label="Présentation Parfumerie Bourgois">
      <img
        className="hero-backdrop"
        src="/assets/bourgois-hero-editorial.webp"
        alt="Flacons de parfums dans la boutique Parfumerie Bourgois"
        width="1916"
        height="855"
        fetchPriority="high"
      />
      <div className="hero-overlay" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">Parfumerie Bourgois · Fès</p>
        <h1>Découvrez<br /><em>votre signature</em></h1>
        <p className="hero-intro">Une sélection de parfums de caractère pour elle et pour lui, livrée partout au Maroc.</p>
        <div className="hero-actions">
          <a className="primary-link" href="#femme">Collection Femme <ArrowRight size={15} /></a>
          <a className="secondary-link" href="#homme">Collection Homme <ArrowRight size={15} /></a>
        </div>
        <p className="hero-delivery"><Truck size={15} />Livraison partout au Maroc</p>
      </div>
    </section>
  )
}
