type BrandLogoProps = {
  variant?: 'header' | 'footer'
}

export function BrandLogo({ variant = 'header' }: BrandLogoProps) {
  return (
    <span className={`brand-logo brand-logo--${variant}`}>
      <img
        className="brand-emblem"
        src="/assets/parfumerie-bourgois-emblem.png"
        alt=""
        width="1536"
        height="1024"
      />
      <span className="brand-lockup">
        <span className="brand-kicker">Parfumerie</span>
        <span className="brand-name">Bourgois</span>
      </span>
    </span>
  )
}
