import Link from 'next/link'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background: 'var(--brun-fonce)', color: 'var(--gris-clair)', padding: '60px 0 26px' }}>
      <div className="wrap">

        {/* ── 4-column grid ── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '34px',
          marginBottom: '40px',
        }}>

          {/* Brand */}
          <div>
            <div style={{ fontFamily: "'Oleo Script', cursive", fontSize: '30px', color: 'var(--jaune)', marginBottom: '12px', lineHeight: 1 }}>
              Oli'Wood
            </div>
            <p style={{ fontFamily: "'Khand', sans-serif", fontWeight: 300, fontSize: '16px', lineHeight: 1.6, color: 'var(--gris-clair)', maxWidth: 240 }}>
              Votre spécialiste ossature bois. Carports, pergolas, terrasses et structures sur mesure, fabriqués en France.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 style={{ fontFamily: "'Khand', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--jaune)', fontSize: '17px', marginBottom: '16px' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { href: '/',             label: 'Accueil' },
                { href: '/realisations', label: 'Réalisations' },
                { href: '/a-propos',     label: 'À propos' },
                { href: '/devis',        label: 'Devis gratuit' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ fontFamily: "'Khand', sans-serif", fontWeight: 300, fontSize: '16px', color: 'var(--gris-clair)', textDecoration: 'none', transition: 'color .2s' }}
                    className="hover:text-yellow-300">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Prestations */}
          <div>
            <h4 style={{ fontFamily: "'Khand', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--jaune)', fontSize: '17px', marginBottom: '16px' }}>
              Prestations
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {['Carports', 'Pergolas', 'Terrasses', 'Ossature bois'].map(item => (
                <li key={item} style={{ fontFamily: "'Khand', sans-serif", fontWeight: 300, fontSize: '16px', color: 'var(--gris-clair)' }}>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontFamily: "'Khand', sans-serif", fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--jaune)', fontSize: '17px', marginBottom: '16px' }}>
              Contact
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: '📍 9 Rue du Tongea, 39260 Moirans-en-Montagne' },
                { label: '📞 00 00 00 00 00' },
                { label: '✉ contact@oliwood.fr' },
                { label: '🕐 Lun–Sam, 8h–19h' },
                { label: '📘 Facebook', href: 'https://www.facebook.com/OliWood.OssatureBois' },
              ].map(({ label, href }) => (
                <li key={label} style={{ fontFamily: "'Khand', sans-serif", fontWeight: 300, fontSize: '16px', color: 'var(--gris-clair)' }}>
                  {href ? (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--gris-clair)', textDecoration: 'none' }}
                      className="hover:text-yellow-300"
                    >
                      {label}
                    </a>
                  ) : label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div style={{
          borderTop: '1px solid rgba(255,224,20,.12)',
          paddingTop: '20px',
          display: 'flex', flexWrap: 'wrap',
          alignItems: 'center', justifyContent: 'space-between', gap: '12px',
        }}>
          <span style={{ fontFamily: "'Khand', sans-serif", fontSize: '14px', color: 'rgba(216,207,200,.5)' }}>
            © {year} Oli'Wood — SARL au RCS 883 952 681. Tous droits réservés.
          </span>
          <span style={{ display: 'flex', gap: '20px' }}>
            {[
              { label: 'Mentions légales',            href: '/mentions-legales' },
              { label: 'Politique de confidentialité', href: '/politique-confidentialite' },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{ fontFamily: "'Khand', sans-serif", fontSize: '14px', color: 'rgba(216,207,200,.5)', textDecoration: 'none' }}>
                {label}
              </Link>
            ))}
          </span>
        </div>

        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <Link
            href="/admin/login"
            style={{ fontFamily: "'Khand', sans-serif", fontSize: '11px', color: 'rgba(216,207,200,.22)', textDecoration: 'none' }}
          >
            Espace admin
          </Link>
        </div>
      </div>
    </footer>
  )
}
