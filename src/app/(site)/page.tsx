import { HeroSection }        from '@/components/sections/HeroSection'
import { ServicesSection }    from '@/components/sections/ServicesSection'
import { PlankUniSection }    from '@/components/sections/PlankUniSection'
import { RealisationsPreview } from '@/components/sections/RealisationsPreview'
import { DevisCtaSection }    from '@/components/sections/DevisCtaSection'
import { getRealisations }    from '@/lib/realisations'
import { getSiteSettings }    from '@/lib/settings'
import type { Realisation }   from '@prisma/client'

export default async function HomePage() {
  let featured: Realisation[] = []
  try {
    featured = await getRealisations({ featured: true, limit: 3 })
  } catch {
    // DB unavailable — placeholders affichés
  }

  const settings = await getSiteSettings()
  const noel = Boolean(settings?.seasonalActive && settings.seasonalTheme === 'NOEL')

  return (
    <>
      <HeroSection noel={noel} />
      <ServicesSection />
      <PlankUniSection />
      <RealisationsPreview realisations={featured} />
      <DevisCtaSection />
    </>
  )
}
