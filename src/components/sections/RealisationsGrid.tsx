'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'
import { clsx } from 'clsx'

const CATEGORIES = [
  { value: undefined,  label: 'Tous' },
  { value: 'CARPORT',  label: 'Carport & Abris' },
  { value: 'TERRASSE', label: 'Terrasse' },
  { value: 'PERGOLA',  label: 'Pergola' },
  { value: 'AUTRE',    label: 'Autres' },
]

function categoryLabel(value: string) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value
}

interface Props {
  realisations: Realisation[]
  activeCategory?: string
}

export function RealisationsGrid({ realisations, activeCategory }: Props) {
  const router       = useRouter()
  const searchParams = useSearchParams()

  function filterBy(cat?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('categorie', cat)
    else params.delete('categorie')
    router.push(`/realisations?${params.toString()}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {CATEGORIES.map(({ value, label }) => (
          <button
            key={label}
            onClick={() => filterBy(value)}
            className={clsx(
              'px-4 py-1.5 text-xs tracking-widest uppercase border transition-colors duration-200',
              activeCategory === value || (!activeCategory && !value)
                ? 'border-wood-400 text-wood-400 bg-wood-400/10'
                : 'border-cream/20 text-cream/50 hover:border-cream/40 hover:text-cream/70'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Grille masonry-like */}
      {realisations.length === 0 ? (
        <p className="text-center text-cream/40 py-20">Aucune réalisation dans cette catégorie pour l&apos;instant.</p>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-2 space-y-2">
          {realisations.map((r) => (
            <div
              key={r.id}
              className="break-inside-avoid relative overflow-hidden group bg-dark-700"
            >
              <Image
                src={r.thumbUrl || r.imageUrl}
                alt={r.title}
                width={600}
                height={450}
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark-900/0 group-hover:bg-dark-900/65 transition-all duration-300 flex items-end p-5">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-xs tracking-widest text-wood-400 uppercase mb-1">{categoryLabel(r.category)}</p>
                  <p className="font-display font-bold text-cream">{r.title}</p>
                  {r.description && (
                    <p className="text-cream/90 text-xs mt-1 line-clamp-2">{r.description}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
