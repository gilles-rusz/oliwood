'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { clsx } from 'clsx'

// ── Validation schema ─────────────────────────────────────────
const dimension = z.coerce
  .number({ invalid_type_error: 'Indiquez un nombre' })
  .positive('Indiquez un nombre')
  .max(200, 'Dimension improbable')
  .optional()
  .or(z.literal('').transform(() => undefined))

const devisSchema = z.object({
  // Honeypot — doit rester vide
  website: z.string().max(0, 'Bot détecté'),

  // Étape 1 — Type de projet
  typeProjet: z.enum(['CARPORT', 'PERGOLA', 'TERRASSE', 'AUTRE'], {
    required_error: 'Choisissez un type de projet',
  }),

  // Étape 2 — Détails du projet
  longueur: dimension,
  largeur: dimension,
  hauteur: dimension,
  typeTerrain: z.string().max(200).optional(),
  implantation: z.enum(['ADOSSE', 'AUTOPORTE']).optional(),
  plotsBeton: z.enum(['OUI', 'NON']).optional(),
  toiture: z.string().max(1000).optional(),
  finitionBois: z.string().max(1000).optional(),
  description: z.string().max(2000).optional(),

  // Étape 3 — Contact
  prenom: z.string().min(2, 'Prénom requis').max(50),
  nom: z.string().min(2, 'Nom requis').max(50),
  email: z.string().email('Email invalide'),
  telephone: z.string().regex(/^(\+33|0)[1-9](\s?\d{2}){4}$/, 'Téléphone invalide').optional().or(z.literal('')),
  adresse: z.string().max(200).optional(),
  ville: z.string().max(100).optional(),
})

type DevisData = z.infer<typeof devisSchema>
type TypeProjet = DevisData['typeProjet']

const TYPES_PROJET: { value: TypeProjet; label: string; desc: string }[] = [
  { value: 'CARPORT',  label: 'Carport & Abris', desc: 'Abri voiture, abri bois, appentis' },
  { value: 'PERGOLA',  label: 'Pergola',         desc: 'Pergola, abri de terrasse, cuisine d\'été' },
  { value: 'TERRASSE', label: 'Terrasse',        desc: 'Terrasse bois, composite, surélevée' },
  { value: 'AUTRE',    label: 'Autre projet',    desc: 'Décrivez-nous votre idée' },
]

const STEPS = ['Votre projet', 'Les détails', 'Vos coordonnées']

// Carport et pergola partagent les mêmes questions (structure couverte)
function isStructureCouverte(type: TypeProjet | undefined) {
  return type === 'CARPORT' || type === 'PERGOLA'
}

