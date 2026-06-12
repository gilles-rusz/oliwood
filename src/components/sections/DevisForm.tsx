'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { clsx } from 'clsx'

// ── Validation schema ─────────────────────────────────────────
const devisSchema = z.object({
  // Honeypot — doit rester vide
  website: z.string().max(0, 'Bot détecté'),

  // Étape 1 — Type de projet
  typeProjet: z.enum(['CHARPENTE', 'TERRASSE', 'PERGOLA', 'CABANE', 'RENOVATION', 'AUTRE'], {
    required_error: 'Choisissez un type de projet',
  }),

  // Étape 2 — Budget
  budget: z.enum(['MOINS_5K', 'ENTRE_5K_15K', 'ENTRE_15K_30K', 'ENTRE_30K_50K', 'PLUS_50K', 'A_DEFINIR']).optional(),

  // Étape 3 — Description
  description: z.string().max(1000).optional(),

  // Étape 4 — Contact
  prenom: z.string().min(2, 'Prénom requis').max(50),
  nom: z.string().min(2, 'Nom requis').max(50),
  email: z.string().email('Email invalide'),
  telephone: z.string().regex(/^(\+33|0)[1-9](\d{2}){4}$/, 'Téléphone invalide').optional().or(z.literal('')),
  ville: z.string().max(100).optional(),
})

type DevisData = z.infer<typeof devisSchema>

const TYPES_PROJET = [
  { value: 'CHARPENTE',  label: 'Charpente',       desc: 'Structure porteuse, toit, ossature bois' },
  { value: 'TERRASSE',   label: 'Terrasse',         desc: 'Terrasse bois, composite, sur pilotis' },
  { value: 'PERGOLA',    label: 'Pergola',          desc: 'Pergola, carport, abri de jardin' },
  { value: 'CABANE',     label: 'Cabane',           desc: 'Cabane dans les arbres, chalet, studio' },
  { value: 'RENOVATION', label: 'Rénovation',       desc: 'Restauration, consolidation, mise aux normes' },
  { value: 'AUTRE',      label: 'Autre / Je ne sais pas', desc: 'Décrivez-nous votre idée' },
]

const BUDGETS = [
  { value: 'MOINS_5K',      label: 'Moins de 5 000 €' },
  { value: 'ENTRE_5K_15K',  label: '5 000 – 15 000 €' },
  { value: 'ENTRE_15K_30K', label: '15 000 – 30 000 €' },
  { value: 'ENTRE_30K_50K', label: '30 000 – 50 000 €' },
  { value: 'PLUS_50K',      label: 'Plus de 50 000 €' },
  { value: 'A_DEFINIR',     label: 'À définir ensemble' },
]

const STEPS = ['Votre projet', 'Votre budget', 'Détails', 'Vos coordonnées']

