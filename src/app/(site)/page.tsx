import { HeroSection }        from '@/components/sections/HeroSection'
import { ServicesSection }    from '@/components/sections/ServicesSection'
import { PlankUniSection }    from '@/components/sections/PlankUniSection'
import { RealisationsPreview } from '@/components/sections/RealisationsPreview'
import { DevisCtaSection }    from '@/components/sections/DevisCtaSection'
import { getRealisations }    from '@/lib/realisations'

export default async function HomePage() {
  let featured = []
  try {
    featured = await getRealisations({ featured: true, limit: 3 })
  } catch {
    // DB unavailable — placeholders affichés
  }

  return (
    <>
      <HeroSection />
      <ServicesSection />
      <PlankUniSection />
      <RealisationsPreview realisations={featured} />
      <DevisCtaSection />
    </>
  )
}
