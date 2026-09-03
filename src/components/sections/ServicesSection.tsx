import Link from 'next/link'

const SERVICES = [
  {
    title: 'Carport & Abris',
    desc: 'Structures autoportées ou adossées pour protéger véhicules, matériel ou bois de chauffage, adaptées à votre terrain.',
    href: '/realisations?categorie=CARPORT',
  },
  {
    title: 'Terrasse',
    desc: 'Ajout de mètres carrés en bois massif, composite ou exotique à votre espace de vie. De plain-pied ou surélevée avec garde-corps, en fonction de votre projet.',
    href: '/realisations?categorie=TERRASSE',
  },
  {
    title: 'Pergola',
    desc: 'Structure permettant d\'abriter votre terrasse, cuisine d\'été ou salon de jardin, avec tout type de couverture selon vos envies. Terrassement possible sur demande.',
    href: '/realisations?categorie=PERGOLA',
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
          {SERVICES.map(({ title, desc, href }) => (
            <Link key={title} href={href} className="service-card" style={{ textDecoration: 'none' }}>
              <h3>{title}</h3>
              <p>{desc}</p>
              <span className="service-card-link">Voir les réalisations →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
