const SERVICES = [
  {
    ico: '🇫🇷',
    title: '100 % Français',
    desc: 'Une menuiserie implantée dans le Jura, un bois local sélectionné avec soin et un savoir-faire transmis de génération en génération.',
  },
  {
    ico: '🏗️',
    title: 'Terrasse & Pergola',
    desc: 'Espaces extérieurs durables en bois massif, conçus pour s\'harmoniser avec votre environnement.',
  },
  {
    ico: '🏡',
    title: 'Cabane & Abri',
    desc: 'Des créations uniques — cabanes, chalets, studios de jardin et espaces de vie atypiques.',
  },
  {
    ico: '🔨',
    title: 'Rénovation',
    desc: 'Restauration de charpentes anciennes, remplacement de poutres, mise aux normes et consolidation.',
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
            Pourquoi choisir Oli'Wood ?
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
          {SERVICES.map(({ ico, title, desc }) => (
            <div key={title} style={{
              background: 'var(--creme)',
              borderRadius: '16px',
              padding: '34px 28px',
              boxShadow: 'var(--ombre)',
              borderTop: '5px solid var(--jaune)',
              transition: 'transform .25s',
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--brun)', fontSize: 26, marginBottom: 18,
              }}>
                {ico}
              </div>
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
