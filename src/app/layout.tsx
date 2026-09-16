import type { Metadata } from 'next'
import './globals.css'
import { getSiteSettings } from '@/lib/settings'
import { SITE_URL } from '@/lib/siteUrl'

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY

const DEFAULT_DESCRIPTION = 'Spécialistes de la construction en bois sur mesure : charpentes, terrasses, pergolas, cabanes. Artisans passionnés.'

const baseMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'OliWood – Charpenterie & Construction Bois',
    template: '%s | OliWood',
  },
  description: DEFAULT_DESCRIPTION,
  keywords: ['charpente', 'bois', 'terrasse', 'pergola', 'cabane', 'construction bois', 'artisan'],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    siteName: 'OliWood',
    url: SITE_URL,
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        {/* reCAPTCHA v3 */}
        {RECAPTCHA_SITE_KEY && (
          <script
            src={`https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`}
            async
            defer
          />
        )}
      </head>
      <body>{children}</body>
    </html>
  )
}
