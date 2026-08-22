import Link from 'next/link'
import Image from 'next/image'

interface Card {
  title: string
  img: string
  href: string
  position?: string
}

const CARDS: Card[] = [
  { title: 'Carport',  img: '/images/carport.jpg',  href: '/realisations?categorie=CARPORT' },
  { title: 'Pergola',  img: '/images/pergola.jpg',  href: '/realisations?categorie=PERGOLA' },
  { title: 'Terrasse', img: '/images/terrasse.jpg', href: '/realisations?categorie=TERRASSE' },
  { title: 'Et autres, selon vos envies', img: '/images/autres.jpg', href: '/realisations?categorie=AUTRE', position: '14% center' },
]

export function RealisationsPreview() {
  const cards = CARDS

  return (
    <section style={{ background: 'transparent', padding: '80px 0' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Mes derniers chantiers</span>
          <h2 style={{
            fontFamily: "'Oleo Script', cursive",
            fontSize: 'clamp(30px,4.5vw,52px)',
            color: 'var(--jaune)', marginBottom: '14px',
          }}>
            Quelques réalisations
          </h2>
          <p style={{
            fontFamily: "'Khand', sans-serif",
            fontSize: '19px', color: 'rgba(255,255,255,.92)', fontWeight: 300,
          }}>
            Un aperçu de mes projets bois.
          </p>
        </div>

        <div className="cards-2x2">
          {cards.map(c => (
            <Link key={c.title} href={c.href} className="card-photo">
              <Image
                src={c.img}
                alt={c.title}
                fill
                style={{ objectFit: 'cover', objectPosition: c.position ?? 'center' }}
              />
              <div className="card-photo-meta">
                <h3>{c.title}</h3>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/realisations" className="btn-primary-ow">Toutes mes réalisations</Link>
        </div>
      </div>
    </section>
  )
}
