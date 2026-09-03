import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Passionné par le bois depuis toujours, je conçois et construis vos projets en ossature bois depuis mon atelier du Jura, avec un bois local choisi avec soin.',
}

const VOLETS = [
  { key: 'histoire', label: 'Mon histoire' },
  { key: 'bois',     label: 'Le bois' },
] as const

interface PageProps {
  searchParams: { volet?: string }
}

export default function AProposPage({ searchParams }: PageProps) {
  const volet = searchParams.volet === 'bois' ? 'bois' : 'histoire'

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="wrap" style={{ maxWidth: 960 }}>

        <span style={{
          display: 'inline-block',
          fontFamily: "'Khand', sans-serif", fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '3px', fontSize: '14px',
          color: 'var(--jaune)', marginBottom: '16px',
        }}>
          L&apos;aventure Oli&apos;Wood
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(32px, 5.5vw, 58px)',
          color: 'var(--jaune)',
          lineHeight: 1.15,
          marginBottom: '28px',
        }}>
          {volet === 'bois' ? 'Le bois, choisi avec soin' : 'Mon histoire'}
        </h1>

        <div id="volets" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '28px', scrollMarginTop: '110px' }}>
          {VOLETS.map(({ key, label }) => {
            const active = key === volet
            return (
              <Link
                key={key}
                href={key === 'histoire' ? '/a-propos#volets' : `/a-propos?volet=${key}#volets`}
                style={{
                  fontFamily: "'Khand', sans-serif", fontWeight: 600, fontSize: '17px',
                  textTransform: 'uppercase', letterSpacing: '1.5px',
                  padding: '9px 22px', borderRadius: '6px', textDecoration: 'none',
                  border: '2px solid var(--jaune)',
                  background: active ? 'var(--jaune)' : 'transparent',
                  color: active ? 'var(--brun-fonce)' : 'var(--creme)',
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

        <div className="paper-card" style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px', fontWeight: 400,
          color: '#53341a',
          lineHeight: 1.7,
        }}>
          {volet === 'histoire' ? (
            <div className="about-histoire">
              <div className="about-portrait">
                <Image
                  src="/images/olivier.jpg"
                  alt="Olivier, artisan menuisier et fondateur d'Oli'Wood"
                  width={900}
                  height={1200}
                  sizes="(max-width: 640px) 45vw, 260px"
                  style={{
                    width: '100%', height: 'auto', display: 'block',
                    borderRadius: '10px',
                    border: '4px solid #4a2c14',
                    boxShadow: '0 12px 24px rgba(0,0,0,.32)',
                  }}
                />
                <p style={{ fontSize: '15px', textAlign: 'center', marginTop: '8px', opacity: .75 }}>
                  Olivier, dans son atelier du Jura
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p>
                  Passionné par le bois depuis mon plus jeune âge, c&apos;est avec mes premiers ciseaux à bois que j&apos;ai commencé à donner vie à mes premières créations, directement dans la cave de mes parents. Après l&apos;obtention de mes diplômes, je choisis naturellement de faire de cette passion mon métier. En 2011, je me lance comme artisan indépendant et développe mon activité autour de la menuiserie et de l&apos;agencement intérieur.
                </p>
                <p>
                  Au fil des années, l&apos;entreprise grandit et les projets se diversifient : aménagements sur mesure, pergolas, kiosques… Ces réalisations me permettent de renouer avec ce qui m&apos;anime depuis toujours : la conception et la construction de structures en ossature bois.
                </p>
                <p>
                  C&apos;est ainsi qu&apos;en 2020 naît Oli&apos;Wood. Un nouveau nom, un nouveau statut et surtout une volonté affirmée de recentrer mon savoir-faire sur mon cœur de métier : l&apos;ossature bois et les constructions extérieures.
                </p>
                <p>
                  Fort de plus de 20 ans d&apos;expérience dans le travail du bois, je mets aujourd&apos;hui cette expertise au service de projets durables, fonctionnels et pensés sur mesure. Chaque réalisation est l&apos;occasion d&apos;allier la précision du travail artisanal, la connaissance des matériaux et une véritable passion pour le bois.
                </p>
                <p>
                  Installé au cœur du Jura, je travaille aujourd&apos;hui depuis un grand atelier que j&apos;ai moi-même conçu et construit. Un lieu à mon image : authentique, exigeant et entièrement dédié au bois.
                </p>
                <p>
                  Oli&apos;Wood, c&apos;est avant tout l&apos;histoire d&apos;un artisan qui a fait de sa passion d&apos;enfance un véritable savoir-faire, au service de l&apos;ossature bois.
                </p>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <p>
                Le bois est au cœur de mon travail. Il provient d&apos;une scierie familiale située dans le Doubs, à moins de deux heures de mon atelier.
              </p>
              <p>
                Attaché à l&apos;origine et à la qualité des matériaux, je privilégie les essences naturelles issues de nos forêts locales. Chaque bois est choisi avec attention, en fonction de sa durabilité, de ses propriétés et de la singularité de son veinage, afin de trouver celui qui saura le mieux révéler votre projet.
              </p>
              <p>
                Dans mon atelier, chaque pièce est ensuite façonnée avec soin et précision, en respectant au maximum les caractéristiques naturelles de la matière. Le bois n&apos;est pas simplement un matériau : ses nuances, ses textures et ses imperfections participent pleinement à l&apos;identité de chaque création.
              </p>
              <p>
                Cette attention se prolonge jusqu&apos;aux moindres résidus de fabrication. Dans une démarche de valorisation de la matière, les copeaux et chutes issus du rabotage sont collectés puis réutilisés par une ferme locale comme litière et paillage.
              </p>
              <p>
                De la forêt à l&apos;atelier, puis de l&apos;atelier à la ferme, chaque étape est pensée pour préserver la matière, favoriser les circuits courts et donner au bois une seconde vie.
              </p>
            </div>
          )}
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/realisations" className="btn-primary-ow">Mes réalisations</Link>
        </div>

      </div>
    </div>
  )
}
