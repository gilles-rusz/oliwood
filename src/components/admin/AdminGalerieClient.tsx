'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { Realisation } from '@prisma/client'
import { clsx } from 'clsx'

const CATEGORIES = [
  { value: 'CARPORT',  label: 'Carport & Abris' },
  { value: 'TERRASSE', label: 'Terrasse' },
  { value: 'PERGOLA',  label: 'Pergola' },
  { value: 'AUTRE',    label: 'Autres' },
] as const

function categoryLabel(value: string) {
  return CATEGORIES.find(c => c.value === value)?.label ?? value
}

interface Props {
  realisations: Realisation[]
}

export function AdminGalerieClient({ realisations: initial }: Props) {
  const [photos, setPhotos]       = useState<Realisation[]>(initial)
  const [uploading, setUploading] = useState(false)
  const [form, setForm]           = useState({ title: '', category: 'TERRASSE' as string, description: '', featured: false })
  const [editing, setEditing]     = useState<Realisation | null>(null)
  const [saving, setSaving]       = useState(false)
  const fileRef                   = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', form.title || file.name.replace(/\.\w+$/, ''))
      fd.append('category', form.category)
      fd.append('description', form.description)
      fd.append('featured', String(form.featured))

      const res  = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.realisation) {
        setPhotos(prev => [data.realisation, ...prev])
        setForm({ title: '', category: 'TERRASSE', description: '', featured: false })
      }
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  async function togglePublished(id: string, current: boolean) {
    await fetch(`/api/realisations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !current }),
    })
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, published: !current } : p))
  }

  async function deletePhoto(id: string) {
    if (!confirm('Supprimer cette photo ?')) return
    await fetch(`/api/realisations/${id}`, { method: 'DELETE' })
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  async function saveEdit() {
    if (!editing) return
    setSaving(true)
    try {
      const res = await fetch(`/api/realisations/${editing.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title:       editing.title,
          category:    editing.category,
          description: editing.description,
          featured:    editing.featured,
        }),
      })
      const data = await res.json()
      if (data.realisation) {
        setPhotos(prev => prev.map(p => p.id === editing.id ? data.realisation : p))
        setEditing(null)
      }
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      {/* Upload form */}
      <div className="bg-dark-800 border border-cream/5 border-dashed p-6 mb-8">
        <p className="text-xs tracking-widest uppercase text-cream/40 mb-4">Ajouter une photo</p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">Titre</label>
            <input
              className="form-input"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex : Terrasse pin maritime"
            />
          </div>
          <div>
            <label className="form-label">Catégorie</label>
            <select
              className="form-input"
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>
        <div className="mb-4">
          <label className="form-label">Description courte</label>
          <input
            className="form-input"
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Ex : Structure en douglas, toiture bac acier."
          />
        </div>
        <label className="flex items-center gap-2 mb-4 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={e => setForm(f => ({ ...f, featured: e.target.checked }))}
            className="accent-jaune"
          />
          <span className="text-cream/60 text-xs tracking-widest uppercase">Mettre en avant</span>
        </label>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          id="photo-upload"
        />
        <label
          htmlFor="photo-upload"
          className={clsx('btn-outline text-xs cursor-pointer', uploading && 'opacity-50 pointer-events-none')}
        >
          {uploading ? 'Envoi en cours…' : '+ Choisir une photo'}
        </label>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {photos.map((p) => (
          <div key={p.id} className={clsx('relative group', !p.published && 'opacity-50')}>
            <div className="aspect-[4/3] relative overflow-hidden bg-dark-700">
              <Image
                src={p.thumbUrl || p.imageUrl}
                alt={p.title}
                fill
                className="object-cover"
                sizes="(max-width:1024px) 50vw, 33vw"
              />
              {/* Source badge */}
              {p.source !== 'MANUAL' && (
                <span className="absolute top-2 left-2 text-[0.6rem] bg-dark-900/80 text-jaune px-2 py-0.5 tracking-widest uppercase">
                  {p.source}
                </span>
              )}
              {p.featured && (
                <span className="absolute top-2 right-2 text-[0.6rem] bg-jaune text-brun px-2 py-0.5 tracking-widest uppercase font-medium">
                  ★ En avant
                </span>
              )}
            </div>
            <div className="mt-2 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <p className="text-cream text-xs font-medium truncate">{p.title}</p>
                <p className="text-cream/30 text-[0.6rem] tracking-widest">{categoryLabel(p.category)}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditing(p)}
                  className="text-[0.6rem] px-2 py-1 border border-cream/10 text-cream/40 hover:text-cream hover:border-cream/30"
                  title="Modifier"
                >
                  ✎
                </button>
                <button
                  onClick={() => togglePublished(p.id, p.published)}
                  className="text-[0.6rem] px-2 py-1 border border-cream/10 text-cream/40 hover:text-cream hover:border-cream/30"
                  title={p.published ? 'Masquer' : 'Publier'}
                >
                  {p.published ? '●' : '○'}
                </button>
                <button
                  onClick={() => deletePhoto(p.id)}
                  className="text-[0.6rem] px-2 py-1 border border-red-400/10 text-red-400/40 hover:text-red-400 hover:border-red-400/40"
                  title="Supprimer"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal d'édition */}
      {editing && (
        <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div
            className="bg-dark-800 border border-cream/10 p-6 w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <p className="text-xs tracking-widest uppercase text-cream/40 mb-4">Modifier la réalisation</p>

            <div className="mb-4">
              <label className="form-label">Titre</label>
              <input
                className="form-input"
                value={editing.title}
                onChange={e => setEditing(prev => prev ? { ...prev, title: e.target.value } : prev)}
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Catégorie</label>
              <select
                className="form-input"
                value={editing.category}
                onChange={e => setEditing(prev => prev ? { ...prev, category: e.target.value as Realisation['category'] } : prev)}
              >
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>

            <div className="mb-4">
              <label className="form-label">Description courte</label>
              <input
                className="form-input"
                value={editing.description ?? ''}
                onChange={e => setEditing(prev => prev ? { ...prev, description: e.target.value } : prev)}
              />
            </div>

            <label className="flex items-center gap-2 mb-6 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={editing.featured}
                onChange={e => setEditing(prev => prev ? { ...prev, featured: e.target.checked } : prev)}
                className="accent-jaune"
              />
              <span className="text-cream/60 text-xs tracking-widest uppercase">Mettre en avant</span>
            </label>

            <div className="flex gap-2">
              <button onClick={() => setEditing(null)} className="btn-outline text-xs flex-1" disabled={saving}>
                Annuler
              </button>
              <button onClick={saveEdit} className="btn-primary text-xs flex-1" disabled={saving}>
                {saving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
