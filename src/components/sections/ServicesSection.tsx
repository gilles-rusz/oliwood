const ICON_PROPS = {
  viewBox: '0 0 48 48',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className: 'service-icon',
}

function CarportIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M6 20 24 8l18 12" />
      <path d="M10 20v20M38 20v20" />
      <path d="M10 24h28" />
    </svg>
  )
}

function TerrasseIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M6 22h36M6 30h36" />
      <path d="M10 22v-8M18 22v-8M26 22v-8M34 22v-8" />
      <path d="M8 30v10M40 30v10" />
    </svg>
  )
}

function PergolaIcon() {
  return (
    <svg {...ICON_PROPS} aria-hidden>
      <path d="M8 18 24 9l16 9" />
      <path d="M6 22h36" />
      <path d="M12 22v18M36 22v18" />
      <path d="M18 22v6M24 22v6M30 22v6" />
    </svg>
  )
}

const SERVICES = [
  {
    title: 'Carport & Abris',
    desc: 'Structures autoportées ou adossées pour protéger véhicules, matériel et bois de chauffage, adaptées à votre terrain.',
    Icon: CarportIcon,
  },
  {
    title: 'Terrasse',
    desc: 'Ajout de mètres carrés en bois massif, composite ou exotique à votre espace de vie. De plain-pied ou surélevée avec garde-corps, en fonction de votre projet.',
    Icon: TerrasseIcon,
  },
  {
    title: 'Pergola',
    desc: 'Structure permettant d\'abriter votre terrasse, cuisine d\'été ou salon de jardin, avec tout type de couverture selon vos envies. Terrassement possible sur demande.',
    Icon: PergolaIcon,
  },
]

export function ServicesSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Mes prestations</span>
          <h2 style={{
            fontFamily: "'Oleo Script', cursive",
            fontSize: 'clamp(30px,4.5vw,52px)',
            color: 'var(--jaune)', marginBottom: '16px',
          }}>
            Mon savoir-faire
          </h2>
          <p style={{
            fontFamily: "'Khand', sans-serif",
            fontSize: '20px', color: 'var(--creme)', fontWeight: 300,
            maxWidth: 600, margin: '0 auto', lineHeight: 1.5,
          }}>
            Un savoir-faire artisanal au service de vos projets bois.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
          gap: '24px',
        }}>
          {SERVICES.map(({ title, desc, Icon }) => (
            <div key={title} className="service-card">
              <Icon />
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
