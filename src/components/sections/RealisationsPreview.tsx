import Link from 'next/link'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'

const PLACEHOLDERS = [
  { tag: 'Carport',  title: 'Carport bois massif',    desc: '', img: '/images/carport.jpg' },
  { tag: 'Pergola',  title: 'Pergola bioclimatique',  desc: '', img: '/images/pergola.jpg' },
  { tag: 'Terrasse', title: 'Terrasse sur pilotis',   desc: '', img: '/images/terrasse.jpg' },
]

interface Props { realisations: Realisation[] }

export function RealisationsPreview({ realisations }: Props) {
  const cards = realisations.length > 0
    ? realisations.slice(0, 3).map(r => ({
        tag:   r.category ?? '',
        title: r.title,
        desc:  '',
        img:   r.thumbUrl || r.imageUrl,
      }))
    : PLACEHOLDERS

  return (
    <section style={{ background: 'transparent', padding: '80px 0' }}>
      <div className="wrap">
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="eyebrow" style={{ color: 'var(--jaune)' }}>Nos derniers chantiers</span>
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
            Un aperçu de nos projets ossature bois.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(290px, 100%), 1fr))',
          gap: '24px',
        }}>
          {cards.map(c => (
            <Link key={c.title} href="/realisations" style={{
              display: 'block', borderRadius: '16px', overflow: 'hidden',
              background: '#fff', textDecoration: 'none',
              border: '3px solid var(--brun)',
              boxShadow: 'var(--ombre)',
              transition: 'transform .25s, box-shadow .25s',
            }}>
              {/* Photo */}
              <div style={{ height: 220, background: 'var(--brun)', position: 'relative', overflow: 'hidden' }}>
                {c.img ? (
                  <Image src={c.img} alt={c.title} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div style={{
                    height: '100%', display: 'grid', placeItems: 'center',
                    backgroundImage: 'repeating-linear-gradient(45deg,rgba(255,255,255,.04) 0 4px,transparent 4px 20px)',
                  }}>
                    <span style={{
                      fontFamily: "'Khand', sans-serif",
                      color: 'rgba(255,255,255,.5)',
                      textTransform: 'uppercase', letterSpacing: 2, fontSize: 13,
                      background: 'rgba(0,0,0,.3)', padding: '5px 14px', borderRadius: 20,
                    }}>
                      Photo {c.tag.toLowerCase()}
                    </span>
                  </div>
                )}
              </div>

              {/* Méta */}
              <div style={{ padding: '18px 22px', borderTop: '3px solid var(--jaune)' }}>
                <span style={{
                  display: 'inline-block',
                  background: 'var(--jaune)', color: 'var(--brun-fonce)',
                  fontFamily: "'Khand', sans-serif",
                  fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
                  letterSpacing: 1, padding: '3px 12px', borderRadius: 20, marginBottom: 10,
                }}>
                  {c.tag}
                </span>
                <h3 style={{ fontFamily: "'Oleo Script', cursive", fontSize: '22px', color: 'var(--brun)', marginBottom: 6 }}>
                  {c.title}
                </h3>
                {c.desc && (
                  <p style={{ fontFamily: "'Khand', sans-serif", fontSize: 15, fontWeight: 300, color: 'var(--taupe)' }}>
                    {c.desc}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '44px' }}>
          <Link href="/realisations" className="btn-primary-ow">Toutes nos réalisations</Link>
        </div>
      </div>
    </section>
  )
}
