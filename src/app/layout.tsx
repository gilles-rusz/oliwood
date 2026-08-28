import type { Metadata } from 'next'
import './globals.css'
import { SeasonalDecorations } from '@/components/ui/SeasonalDecorations'
import { getSiteSettings } from '@/lib/settings'

const DEFAULT_DESCRIPTION = 'Spécialistes de la construction en bois sur mesure : charpentes, terrasses, pergolas, cabanes. Artisans passionnés.'

const baseMetadata: Metadata = {
  title: {
    default: 'OliWood – Charpenterie & Construction Bois',
    template: '%s | OliWood',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ['charpente', 'bois', 'terrasse', 'pergola', 'cabane', 'construction bois', 'artisan'],
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OliWood',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  return {
    ...baseMetadata,
    description: settings?.metaDescription || DEFAULT_DESCRIPTION,
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const settings = await getSiteSettings()

  return (
    <html lang="fr">
      <head>
        {/* reCAPTCHA v3 */}
        <script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          async
          defer
        />
      </head>
      <body>
        {/* Décorations saisonnières (Noël, etc.) */}
        {settings?.seasonalActive && settings.seasonalTheme && (
          <SeasonalDecorations theme={settings.seasonalTheme} />
        )}
        {children}
      </body>
    </html>
  )
}
