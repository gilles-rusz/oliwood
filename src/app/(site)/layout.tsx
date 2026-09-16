import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { SeasonalDecorations } from '@/components/ui/SeasonalDecorations'
import { getSiteSettings } from '@/lib/settings'
import { SITE_URL } from '@/lib/siteUrl'

// Les réglages du site (thème saisonnier, textes, coordonnées) sont lus en base.
// Les pages publiques se régénèrent au maximum toutes les 60 s pour qu'un
// changement fait depuis l'admin apparaisse même si l'invalidation immédiate
// déclenchée par /api/admin/settings n'aboutit pas.
export const revalidate = 60

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  // Données structurées : permettent à Google d'afficher l'entreprise, ses
  // coordonnées et le bon site web dans les résultats de recherche.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'OliWood',
    description: settings?.metaDescription || undefined,
    url: SITE_URL,
    image: `${SITE_URL}/images/hero.jpg`,
    telephone: settings?.telephone || undefined,
    email: settings?.email || undefined,
    address: settings?.adresse
      ? { '@type': 'PostalAddress', streetAddress: settings.adresse, addressCountry: 'FR' }
      : undefined,
    areaServed: 'Jura, France',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {settings?.seasonalActive && settings.seasonalTheme && (
        <SeasonalDecorations theme={settings.seasonalTheme} />
      )}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
