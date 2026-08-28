'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { SEASONAL_LABELS, SEASONAL_THEMES } from '@/lib/seasonal'
import { SeasonalDecorations } from '@/components/ui/SeasonalDecorations'

const THEMES: { value: string | null; label: string; icon: string; desc: string }[] = [
  { value: null, label: 'Aucun', icon: '○', desc: 'Site normal' },
  ...SEASONAL_THEMES.map(value => ({ value, ...SEASONAL_LABELS[value] })),
]

const TEXT_FIELDS = [
  'heroTitle', 'heroSubtitle', 'metaDescription', 'telephone', 'email', 'adresse',
] as const

type TextField = (typeof TEXT_FIELDS)[number]
type Texts = Record<TextField, string>

const EMPTY_TEXTS = Object.fromEntries(TEXT_FIELDS.map(f => [f, ''])) as Texts

const PLACEHOLDERS: Texts = {
  heroTitle:       'Le bois, travaillé à votre image.',
  heroSubtitle:    'Installé à Moirans-en-Montagne, dans le Jura, je conçois et fabrique vos structures bois sur mesure, du devis à la pose.',
  metaDescription: 'Spécialistes de la construction en bois sur mesure : charpentes, terrasses, pergolas, cabanes.',
  telephone:       '06 52 14 74 34',
  email:           'oliwood.eurl@gmail.com',
  adresse:         '1 Chemin sous Tongea, 39260 Moirans-en-Montagne',
}

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [error, setError]     = useState<string | null>(null)
  const [theme, setTheme]     = useState<string | null>(null)
  const [active, setActive]   = useState(false)
  const [preview, setPreview] = useState(false)
  const [texts, setTexts]     = useState<Texts>(EMPTY_TEXTS)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Chargement impossible'))))
      .then((data) => {
        setTheme(data.seasonalTheme)
        setActive(data.seasonalActive)
        setTexts(Object.fromEntries(TEXT_FIELDS.map(f => [f, data[f] ?? ''])) as Texts)
      })
      .catch(() => setError('Impossible de charger les réglages actuels.'))
      .finally(() => setLoading(false))
  }, [])

  function selectTheme(value: string | null) {
    setTheme(value)
    setPreview(value !== null)
  }

  async function saveSettings() {
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          seasonalTheme: theme,
          seasonalActive: theme ? active : false,
          ...texts,
        }),
      })
      if (!res.ok) throw new Error('Enregistrement impossible')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError("L'enregistrement a échoué. Réessaie dans un instant.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Aperçu live des décors, par-dessus l'admin */}
      {preview && theme && <SeasonalDecorations theme={theme} />}

      <h1 className="font-display text-2xl font-bold text-cream mb-8">Réglages du site</h1>

      {/* Thème saisonnier */}
      <section className="bg-dark-800 border border-cream/5 p-6 mb-6">
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-1">Décoration saisonnière</h2>
        <p className="text-cream/50 text-xs mb-5">
          Habille tout le site aux couleurs de la saison. Clique sur un thème pour le voir
          immédiatement en aperçu, puis enregistre pour l&apos;appliquer aux visiteurs.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {THEMES.map(({ value, label, icon, desc }) => (
            <button
              key={label}
              type="button"
              disabled={loading}
              onClick={() => selectTheme(value)}
              className={clsx(
                'p-4 border text-left transition-all disabled:opacity-40',
                theme === value
                  ? 'border-wood-400 bg-wood-400/10'
                  : 'border-cream/10 bg-dark-700 hover:border-cream/25'
              )}
            >
              <p className="text-2xl mb-2">{icon}</p>
              <p className="text-cream text-sm font-medium">{label}</p>
              <p className="text-cream/40 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
        </div>

        {theme && (
          <div className="flex flex-wrap items-center gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className={clsx(
                  'w-10 h-5 rounded-full transition-colors relative',
                  active ? 'bg-wood-400' : 'bg-cream/10'
                )}
                onClick={() => setActive(!active)}
              >
                <div className={clsx(
                  'absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform',
                  active ? 'translate-x-5' : 'translate-x-0.5'
                )} />
              </div>
              <span className="text-sm text-cream/60">
                Thème visible sur le site : <strong className={active ? 'text-jaune' : 'text-cream/70'}>{active ? 'Oui' : 'Non'}</strong>
              </span>
            </label>

            <button
              type="button"
              onClick={() => setPreview(!preview)}
              className="text-xs tracking-widest uppercase text-cream/50 underline underline-offset-4 hover:text-cream"
            >
              {preview ? "Arrêter l'aperçu" : 'Aperçu du décor'}
            </button>
          </div>
        )}
      </section>

      {/* Contenu de la page d'accueil */}
      <section className="bg-dark-800 border border-cream/5 p-6 mb-6">
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-1">Textes de la page d&apos;accueil</h2>
        <p className="text-cream/50 text-xs mb-5">
          Laisse un champ vide pour conserver le texte livré avec le site (affiché en gris).
        </p>

        <div className="space-y-4">
          <div>
            <label className="form-label" htmlFor="heroTitle">Titre principal</label>
            <input
              id="heroTitle"
              className="form-input"
              value={texts.heroTitle}
              placeholder={PLACEHOLDERS.heroTitle}
              onChange={e => setTexts({ ...texts, heroTitle: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="heroSubtitle">Sous-titre</label>
            <textarea
              id="heroSubtitle"
              rows={2}
              className="form-input"
              value={texts.heroSubtitle}
              placeholder={PLACEHOLDERS.heroSubtitle}
              onChange={e => setTexts({ ...texts, heroSubtitle: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="metaDescription">Description Google (référencement)</label>
            <textarea
              id="metaDescription"
              rows={2}
              className="form-input"
              value={texts.metaDescription}
              placeholder={PLACEHOLDERS.metaDescription}
              onChange={e => setTexts({ ...texts, metaDescription: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Coordonnées */}
      <section className="bg-dark-800 border border-cream/5 p-6 mb-6">
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-1">Coordonnées affichées sur le site</h2>
        <p className="text-cream/50 text-xs mb-5">Reprises dans le pied de page de toutes les pages.</p>

        <div className="space-y-4">
          <div>
            <label className="form-label" htmlFor="telephone">Téléphone</label>
            <input
              id="telephone"
              className="form-input"
              value={texts.telephone}
              placeholder={PLACEHOLDERS.telephone}
              onChange={e => setTexts({ ...texts, telephone: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="email">Email de contact</label>
            <input
              id="email"
              type="email"
              className="form-input"
              value={texts.email}
              placeholder={PLACEHOLDERS.email}
              onChange={e => setTexts({ ...texts, email: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label" htmlFor="adresse">Adresse de l&apos;atelier</label>
            <input
              id="adresse"
              className="form-input"
              value={texts.adresse}
              placeholder={PLACEHOLDERS.adresse}
              onChange={e => setTexts({ ...texts, adresse: e.target.value })}
            />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <button
        onClick={saveSettings}
        disabled={saving || loading}
        className="btn-primary"
      >
        {loading ? 'Chargement…' : saving ? 'Enregistrement…' : saved ? '✓ Enregistré' : 'Enregistrer'}
      </button>
    </div>
  )
}
