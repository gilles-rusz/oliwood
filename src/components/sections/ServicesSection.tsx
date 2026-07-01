const SERVICES = [
  {
    title: 'Ossature bois',
    desc: 'Conception et construction de bâtiments à ossature bois, de l\'étude technique à la pose : structure porteuse, isolation et finitions.',
  },
  {
    title: 'Charpente',
    desc: 'Charpentes traditionnelles ou industrielles, en neuf comme en rénovation : étude, taille et levage assurés par notre équipe.',
  },
  {
    title: 'Carport & Abris',
    desc: 'Structures autoportées ou adossées pour protéger véhicules, matériel et bois de chauffage, adaptées à votre terrain.',
  },
  {
    title: 'Pergola & Terrasse',
    desc: 'Aménagements extérieurs en bois massif — pergolas bioclimatiques, terrasses sur plots ou pilotis — pour prolonger votre espace de vie.',
  },
]

export function ServicesSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Nos prestations</span>
          <h2 style={{
            fontFamily: "'Oleo Script', cursive",
            fontSize: 'clamp(30px,4.5vw,52px)',
            color: 'var(--jaune)', marginBottom: '16px',
          }}>
            Nos savoir-faire
          </h2>
          <p style={{
            fontFamily: "'Khand', sans-serif",
            fontSize: '20px', color: 'var(--creme)', fontWeight: 300,
            maxWidth: 600, margin: '0 auto', lineHeight: 1.5,
          }}>
            Un savoir-faire artisanal au service de vos projets ossature bois.
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
