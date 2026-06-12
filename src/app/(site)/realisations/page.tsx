import type { Metadata } from 'next'
import { RealisationsGrid } from '@/components/sections/RealisationsGrid'
import { getRealisations } from '@/lib/realisations'

export const metadata: Metadata = {
  title: 'Nos Réalisations',
  description: 'Découvrez nos projets en bois : charpentes, terrasses, pergolas, cabanes. Chaque réalisation est unique.',
}

interface PageProps {
  searchParams: { categorie?: string }
}

export default async function RealisationsPage({ searchParams }: PageProps) {
  const categorie = searchParams.categorie as string | undefined
  const realisations = await getRealisations({ category: categorie, published: true })

  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <p className="section-label mb-4">Nos projets</p>
        <h1 className="section-title mb-4">Réalisations</h1>
        <div className="wood-rule" />
        <p className="text-cream-muted max-w-xl mx-auto text-sm leading-relaxed mt-4">
          Chaque chantier est une histoire unique. Découvrez nos créations en bois,
          de la charpente traditionnelle à la cabane dans les arbres.
        </p>
      </div>

      <RealisationsGrid realisations={realisations} activeCategory={categorie} />
    </div>
  )
}
