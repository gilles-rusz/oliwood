import Link from 'next/link'

export function PlankUniSection() {
  return (
    <section style={{ padding: '72px 0' }}>
      <div className="wrap" style={{ textAlign: 'center' }}>
        <span className="eyebrow" style={{ color: 'var(--jaune)' }}>La matière</span>
        <h2 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(28px,4vw,50px)',
          color: 'var(--jaune)',
          marginBottom: '18px',
        }}>
          Le Bois : une matière locale, choisie avec soin
        </h2>
        <p style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px',
          color: 'rgba(255,255,255,.92)',
          fontWeight: 300,
          maxWidth: 620,
          margin: '0 auto',
          lineHeight: 1.55,
        }}>
          Mon bois provient d&apos;une scierie familiale du Doubs, à moins de deux heures de
          l&apos;atelier. Des essences naturelles issues de nos forêts locales, choisies une à une
          pour révéler votre projet.
        </p>

        <div style={{ marginTop: '30px' }}>
          <Link href="/a-propos?volet=bois#volets" className="btn-ghost-ow" style={{ marginLeft: 0 }}>
            En savoir plus
          </Link>
        </div>
      </div>
    </section>
  )
}
