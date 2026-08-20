const SERVICES = [
  {
    title: 'Carport & Abris',
    desc: 'Structures autoportées ou adossées pour protéger véhicules, matériel et bois de chauffage, adaptées à votre terrain.',
  },
  {
    title: 'Terrasse',
    desc: 'Ajout de mètres carrés en bois massif, composite ou exotique à votre espace de vie. De plain-pied ou surélevée avec garde-corps, en fonction de votre projet.',
  },
  {
    title: 'Pergola',
    desc: 'Structure permettant d\'abriter votre terrasse, cuisine d\'été ou salon de jardin, avec tout type de couverture selon vos envies. Terrassement possible sur demande.',
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
          {SERVICES.map(({ title, desc }) => (
            <div key={title} style={{
              background: 'var(--creme)',
              borderRadius: '16px',
              padding: '34px 28px',
              boxShadow: 'var(--ombre)',
              borderTop: '5px solid var(--jaune)',
              transition: 'transform .25s',
            }}>
              <h3 style={{
                fontFamily: "'Oleo Script', cursive",
                fontSize: '24px', color: 'var(--brun)', marginBottom: '10px',
              }}>
                {title}
              </h3>
              <p style={{
                fontFamily: "'Khand', sans-serif",
                fontSize: '16px', fontWeight: 300, color: 'var(--taupe)', lineHeight: 1.5,
              }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
