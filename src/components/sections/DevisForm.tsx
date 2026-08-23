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
      <div className="text-center py-20">
        <div className="text-wood-400 text-5xl mb-6">✓</div>
        <h2 className="font-display text-2xl font-bold text-cream mb-3">Demande envoyée !</h2>
        <p className="text-cream/90 text-sm">
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

      {/* ── Étape 1 — Type de projet ── */}
      {step === 0 && (
        <div className="space-y-3">
          <p className="text-cream/90 text-sm mb-6">Quel type de projet souhaitez-vous réaliser ?</p>
          {TYPES_PROJET.map(({ value, label, desc }) => (
            <button
              key={value}
              type="button"
              onClick={() => { setValue('typeProjet', value); setStep(1) }}
              className={clsx(
                'w-full text-left px-5 py-4 border transition-all duration-200',
                typeProjet === value
                  ? 'border-wood-400 bg-wood-400/10'
                  : 'border-cream/10 bg-dark-800 hover:border-cream/25'
              )}
            >
              <p className="font-medium text-cream text-sm">{label}</p>
              <p className="text-cream/75 text-xs mt-0.5">{desc}</p>
            </button>
          ))}
          {errors.typeProjet && <p className="form-error">{errors.typeProjet.message}</p>}
        </div>
      )}

      {/* ── Étape 2 — Détails, selon le type de projet ── */}
      {step === 1 && (
        <div className="space-y-5">
          {typeProjet === 'AUTRE' ? (
            <>
              <p className="text-cream/90 text-sm">Décrivez votre projet</p>
              <div>
                <textarea
                  {...register('description')}
                  className="form-input min-h-[180px] resize-none"
                  placeholder="Nature du projet, dimensions, matériaux, contraintes…"
                />
                <p className="text-cream/40 text-xs mt-2">
                  N&apos;oubliez pas de donner les dimensions de votre projet.
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="text-cream/90 text-sm">Dimensions souhaitées</p>
              <div className="grid grid-cols-3 gap-3">
                {([
                  ['longueur', 'Longueur'],
                  ['largeur', 'Largeur'],
                  ['hauteur', 'Hauteur'],
                ] as const).map(([name, label]) => (
                  <div key={name}>
                    <label className="form-label">{label} (m)</label>
                    <input
                      {...register(name)}
                      type="number"
                      step="0.01"
                      inputMode="decimal"
                      className="form-input"
                      placeholder="0"
                    />
                    {errors[name] && <p className="form-error">{errors[name]?.message}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label className="form-label">Type de terrain actuel</label>
                <input
                  {...register('typeTerrain')}
                  className="form-input"
                  placeholder="Terre, gravier, dalle béton, pelouse…"
                />
              </div>

              {isStructureCouverte(typeProjet) && (
                <>
                  <div>
                    <label className="form-label">Implantation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {([
                        ['ADOSSE', 'Adossé à une structure existante'],
                        ['AUTOPORTE', 'Autoporté'],
                      ] as const).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue('implantation', value)}
                          className={clsx(
                            'px-4 py-3 border text-xs text-left transition-all duration-200',
                            implantation === value
                              ? 'border-wood-400 text-wood-400 bg-wood-400/10'
                              : 'border-cream/10 text-cream/85 bg-dark-800 hover:border-cream/25'
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Besoin de plots béton ?</label>
                    <div className="grid grid-cols-2 gap-2">
                      {(['OUI', 'NON'] as const).map(value => (
                        <button
                          key={value}
                          type="button"
                          onClick={() => setValue('plotsBeton', value)}
                          className={clsx(
                            'px-4 py-3 border text-xs transition-all duration-200',
                            plotsBeton === value
                              ? 'border-wood-400 text-wood-400 bg-wood-400/10'
                              : 'border-cream/10 text-cream/85 bg-dark-800 hover:border-cream/25'
                          )}
                        >
                          {value === 'OUI' ? 'Oui' : 'Non'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Toiture souhaitée</label>
                    <textarea
                      {...register('toiture')}
                      className="form-input min-h-[90px] resize-none"
                      placeholder="Tuiles, bac acier, polycarbonate… et couleur souhaitée"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="form-label">Finition ou type de bois souhaité</label>
                <textarea
                  {...register('finitionBois')}
                  className="form-input min-h-[90px] resize-none"
                  placeholder="Naturelle, lasure, peinture… et couleur souhaitée"
                />
              </div>
            </>
          )}

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(0)} className="btn-outline text-xs py-2 flex-1">
              ← Retour
            </button>
            <button type="button" onClick={() => setStep(2)} className="btn-primary text-xs py-2 flex-1">
              Suivant →
            </button>
          </div>
        </div>
      )}

      {/* ── Étape 3 — Coordonnées ── */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-cream/90 text-sm mb-4">Vos coordonnées pour vous recontacter</p>

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
            <label className="form-label">Adresse du chantier</label>
            <input {...register('adresse')} className="form-input" autoComplete="street-address" />
          </div>

          <div>
            <label className="form-label">Ville / Code postal</label>
            <input {...register('ville')} className="form-input" autoComplete="address-level2" />
          </div>

          {typeProjet !== 'AUTRE' && (
            <div>
              <label className="form-label">En dire plus sur votre projet</label>
              <textarea
                {...register('description')}
                className="form-input min-h-[120px] resize-none"
                placeholder="Contraintes du terrain, délai souhaité, style, questions…"
              />
            </div>
          )}

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 px-4 py-3">
              {error}
            </p>
          )}

          <p className="text-cream/25 text-[0.65rem] mt-2">
            Vos données sont utilisées uniquement pour répondre à votre demande. Aucun démarchage.
          </p>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={() => setStep(1)} className="btn-outline text-xs py-2 flex-1" disabled={loading}>
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
