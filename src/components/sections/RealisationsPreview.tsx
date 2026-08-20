import Link from 'next/link'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'

const PLACEHOLDERS = [
  { title: 'Carport',  img: '/images/carport.jpg' },
  { title: 'Pergola',  img: '/images/pergola.jpg' },
  { title: 'Terrasse', img: '/images/terrasse.jpg' },
  { title: 'Et autres, selon vos envies', img: '/images/autres.jpg' },
]

interface Props { realisations: Realisation[] }

export function RealisationsPreview({ realisations }: Props) {
  const cards = realisations.length > 0
    ? realisations.slice(0, 4).map(r => ({
        title: r.title,
        img:   r.thumbUrl || r.imageUrl,
      }))
    : PLACEHOLDERS

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
            <Link key={c.title} href="/realisations" className="card-photo">
              {c.img ? (
                <Image src={c.img} alt={c.title} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div className="card-photo-empty" />
              )}
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
