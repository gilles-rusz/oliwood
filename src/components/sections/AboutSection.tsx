import Image from 'next/image'

const STATS = [
  { value: '15 ans', label: "d'expérience" },
  { value: '200+', label: 'chantiers réalisés' },
  { value: '100%', label: 'sur-mesure' },
]

export function AboutSection() {
  return (
    <section style={{ padding: '80px 0' }}>
      <div className="wrap">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '52px',
          alignItems: 'center',
        }}>
          {/* Photo */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            aspectRatio: '4 / 5',
            boxShadow: 'var(--ombre)',
            border: '3px solid var(--brun)',
          }}>
            <Image src="/images/about.jpg" alt="L'équipe Oli'Wood au travail à Moirans-en-Montagne" fill style={{ objectFit: 'cover' }} />
            <span style={{
              position: 'absolute', top: 18, left: 18,
              background: 'var(--jaune)', color: 'var(--brun-fonce)',
              fontFamily: "'Khand', sans-serif",
              fontWeight: 600, fontSize: 13, textTransform: 'uppercase',
              letterSpacing: 1, padding: '6px 14px', borderRadius: 20,
            }}>
              Jura · 39 / Moirans-en-Montagne
            </span>
          </div>

          {/* Texte */}
          <div>
            <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Qui sommes-nous</span>
            <h2 style={{
              fontFamily: "'Oleo Script', cursive",
              fontSize: 'clamp(30px,4.5vw,52px)',
              color: 'var(--jaune)', marginBottom: '22px',
            }}>
              Une entreprise familiale, un savoir-faire artisanal.
            </h2>

            <div style={{
              fontFamily: "'Khand', sans-serif",
              fontSize: '17px', fontWeight: 300, color: 'var(--creme)',
              lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '14px',
              marginBottom: '36px',
            }}>
              <p>
                Oli&apos;Wood est une entreprise familiale installée à Moirans-en-Montagne, au cœur du Jura. Nous mettons un point d&apos;honneur à connaître chacun de nos clients et à suivre leur projet du premier échange jusqu&apos;à la pose finale.
              </p>
              <p>
                Toutes nos structures sont étudiées et fabriquées par notre propre équipe, sans sous-traitance. Cette maîtrise complète du chantier nous permet de garantir la qualité de chaque assemblage et de rester réactifs face aux imprévus du terrain.
              </p>
              <p>
                Chaque projet est unique : nous prenons le temps d&apos;étudier vos contraintes, votre terrain et vos envies pour concevoir une structure bois sur mesure, pensée pour durer.
              </p>
            </div>

            {/* Stats */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
              gap: '18px',
            }}>
              {STATS.map(({ value, label }) => (
                <div key={label} style={{ textAlign: 'center' }}>
                  <div style={{
                    fontFamily: "'Oleo Script', cursive",
                    fontSize: 'clamp(26px, 3.5vw, 36px)',
                    color: 'var(--jaune)', lineHeight: 1,
                  }}>
                    {value}
                  </div>
                  <div style={{
                    fontFamily: "'Khand', sans-serif",
                    fontSize: '14px', fontWeight: 300,
                    color: 'rgba(255,255,255,.92)',
                    textTransform: 'uppercase', letterSpacing: '.5px',
                    marginTop: '4px',
                  }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
