import Link from 'next/link'

export function DevisCtaSection() {
  return (
    <section style={{
      color: 'var(--creme)',
      textAlign: 'center',
      padding: '100px 24px',
    }}>
      <div className="wrap">
        <h2 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(48px,7vw,88px)',
          color: 'var(--jaune)',
          marginBottom: '24px',
          lineHeight: 1.1,
        }}>
          Donnez vie à vos projets.
        </h2>
        <p style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px', fontWeight: 300,
          maxWidth: 560, margin: '0 auto 34px',
          lineHeight: 1.55, color: 'var(--creme)',
        }}>
          Décrivez-nous votre projet en quelques clics et recevez un devis personnalisé et gratuit.
        </p>
        <Link href="/devis" className="btn-primary-ow">Démarrer mon devis</Link>
      </div>
    </section>
  )
}
