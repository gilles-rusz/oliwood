import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'À propos',
  description: 'Découvrez l\'histoire et les valeurs d\'Oli\'Wood, menuiserie artisanale implantée dans le Jura.',
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
          Notre histoire
        </h1>

        <div style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px', fontWeight: 300,
          color: 'var(--creme)',
          lineHeight: 1.7,
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          <p>
            Tout a commencé dans le garage de sa maman, à Phalsbourg. Olivier, seul avec ses outils et sa passion du bois, posait les premières pièces de ce qui allait devenir bien plus qu&apos;une petite entreprise. Pas de grande structure, pas d&apos;investisseurs — juste un artisan déterminé, une scie, et l&apos;envie de bien faire.
          </p>
          <p>
            Au fil des chantiers et des clients conquis, la petite structure a grandi. Olivier a pu quitter le garage familial pour acquérir son propre atelier — un grand espace où il pouvait enfin donner libre cours à ses créations, prendre des projets d&apos;envergure et constituer sa première vraie clientèle.
          </p>
          <p>
            Puis est venu le Jura. Ce déménagement dans les montagnes du 39 marquait une nouvelle étape : c&apos;est ici, à Moirans-en-Montagne, qu&apos;est née Oli&apos;Wood. Une nouvelle identité, un nouveau territoire, mais le même ADN — un artisan passionné, une équipe soudée, zéro sous-traitance, et depuis une quinzaine d&apos;années maintenant, plus de 200 projets réalisés pour des clients qui voulaient du bois bien travaillé, sur-mesure, et pensé pour durer.
          </p>
        </div>

      </div>
    </div>
  )
}
