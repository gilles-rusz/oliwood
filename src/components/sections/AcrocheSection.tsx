import Link from 'next/link'

const POINTS = [
  'Devis gratuit sur mesure',
  '100 % fabriqué en France',
  'Bois sélectionné avec soin',
  'Un seul interlocuteur',
]

export function AcrocheSection() {
  return (
    <section style={{ background: 'var(--creme)', color: 'var(--taupe)', padding: '72px 0 80px', position: 'relative' }}>
      <div className="wrap">
        <div style={{ maxWidth: 660 }}>

          <span style={{
            display: 'inline-block',
            background: 'var(--brun)', color: 'var(--jaune)',
            fontFamily: "'Khand', sans-serif", fontWeight: 700,
            textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '15px',
            padding: '6px 18px', borderRadius: '30px', marginBottom: '22px',
          }}>
            Spécialiste ossature bois
          </span>

          <h2 style={{
            fontFamily: "'Oleo Script', cursive",
            fontSize: 'clamp(36px,6vw,68px)',
            lineHeight: 1.05,
            color: 'var(--brun)',
            marginBottom: '18px',
          }}>
            Donnez vie à vos projets{' '}
            <span style={{ color: 'var(--brun-fonce)' }}>en bois.</span>
          </h2>

          <p style={{
            fontFamily: "'Khand', sans-serif",
            fontSize: '21px', fontWeight: 400,
            maxWidth: 560, marginBottom: '28px',
            lineHeight: 1.45, color: 'var(--taupe)',
          }}>
            Carports, pergolas, terrasses sur mesure. Un savoir-faire artisanal, des matériaux nobles, une réalisation qui vous ressemble.
          </p>

          <ul style={{ marginBottom: '36px', display: 'flex', flexDirection: 'column', gap: '10px', listStyle: 'none' }}>
            {POINTS.map(item => (
              <li key={item} style={{
                fontFamily: "'Khand', sans-serif",
                fontWeight: 500, fontSize: '17px',
                display: 'flex', alignItems: 'center', gap: '10px',
                color: 'var(--brun-fonce)',
              }}>
                <span style={{ color: 'var(--brun)', fontSize: '16px', flexShrink: 0 }}>✦</span>
                {item}
              </li>
            ))}
          </ul>

          <div>
            <Link href="/devis" className="btn-primary-ow">Demander mon devis</Link>
            <Link
              href="/realisations"
              className="btn-ghost-ow"
              style={{ color: 'var(--brun)', borderColor: 'var(--brun)' }}
            >
              Voir nos réalisations
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
