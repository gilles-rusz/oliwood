'use client'

import { useEffect, useState } from 'react'
import type { Devis } from '@prisma/client'
import { clsx } from 'clsx'

const STATUTS = ['NOUVEAU', 'VU', 'EN_COURS', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'ARCHIVE'] as const
const STATUT_COLORS: Record<string, string> = {
  NOUVEAU:   'text-wood-400 bg-wood-400/15',
  VU:        'text-blue-400 bg-blue-400/15',
  EN_COURS:  'text-yellow-400 bg-yellow-400/15',
  ENVOYE:    'text-purple-400 bg-purple-400/15',
  ACCEPTE:   'text-green-400 bg-green-400/15',
  REFUSE:    'text-red-400 bg-red-400/15',
  ARCHIVE:   'text-cream/20 bg-cream/5',
}

const IMPLANTATION_LABELS: Record<string, string> = {
  ADOSSE:    'Adossé à une structure existante',
  AUTOPORTE: 'Autoporté',
}

function dimensions(d: Devis) {
  const parts = [
    d.longueur ? `L ${d.longueur} m` : null,
    d.largeur ? `l ${d.largeur} m` : null,
    d.hauteur ? `H ${d.hauteur} m` : null,
  ].filter(Boolean)
  return parts.length ? parts.join(' × ') : null
}

interface Props {
  devis: Devis[]
}

