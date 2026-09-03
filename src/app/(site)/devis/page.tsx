import type { Metadata } from 'next'
import { DevisForm } from '@/components/sections/DevisForm'

export const metadata: Metadata = {
  title: 'Demande de Devis',
  description: 'Décrivez votre projet bois et recevez un devis personnalisé.',
}

export default function DevisPage() {
  return (
    <div className="min-h-screen pt-24 pb-20">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <p className="section-label mb-4">Votre projet</p>
        <h1 className="section-title mb-4">Demande de devis</h1>
        <div className="wood-rule" />
        <p className="devis-intro max-w-xl mx-auto text-sm leading-relaxed mt-4">
          Décrivez votre projet en quelques étapes.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <DevisForm />
      </div>
    </div>
  )
}
