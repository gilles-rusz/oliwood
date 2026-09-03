'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'
import { clsx } from 'clsx'

const CATEGORIES = [
  { value: undefined,  label: 'Tous' },
  { value: 'CARPORT',  label: 'Carport & Abris' },
  { value: 'TERRASSE', label: 'Terrasse' },
  { value: 'PERGOLA',  label: 'Pergola' },
  { value: 'AVANT_APRES', label: 'Avant / Après' },
  { value: 'AUTRE',    label: 'Autres' },
]

const PAGE_SIZE = 24

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

  const [visible, setVisible] = useState(PAGE_SIZE)
  const [lightbox, setLightbox] = useState<number | null>(null)

  useEffect(() => { setVisible(PAGE_SIZE) }, [activeCategory])

  const shown = useMemo(() => realisations.slice(0, visible), [realisations, visible])
  const remaining = realisations.length - shown.length

  useEffect(() => {
    if (lightbox === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape')     setLightbox(null)
      if (e.key === 'ArrowRight') setLightbox(i => i === null ? i : Math.min(i + 1, realisations.length - 1))
      if (e.key === 'ArrowLeft')  setLightbox(i => i === null ? i : Math.max(i - 1, 0))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightbox, realisations.length])

  function filterBy(cat?: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (cat) params.set('categorie', cat)
    else params.delete('categorie')
    router.push(`/realisations?${params.toString()}`)
  }

  const current = lightbox !== null ? realisations[lightbox] : null

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Filtres */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
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

      <p className="text-center text-cream/40 text-xs tracking-widest uppercase mb-10">
        {realisations.length} photo{realisations.length > 1 ? 's' : ''}
        {activeCategory ? ` — ${categoryLabel(activeCategory)}` : ''}
      </p>

      {/* Grille */}
      {realisations.length === 0 ? (
        <p className="text-center text-cream/40 py-20">Aucune réalisation dans cette catégorie pour l&apos;instant.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {shown.map((r, i) => (
              <button
                key={r.id}
                onClick={() => setLightbox(i)}
                className="relative overflow-hidden group bg-dark-700 aspect-[4/3] text-left"
              >
                <Image
                  src={r.thumbUrl || r.imageUrl}
                  alt={r.title}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {r.featured && (
                  <span className="absolute top-2 left-2 z-10 text-[0.6rem] bg-wood-400 text-dark-900 px-2 py-0.5 tracking-widest uppercase font-medium">
                    ★ Coup de cœur
                  </span>
                )}
              </button>
            ))}
          </div>

          {remaining > 0 && (
            <div className="text-center mt-12">
              <button onClick={() => setVisible(v => v + PAGE_SIZE)} className="btn-outline text-xs">
                Voir plus ({remaining} restante{remaining > 1 ? 's' : ''})
              </button>
            </div>
          )}
        </>
      )}

      {/* Vue agrandie */}
      {current && (
        <div
          className="fixed inset-0 z-50 bg-dark-900/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-4 right-5 text-cream/60 hover:text-cream text-2xl leading-none"
            aria-label="Fermer"
          >
            ✕
          </button>

          {lightbox !== null && lightbox > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox(i => (i ?? 1) - 1) }}
              className="absolute left-3 sm:left-6 text-cream/60 hover:text-cream text-4xl leading-none px-2"
              aria-label="Photo précédente"
            >
              ‹
            </button>
          )}
          {lightbox !== null && lightbox < realisations.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setLightbox(i => (i ?? 0) + 1) }}
              className="absolute right-3 sm:right-6 text-cream/60 hover:text-cream text-4xl leading-none px-2"
              aria-label="Photo suivante"
            >
              ›
            </button>
          )}

          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <div className="relative w-full" style={{ height: '72vh' }}>
              <Image
                src={current.imageUrl}
                alt={current.title}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="text-center mt-4">
              <p className="text-xs tracking-widest text-wood-400 uppercase mb-1">{categoryLabel(current.category)}</p>
              <p className="font-display font-bold text-cream">{current.title}</p>
              {current.description && <p className="text-cream/70 text-xs mt-1">{current.description}</p>}
              <p className="text-cream/30 text-[0.65rem] mt-3">{lightbox! + 1} / {realisations.length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
