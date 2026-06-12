import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité',
  description: 'Politique de confidentialité et traitement des données personnelles — Oli\'Wood.',
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

function Li({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '6px' }}>
      <span style={{ color: 'var(--brun)', flexShrink: 0, marginTop: '2px' }}>✦</span>
      <span>{children}</span>
    </li>
  )
}

export default function PolitiqueConfidentialitePage() {
  return (
    <div style={{ minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="wrap" style={{ maxWidth: 800 }}>

        <span style={{
          fontFamily: "'Khand', sans-serif", fontWeight: 600,
          textTransform: 'uppercase', letterSpacing: '3px', fontSize: '14px',
          color: 'var(--jaune)', marginBottom: '16px', display: 'block',
        }}>
          RGPD &amp; Vie privée
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(28px, 4.5vw, 52px)',
          color: 'var(--jaune)', lineHeight: 1.1, marginBottom: '40px',
        }}>
          Politique de confidentialité
        </h1>

        {/* Card crème */}
        <div style={{
          background: 'var(--creme)', borderRadius: '16px',
          padding: 'clamp(28px, 5vw, 52px)',
          boxShadow: '0 12px 40px rgba(0,0,0,.18)',
        }}>

          <p style={{
            fontFamily: "'Khand', sans-serif", fontSize: '17px',
            fontWeight: 300, color: 'var(--taupe)', lineHeight: 1.7,
            marginBottom: '32px',
          }}>
            La présente politique de confidentialité décrit la manière dont Oli&apos;Wood collecte,
            utilise et protège les données personnelles recueillies via ce site, conformément
            au Règlement Général sur la Protection des Données (RGPD — UE 2016/679).
          </p>

          <Section title="Données collectées">
            <p>Les données collectées via le formulaire de devis / contact sont :</p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              <Li>Nom et prénom</Li>
              <Li>Adresse e-mail</Li>
              <Li>Numéro de téléphone</Li>
              <Li>Description du projet (type, localisation, budget indicatif)</Li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              Aucune donnée bancaire n&apos;est collectée. Les données ne sont jamais vendues
              à des tiers.
            </p>
          </Section>

          <Section title="Finalité du traitement">
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <Li>Répondre aux demandes de devis et aux questions envoyées via le formulaire de contact</Li>
              <Li>Établir et envoyer des devis personnalisés</Li>
              <Li>Assurer le suivi commercial des projets</Li>
            </ul>
            <p style={{ marginTop: '10px' }}>
              La base légale du traitement est l&apos;intérêt légitime (art. 6.1.f RGPD) et,
              le cas échéant, l&apos;exécution d&apos;un contrat (art. 6.1.b RGPD).
            </p>
          </Section>

          <Section title="Durée de conservation">
            <p>
              Les données collectées sont conservées pendant une durée maximale de
              <strong> 3 ans</strong> à compter du dernier contact, conformément aux recommandations
              de la CNIL. Au-delà, elles sont supprimées ou anonymisées.
            </p>
          </Section>

          <Section title="Vos droits">
            <p>Conformément au RGPD, vous disposez des droits suivants :</p>
            <ul style={{ listStyle: 'none', padding: 0, marginTop: '10px' }}>
              <Li><strong>Droit d&apos;accès</strong> — obtenir une copie des données vous concernant</Li>
              <Li><strong>Droit de rectification</strong> — corriger des données inexactes ou incomplètes</Li>
              <Li><strong>Droit à l&apos;effacement</strong> — demander la suppression de vos données</Li>
              <Li><strong>Droit d&apos;opposition</strong> — vous opposer à un traitement basé sur l&apos;intérêt légitime</Li>
              <Li><strong>Droit à la portabilité</strong> — récupérer vos données dans un format structuré</Li>
            </ul>
            <p style={{ marginTop: '12px' }}>
              Pour exercer ces droits, contactez-nous à : <strong>contact@oliwood.fr</strong>.
              En cas de litige, vous pouvez saisir la <strong>CNIL</strong> (cnil.fr).
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              Ce site peut utiliser des cookies techniques nécessaires à son fonctionnement
              (session, sécurité). Aucun cookie publicitaire ou de tracking tiers n&apos;est déposé
              sans votre consentement explicite.
            </p>
            <p style={{ marginTop: '8px' }}>
              Vous pouvez configurer votre navigateur pour refuser les cookies ou être averti
              avant leur dépôt. Cela peut affecter certaines fonctionnalités du site.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Responsable du traitement : Oli&apos;Wood — [À COMPLÉTER : adresse] — Jura (39), France
              <br />
              E-mail : contact@oliwood.fr
            </p>
          </Section>

        </div>
      </div>
    </div>
  )
}
