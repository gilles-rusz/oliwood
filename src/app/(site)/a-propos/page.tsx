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
          Notre histoire
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(36px, 6vw, 68px)',
          color: 'var(--jaune)',
          lineHeight: 1.1,
          marginBottom: '32px',
        }}>
          À propos d&apos;Oli&apos;Wood
        </h1>

        <div style={{
          fontFamily: "'Khand', sans-serif",
          fontSize: '20px', fontWeight: 300,
          color: 'var(--creme)',
          lineHeight: 1.7,
          display: 'flex', flexDirection: 'column', gap: '20px',
        }}>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
            fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </p>
          <p>
            Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit
            amet, ante. Donec eu libero sit amet quam egestas semper.
          </p>
        </div>

      </div>
    </div>
  )
}
