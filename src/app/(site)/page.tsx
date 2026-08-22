import { HeroSection }        from '@/components/sections/HeroSection'
import { ServicesSection }    from '@/components/sections/ServicesSection'
import { PlankUniSection }    from '@/components/sections/PlankUniSection'
import { RealisationsPreview } from '@/components/sections/RealisationsPreview'
import { DevisCtaSection }    from '@/components/sections/DevisCtaSection'
import { getSiteSettings }    from '@/lib/settings'

export default async function HomePage() {
  const settings = await getSiteSettings()
  const noel = Boolean(settings?.seasonalActive && settings.seasonalTheme === 'NOEL')

  return (
    <>
      <HeroSection noel={noel} />
      <ServicesSection />
      <PlankUniSection />
      <RealisationsPreview />
      <DevisCtaSection />
    </>
  )
}