export function DevisForm() {
  const [step, setStep]       = useState(0)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DevisData>({
    resolver: zodResolver(devisSchema),
  })

  const typeProjet = watch('typeProjet')
  const budget     = watch('budget')

  async function onSubmit(data: DevisData) {
    if (data.website) return // Honeypot triggered

    setLoading(true)
    setError('')

    try {
      // Obtenir le token reCAPTCHA v3
      const recaptchaToken = await new Promise<string>((resolve) => {
        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!, { action: 'devis' })
            .then(resolve)
        })
      })

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken }),
      })

      if (!res.ok) throw new Error(await res.text())
      setSuccess(true)
    } catch (e) {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-20">
        <div className="text-wood-400 text-5xl mb-6">✓</div>
        <h2 className="font-display text-2xl font-bold text-cream mb-3">Demande envoyée !</h2>
        <p className="text-cream/60 text-sm">
          Nous avons bien reçu votre demande et vous répondrons sous 48h.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Honeypot — caché, doit rester vide */}
      <div style={{ position: 'absolute', left: '-9999px', opacity: 0, height: 0, overflow: 'hidden' }} aria-hidden>
        <label htmlFor="website">Ne pas remplir</label>
        <input
          id="website"
          type="text"
          autoComplete="off"
          tabIndex={-1}
          {...register('website')}
        />
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className={clsx(
              'h-0.5 transition-all duration-500',
              i <= step ? 'bg-wood-400' : 'bg-cream/10'
            )} />
            <p className={clsx(
              'text-[0.6rem] tracking-widest uppercase mt-2 transition-colors',
              i === step ? 'text-wood-400' : i < step ? 'text-cream/40' : 'text-cream/20'
            )}>
              {s}
            </p>
          </div>
        ))}
      </div>

      {/* ── Étape 0 — Type de projet ── */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-cream/70 text-sm mb-6">Quel type de projet souhaitez-vous réaliser ?</p>
          {TYPES_PROJET.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setValue('typeProjet', value as DevisData['typeProjet']); setStep(1) }}
              className={clsx(
                'w-full text-left px-5 py-4 border transition-all duration-200',
                typeProjet === value
                  ? 'border-wood-400 bg-wood-400/10'
                  : 'border-cream/10 bg-dark-800 hover:border-cream/25'
              )}
            >
              <p className="font-medium text-cream text-sm">{label}</p>
              <p className="text-cream/40 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
          {errors.typeProjet && <p className="form-error">{errors.typeProjet.message}</p>}
        </div>
      )}

      {/* ── Étape 1 — Budget ── */}
      {step === 1 && (
        <div className="space-y-3">
          <p className="text-cream/70 text-sm mb-6">Quel est votre budget approximatif ?</p>
          <div className="grid grid-cols-2 gap-2">
            {BUDGETS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => { setValue('budget', value as DevisData['budget']); setStep(2) }}
                className={clsx(
                  'px-4 py-3 border text-sm transition-all duration-200 text-left',
                  budget === value
                    ? 'border-wood-400 text-wood-400 bg-wood-400/10'
                    : 'border-cream/10 text-cream/60 bg-dark-800 hover:border-cream/25 hover:text-cream/80'
                )}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(0)} className="btn-outline text-xs py-2 flex-1">
              ← Retour
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 2 — Description ── */}
      {step === 2 && (
        <div className="space-y-5">
          <p className="text-cream/70 text-sm mb-2">Décrivez votre projet (optionnel)</p>
          <div>
            <label className="form-label">Description</label>
            <textarea
              {...register('description')}
              className="form-input min-h-[140px] resize-none"
              placeholder="Dimensions souhaitées, contraintes particulières, délai, style..."
            />
          </div>
          <div>
            <label className="form-label">Délai souhaité</label>
            <select {...register('delai' as keyof DevisData)} className="form-input">
              <option value="">Non précisé</option>
              <option value="URGENT">Urgent (moins d&apos;1 mois)</option>
              <option value="3_MOIS">Dans les 3 mois</option>
              <option value="6_MOIS">Dans les 6 mois</option>
              <option value="1_AN">Dans l&apos;année</option>
            </select>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(1)} className="btn-outline text-xs py-2 flex-1">
              ← Retour
            </button>
            <button type="button" onClick={() => setStep(3)} className="btn-primary text-xs py-2 flex-1">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3 — Coordonnées ── */}
      {step === 3 && (
        <div className="space-y-4">
          <p className="text-cream/70 text-sm mb-4">Vos coordonnées pour vous recontacter</p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Prénom *</label>
              <input {...register('prenom')} className="form-input" autoComplete="given-name" />
              {errors.prenom && <p className="form-error">{errors.prenom.message}</p>}
            </div>
            <div>
              <label className="form-label">Nom *</label>
              <input {...register('nom')} className="form-input" autoComplete="family-name" />
              {errors.nom && <p className="form-error">{errors.nom.message}</p>}
            </div>
          </div>

          <div>
            <label className="form-label">Email *</label>
            <input {...register('email')} type="email" className="form-input" autoComplete="email" />
            {errors.email && <p className="form-error">{errors.email.message}</p>}
          </div>

          <div>
            <label className="form-label">Téléphone</label>
            <input {...register('telephone')} type="tel" className="form-input" autoComplete="tel" placeholder="06 XX XX XX XX" />
            {errors.telephone && <p className="form-error">{errors.telephone.message}</p>}
          </div>

          <div>
            <label className="form-label">Ville / Code postal</label>
            <input {...register('ville')} className="form-input" autoComplete="address-level2" />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <p className="text-cream/25 text-[0.65rem] mt-2">
            Vos données sont utilisées uniquement pour répondre à votre demande. Aucun démarchage.
          </p>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(2)} className="btn-outline text-xs py-2 flex-1" disabled={loading}>
              ← Retour
            </button>
            <button type="submit" className="btn-primary text-xs py-2 flex-1" disabled={loading}>
              {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

// Déclaration globale pour reCAPTCHA
declare global {
  interface Window {
    grecaptcha: {
      ready: (cb: () => void) => void
      execute: (key: string, opts: { action: string }) => Promise<string>
    }
  }
}
