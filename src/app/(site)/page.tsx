import { HeroSection }        from '@/components/sections/HeroSection'
import { ServicesSection }    from '@/components/sections/ServicesSection'
import { PlankUniSection }    from '@/components/sections/PlankUniSection'
import { RealisationsPreview } from '@/components/sections/RealisationsPreview'
import { FeaturedRealisations } from '@/components/sections/FeaturedRealisations'
import { DevisCtaSection }    from '@/components/sections/DevisCtaSection'
import { getSiteSettings }    from '@/lib/settings'
import { getRealisations } from '@/lib/realisations'
import { MAX_FEATURED } from '@/lib/gallery'

export default async function HomePage() {
  const settings = await getSiteSettings()
  const featured = await getRealisations({
    featured: true,
    published: true,
    limit: MAX_FEATURED,
  })
  const noel = Boolean(settings?.seasonalActive && settings.seasonalTheme === 'NOEL')

  return (
    <>
      <HeroSection noel={noel} title={settings?.heroTitle} subtitle={settings?.heroSubtitle} />
      <ServicesSection />
      <PlankUniSection />
      <FeaturedRealisations realisations={featured} />
      <RealisationsPreview />
      <DevisCtaSection />
    </>
  )
}
