'use client'

import { useState } from 'react'
import { clsx } from 'clsx'

const THEMES = [
  { value: null,        label: 'Aucun', icon: '○', desc: 'Site normal' },
  { value: 'NOEL',      label: 'Noël',  icon: '❄', desc: 'Flocons de neige animés' },
  { value: 'PRINTEMPS', label: 'Printemps', icon: '🌸', desc: 'Pétales de fleurs' },
]

export default function AdminSettingsPage() {
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [theme, setTheme]     = useState<string | null>(null)
  const [active, setActive]   = useState(false)

  async function saveSettings() {
    setSaving(true)
    try {
      await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seasonalTheme: theme, seasonalActive: active }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-cream mb-8">Réglages du site</h1>

      {/* Thème saisonnier */}
      <section className="bg-dark-800 border border-cream/5 p-6 mb-6">
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-1">Décoration saisonnière</h2>
        <p className="text-cream/50 text-xs mb-5">
          Ajoute une animation légère sur tout le site selon la saison.
          Active ou désactive-la en un clic.
        </p>

        <div className="grid grid-cols-3 gap-3 mb-5">
          {THEMES.map(({ value, label, icon, desc }) => (
            <button
              key={label}
              type="button"
              onClick={() => setTheme(value)}
              className={clsx(
                'p-4 border text-left transition-all',
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
              {active ? 'Décoration activée' : 'Décoration désactivée'}
            </span>
          </label>
        )}
      </section>

      <button
        onClick={saveSettings}
        disabled={saving}
        className="btn-primary"
      >
        {saving ? 'Enregistrement…' : saved ? '✓ Enregistré' : 'Enregistrer'}
      </button>
    </div>
  )
}
