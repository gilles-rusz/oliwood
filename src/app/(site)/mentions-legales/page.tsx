import type { Metadata } from 'next'
import {
  getContactInfos,
  RAISON_SOCIALE, FORME_JURIDIQUE, CAPITAL_SOCIAL, SIREN, SIRET, RCS, TVA, DIRECTEUR,
} from '@/lib/contact'

export const metadata: Metadata = {
  title: 'Mentions légales',
  description: 'Mentions légales du site Oli\'Wood.',
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{
        fontFamily: "'Khand', sans-serif",
        fontWeight: 700, fontSize: '20px',
        textTransform: 'uppercase', letterSpacing: '2px',
        color: 'var(--brun)', marginBottom: '12px',
        borderBottom: '2px solid var(--jaune)', paddingBottom: '6px',
        display: 'inline-block',
      }}>
        {title}
      </h2>
      <div style={{
        fontFamily: "'Khand', sans-serif",
        fontSize: '17px', fontWeight: 300,
        color: 'var(--taupe)', lineHeight: 1.7,
      }}>
        {children}
      </div>
    </div>
  )
}

export default async function MentionsLegalesPage() {
  const { adresse, telephone, email } = await getContactInfos()

  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="wrap" style={{ maxWidth: 800 }}>

        <span style={{
          fontFamily: "'Khand', sans-serif", fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '3px', fontSize: '14px',
          color: 'var(--jaune)', marginBottom: '16px', display: 'block',
        }}>
          Informations légales
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(34px, 5vw, 58px)',
          color: 'var(--jaune)', lineHeight: 1.1, marginBottom: '40px',
        }}>
          Mentions légales
        </h1>

        {/* Card crème */}
        <div style={{
          background: 'var(--creme)', borderRadius: '16px',
          padding: 'clamp(28px, 5vw, 52px)',
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        }}>

          <Section title="Éditeur du site">
            <p><strong>Raison sociale :</strong> {RAISON_SOCIALE}</p>
            <p><strong>Forme juridique :</strong> {FORME_JURIDIQUE}</p>
            <p><strong>Capital social :</strong> {CAPITAL_SOCIAL}</p>
            <p><strong>SIREN :</strong> {SIREN}</p>
            <p><strong>SIRET (siège) :</strong> {SIRET}</p>
            <p><strong>RCS :</strong> {RCS}</p>
            <p><strong>N° de TVA intracommunautaire :</strong> {TVA}</p>
            <p><strong>Adresse du siège social :</strong> {adresse} — France</p>
            <p><strong>Téléphone :</strong>{' '}
              <a href={`tel:${telephone.replace(/[^+\d]/g, '')}`} style={{ color: 'var(--brun)' }}>{telephone}</a>
            </p>
            <p><strong>E-mail :</strong>{' '}
              <a href={`mailto:${email}`} style={{ color: 'var(--brun)' }}>{email}</a>
            </p>
            <p><strong>Directeur de la publication :</strong> {DIRECTEUR}</p>
          </Section>

          <Section title="Hébergement">
            <p><strong>Hébergeur :</strong> Vercel Inc.</p>
            <p><strong>Adresse :</strong> 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis</p>
            <p><strong>Site web :</strong>{' '}
              <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brun)' }}>vercel.com</a>
            </p>
          </Section>

          <Section title="Propriété intellectuelle">
            <p>
              L&apos;ensemble du contenu de ce site (textes, images, logos, graphismes) est la propriété
              exclusive d&apos;Oli&apos;Wood ou de ses partenaires, et est protégé par les lois françaises et
              internationales relatives à la propriété intellectuelle.
            </p>
            <p style={{ marginTop: '8px' }}>
              Toute reproduction, représentation, modification ou exploitation du contenu de ce site,
              même partielle, sans autorisation écrite préalable est interdite et constituerait une
              contrefaçon sanctionnée par les articles L.335-2 et suivants du Code de la propriété
              intellectuelle.
            </p>
          </Section>

          <Section title="Crédits">
            <p><strong>Conception &amp; développement :</strong>{' '}
              <a href="https://webrgest.fr" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--brun)' }}>Web RG Est</a>
            </p>
            <p><strong>Photographies :</strong> Oli&apos;Wood</p>
          </Section>

          <Section title="Responsabilité">
            <p>
              Oli&apos;Wood s&apos;efforce d&apos;assurer l&apos;exactitude et la mise à jour des informations publiées
              sur ce site. Toutefois, la responsabilité du site ne peut être engagée en cas d&apos;inexactitude
              ou d&apos;omission dans les informations diffusées, ni en cas d&apos;utilisation frauduleuse ou
              abusive par un tiers de ces informations.
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}