export function DevisForm() {
  const [step, setStep]       = useState(0)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<DevisData>({
    resolver: zodResolver(devisSchema),
  })

  const typeProjet   = watch('typeProjet')
  const implantation = watch('implantation')
  const plotsBeton   = watch('plotsBeton')

  async function onSubmit(data: DevisData) {
    if (data.website) return // Honeypot triggered

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, recaptchaToken: await getRecaptchaToken() }),
      })

      if (!res.ok) throw new Error(await res.text())
      setSuccess(true)
    } catch {
      setError('Une erreur est survenue. Veuillez réessayer.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="devis-paper devis-field text-center" style={{ padding: '54px 28px' }}>
        <div className="devis-choice-title" style={{ fontSize: 30 }}>Demande envoyée !</div>
        <p className="devis-choice-desc" style={{ fontSize: 17 }}>
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
      <div className="devis-steps">
        {STEPS.map((s, i) => (
          <div key={s} className={clsx('devis-step', i === step ? 'is-current' : i < step && 'is-done')}>
            <div className="devis-step-bar" />
            <p className="devis-step-label">{s}</p>
          </div>
        ))}
      </div>

      {/* ── Étape 1 — Type de projet ── */}
      {step === 0 && (
        <div className="space-y-4">
          <p className="devis-question">Quel type de projet souhaitez-vous réaliser ?</p>
          {TYPES_PROJET.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setValue('typeProjet', value); setStep(1) }}
              className={clsx('devis-paper devis-choice', typeProjet === value && 'is-selected')}
            >
              <span className="devis-choice-title">{label}</span>
              <span className="devis-choice-desc block">{desc}</span>
            </button>
          ))}
          {errors.typeProjet && <p className="devis-error">{errors.typeProjet.message}</p>}
        </div>
      )}

      {/* ── Étape 2 — Détails, selon le type de projet ── */}
      {step === 1 && (
        <div className="space-y-5">
          {typeProjet === 'AUTRE' ? (
            <div className="devis-paper devis-field">
              <label className="devis-label">Décrivez votre projet</label>
              <textarea
                {...register('description')}
                className="devis-input min-h-[200px] resize-none"
                placeholder="Nature du projet, dimensions, matériaux, contraintes…"
              />
              <p className="devis-hint">
                N&apos;oubliez pas de donner les dimensions de votre projet.
              </p>
            </div>
          ) : (
            <>
              <div className="devis-paper devis-field">
                <label className="devis-label">Dimensions souhaitées (en mètres)</label>
                <div className="grid grid-cols-3 gap-3">
                  {([
                    ['longueur', 'Longueur'],
                    ['largeur', 'Largeur'],
                    ['hauteur', 'Hauteur'],
                  ] as const).map(([name, label]) => (
                    <div key={name}>
                      <input
                        {...register(name)}
                        type="number"
                        step="0.01"
                        inputMode="decimal"
                        className="devis-input"
                        placeholder={label}
                        aria-label={label}
                      />
                      {errors[name] && <p className="devis-error">{errors[name]?.message}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="devis-paper devis-field">
                <label className="devis-label">Type de terrain actuel</label>
                <input
                  {...register('typeTerrain')}
                  className="devis-input"
                  placeholder="Terre, gravier, dalle béton, pelouse…"
                />
              </div>

              {isStructureCouverte(typeProjet) && (
                <>
                  <div className="devis-paper devis-field">
                    <label className="devis-label">Implantation</label>
                    <div className="grid grid-cols-2 gap-3">
                      {([
                        ['ADOSSE', 'Adossé à une structure existante'],
                        ['AUTOPORTE', 'Autoporté'],
                      ] as const).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue('implantation', value)}
                          className={clsx('devis-pill', implantation === value && 'is-selected')}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="devis-paper devis-field">
                    <label className="devis-label">Besoin de plots béton ?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {(['OUI', 'NON'] as const).map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue('plotsBeton', value)}
                          className={clsx('devis-pill', plotsBeton === value && 'is-selected')}
                        >
                          {value === 'OUI' ? 'Oui' : 'Non'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="devis-paper devis-field">
                    <label className="devis-label">Toiture souhaitée</label>
                    <textarea
                      {...register('toiture')}
                      className="devis-input min-h-[90px] resize-none"
                      placeholder="Tuiles, bac acier, polycarbonate… et couleur souhaitée"
                    />
                  </div>
                </>
              )}

              <div className="devis-paper devis-field">
                <label className="devis-label">Finition ou type de bois souhaité</label>
                <textarea
                  {...register('finitionBois')}
                  className="devis-input min-h-[90px] resize-none"
                  placeholder="Naturelle, lasure, peinture… et couleur souhaitée"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(0)} className="devis-btn-ghost">
              ← Retour
            </button>
            <button type="button" onClick={() => setStep(2)} className="devis-btn">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3 — Coordonnées ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="devis-question">Vos coordonnées pour vous recontacter</p>

          <div className="devis-paper devis-field">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="devis-label">Prénom *</label>
                <input {...register('prenom')} className="devis-input" autoComplete="given-name" />
                {errors.prenom && <p className="devis-error">{errors.prenom.message}</p>}
              </div>
              <div>
                <label className="devis-label">Nom *</label>
                <input {...register('nom')} className="devis-input" autoComplete="family-name" />
                {errors.nom && <p className="devis-error">{errors.nom.message}</p>}
              </div>
            </div>
          </div>

          <div className="devis-paper devis-field">
            <label className="devis-label">Email *</label>
            <input {...register('email')} type="email" className="devis-input" autoComplete="email" />
            {errors.email && <p className="devis-error">{errors.email.message}</p>}
          </div>

          <div className="devis-paper devis-field">
            <label className="devis-label">Téléphone</label>
            <input {...register('telephone')} type="tel" className="devis-input" autoComplete="tel" placeholder="06 XX XX XX XX" />
            {errors.telephone && <p className="devis-error">{errors.telephone.message}</p>}
          </div>

          <div className="devis-paper devis-field">
            <label className="devis-label">Adresse du chantier</label>
            <input {...register('adresse')} className="devis-input" autoComplete="street-address" />
          </div>

          <div className="devis-paper devis-field">
            <label className="devis-label">Ville / Code postal</label>
            <input {...register('ville')} className="devis-input" autoComplete="address-level2" />
          </div>

          {typeProjet !== 'AUTRE' && (
            <div className="devis-paper devis-field">
              <label className="devis-label">En dire plus sur votre projet</label>
              <textarea
                {...register('description')}
                className="devis-input min-h-[120px] resize-none"
                placeholder="Contraintes du terrain, délai souhaité, style, questions…"
              />
            </div>
          )}

          {error && <p className="devis-alert">{error}</p>}

          <p className="devis-legal">
            Vos données sont utilisées uniquement pour répondre à votre demande. Aucun démarchage.
          </p>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => setStep(1)} className="devis-btn-ghost" disabled={loading}>
              ← Retour
            </button>
            <button type="submit" className="devis-btn" disabled={loading}>
              {loading ? 'Envoi en cours…' : 'Envoyer ma demande'}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}

// reCAPTCHA v3 — absent en développement local (pas de clé publique)
async function getRecaptchaToken(): Promise<string> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
  const grecaptcha = window.grecaptcha
  if (!siteKey || !grecaptcha) return ''

  return new Promise<string>(resolve => {
    grecaptcha.ready(() => {
      grecaptcha.execute(siteKey, { action: 'devis' }).then(resolve).catch(() => resolve(''))
    })
  })
}

// Déclaration globale pour reCAPTCHA
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void
      execute: (key: string, opts: { action: string }) => Promise<string>
    }
  }
}
