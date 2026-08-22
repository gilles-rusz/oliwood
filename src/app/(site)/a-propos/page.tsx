import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Passionné par le bois depuis toujours, je conçois et construis vos projets en ossature bois depuis mon atelier du Jura.',
}

export default function AProposPage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="wrap" style={{ maxWidth: 760 }}>

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
          marginBottom: '32px',
        }}>
          Mon histoire
        </h1>

        <div className="paper-card" style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px', fontWeight: 400,
          color: '#53341a',
          lineHeight: 1.7,
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
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
    </div>
  )
}