export function AdminDevisClient({ devis: initial }: Props) {
  const [devis, setDevis]       = useState<Devis[]>(initial)
  const [selected, setSelected] = useState<Devis | null>(null)
  const [filter, setFilter]     = useState<string>('ALL')
  const [notes, setNotes]       = useState('')
  const [notesState, setNotesState] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    setNotes(selected?.notes ?? '')
    setNotesState('idle')
  }, [selected])

  async function updateStatut(id: string, statut: string) {
    await fetch(`/api/admin/devis/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ statut }),
    })
    setDevis(prev => prev.map(d => d.id === id ? { ...d, statut: statut as Devis['statut'] } : d))
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, statut: statut as Devis['statut'] } : null)
  }

  async function saveNotes() {
    if (!selected) return
    setNotesState('saving')
    await fetch(`/api/admin/devis/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    })
    setDevis(prev => prev.map(d => d.id === selected.id ? { ...d, notes } : d))
    setSelected(prev => prev ? { ...prev, notes } : null)
    setNotesState('saved')
    setTimeout(() => setNotesState('idle'), 2500)
  }

  async function deleteDevis(id: string) {
    if (!confirm('Supprimer définitivement cette demande ?')) return
    await fetch(`/api/admin/devis/${id}`, { method: 'DELETE' })
    setDevis(prev => prev.filter(d => d.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const filtered = filter === 'ALL' ? devis : devis.filter(d => d.statut === filter)

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Liste */}
      <div className="flex-1 min-w-0">
        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setFilter('ALL')}
            className={clsx('text-[0.65rem] px-3 py-1 border tracking-widest uppercase transition-colors',
              filter === 'ALL' ? 'border-wood-400 text-wood-400' : 'border-cream/10 text-cream/30 hover:border-cream/25')}
          >
            Tous ({devis.length})
          </button>
          {STATUTS.map(s => {
            const count = devis.filter(d => d.statut === s).length
            if (!count) return null
            return (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={clsx('text-[0.65rem] px-3 py-1 border tracking-widest uppercase transition-colors',
                  filter === s ? 'border-wood-400 text-wood-400' : 'border-cream/10 text-cream/30 hover:border-cream/25')}
              >
                {s} ({count})
              </button>
            )
          })}
          <a
            href="/api/admin/devis/export"
            className="text-[0.65rem] px-3 py-1 border border-cream/10 text-cream/40 tracking-widest uppercase hover:border-cream/25 hover:text-cream ml-auto"
          >
            Exporter en CSV
          </a>
        </div>

        {/* Tableau */}
        <div className="space-y-1">
          {filtered.length === 0 ? (
            <p className="text-cream/30 text-sm py-10 text-center">Aucune demande.</p>
          ) : filtered.map((d) => (
            <div
              key={d.id}
              onClick={() => setSelected(d)}
              className={clsx(
                'flex items-center justify-between px-4 py-3 cursor-pointer transition-colors border',
                selected?.id === d.id
                  ? 'border-wood-400/40 bg-wood-400/5'
                  : 'border-cream/5 bg-dark-800 hover:border-cream/10 hover:bg-dark-700'
              )}
            >
              <div className="min-w-0">
                <p className="text-cream text-sm font-medium">{d.prenom} {d.nom}</p>
                <p className="text-cream/40 text-xs truncate">
                  {d.typeProjet} · {d.telephone ?? d.email}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-4">
                {d.statut === 'NOUVEAU' && (
                  <button
                    onClick={e => { e.stopPropagation(); updateStatut(d.id, 'VU') }}
                    className="text-[0.6rem] px-2 py-1 border border-wood-400/30 text-wood-400 hover:bg-wood-400/10 tracking-widest uppercase"
                    title="Marquer comme lu"
                  >
                    Marquer lu
                  </button>
                )}
                {(d.statut === 'VU' || d.statut === 'EN_COURS') && (
                  <button
                    onClick={e => { e.stopPropagation(); updateStatut(d.id, 'ENVOYE') }}
                    className="text-[0.6rem] px-2 py-1 border border-green-400/30 text-green-400 hover:bg-green-400/10 tracking-widest uppercase"
                    title="Marquer comme traité"
                  >
                    Marquer traité
                  </button>
                )}
                <div className="text-right">
                  <span className={clsx('text-[0.6rem] px-2 py-0.5 tracking-widest uppercase', STATUT_COLORS[d.statut])}>
                    {d.statut}
                  </span>
                  <p className="text-cream/25 text-[0.6rem] mt-1">
                    {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Détail */}
      {selected && (
        <div className="w-full lg:w-80 shrink-0 bg-dark-800 border border-cream/5 p-5 self-start lg:sticky lg:top-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="font-display font-bold text-cream">{selected.prenom} {selected.nom}</p>
              <a href={`mailto:${selected.email}`} className="text-wood-400 text-xs hover:underline">
                {selected.email}
              </a>
            </div>
            <button onClick={() => setSelected(null)} className="text-cream/30 hover:text-cream text-sm">✕</button>
          </div>

          <div className="space-y-2 text-sm border-t border-cream/5 pt-4 mb-4">
            {([
              ['Projet',         selected.typeProjet],
              ['Dimensions',     dimensions(selected)],
              ['Terrain actuel', selected.typeTerrain],
              ['Implantation',   selected.implantation ? IMPLANTATION_LABELS[selected.implantation] : null],
              ['Plots béton',    selected.plotsBeton === null ? null : selected.plotsBeton ? 'Oui' : 'Non'],
              ['Budget',         selected.budget],
              ['Téléphone',      selected.telephone],
              ['Adresse',        selected.adresse],
              ['Ville',          selected.ville],
              ['Reçu le',        new Date(selected.createdAt).toLocaleDateString('fr-FR', { dateStyle: 'long' })],
            ] as const).filter(([, value]) => value).map(([label, value]) => (
              <div key={label} className="flex justify-between gap-2">
                <span className="text-cream/40 text-xs">{label}</span>
                <span className="text-cream text-xs text-right">{value}</span>
              </div>
            ))}
          </div>

          {([
            ['Toiture souhaitée', selected.toiture],
            ['Finition / bois', selected.finitionBois],
            ['Description', selected.description],
          ] as const).filter(([, value]) => value).map(([label, value]) => (
            <div key={label} className="border-t border-cream/5 pt-4 mb-4">
              <p className="text-cream/40 text-xs mb-1">{label}</p>
              <p className="text-cream/70 text-xs leading-relaxed whitespace-pre-line">{value}</p>
            </div>
          ))}

          {/* Changer le statut */}
          <div className="border-t border-cream/5 pt-4">
            <p className="text-cream/40 text-xs tracking-widest uppercase mb-2">Statut</p>
            <select
              value={selected.statut}
              onChange={e => updateStatut(selected.id, e.target.value)}
              className="form-input text-xs"
            >
              {STATUTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Notes internes */}
          <div className="border-t border-cream/5 pt-4 mt-4">
            <p className="text-cream/40 text-xs tracking-widest uppercase mb-2">Notes internes</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={4}
              placeholder="Visite prévue, prix proposé, relance…"
              className="form-input text-xs w-full"
            />
            <button
              type="button"
              onClick={saveNotes}
              disabled={notesState === 'saving'}
              className="btn-outline text-xs w-full mt-2"
            >
              {notesState === 'saving' ? 'Enregistrement…' : notesState === 'saved' ? '✓ Notes enregistrées' : 'Enregistrer les notes'}
            </button>
          </div>

          {/* Répondre par email */}
          <a
            href={`mailto:${selected.email}?subject=Votre demande de devis OliWood&body=Bonjour ${selected.prenom},%0D%0A%0D%0A`}
            className="btn-outline text-xs w-full text-center mt-3 block"
          >
            Répondre par email
          </a>

          {selected.telephone && (
            <a href={`tel:${selected.telephone.replace(/\s/g, '')}`} className="btn-outline text-xs w-full text-center mt-2 block">
              Appeler {selected.telephone}
            </a>
          )}

          <button
            type="button"
            onClick={() => deleteDevis(selected.id)}
            className="w-full text-center mt-3 text-[0.65rem] tracking-widest uppercase text-cream/30 hover:text-red-400"
          >
            Supprimer la demande
          </button>
        </div>
      )}
    </div>
  )
}
