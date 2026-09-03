import Link from 'next/link'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'

interface Props {
  realisations: Realisation[]
}

export function FeaturedRealisations({ realisations }: Props) {
  if (realisations.length === 0) return null

  return (
    <section style={{ padding: '70px 0 10px' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '38px' }}>
          <span className="eyebrow" style={{ color: 'var(--jaune)' }}>À la une</span>
          <h2 style={{
            fontFamily: "'Oleo Script', cursive",
            fontSize: 'clamp(28px,4vw,48px)',
            color: 'var(--jaune)', marginBottom: '12px',
          }}>
            Mes plus belles réalisations
          </h2>
        </div>

        <div className="featured-grid">
          {realisations.map(r => (
            <Link
              key={r.id}
              href={`/realisations?categorie=${r.category}`}
              className="card-photo"
            >
              <Image
                src={r.thumbUrl || r.imageUrl}
                alt={r.title}
                fill
                sizes="(max-width: 640px) 100vw, 33vw"
                style={{ objectFit: 'cover' }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
