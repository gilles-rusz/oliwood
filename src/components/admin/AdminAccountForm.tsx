'use client'

import { useState } from 'react'
import { signOut } from 'next-auth/react'

const MIN_PASSWORD_LENGTH = 10

export function AdminAccountForm({ email }: { email: string }) {
  const [newEmail, setNewEmail]               = useState(email)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving]                   = useState(false)
  const [error, setError]                     = useState<string | null>(null)
  const [done, setDone]                       = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword && newPassword !== confirmPassword) {
      setError('Les deux nouveaux mots de passe ne correspondent pas.')
      return
    }
    if (newPassword && newPassword.trim().length < MIN_PASSWORD_LENGTH) {
      setError(`Le nouveau mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.`)
      return
    }
    if (!newPassword && newEmail.trim().toLowerCase() === email.toLowerCase()) {
      setError('Aucune modification à enregistrer.')
      return
    }

    setSaving(true)
    try {
      const res  = await fetch('/api/admin/account', {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ currentPassword, newPassword, newEmail: newEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Enregistrement impossible.')
        return
      }
      setDone(true)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      if (data.emailChanged) {
        setTimeout(() => signOut({ callbackUrl: '/admin/login' }), 2500)
      }
    } catch {
      setError('Enregistrement impossible, vérifie ta connexion.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-dark-800 border border-cream/5 p-6 space-y-5">
      <div>
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-1">Identifiants de connexion</h2>
        <p className="text-cream/50 text-xs">
          Connecté en tant que <strong className="text-cream/80">{email}</strong>. Le mot de passe
          actuel est demandé pour valider toute modification.
        </p>
      </div>

      <div>
        <label className="form-label" htmlFor="account-email">Email de connexion</label>
        <input
          id="account-email"
          type="email"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          className="form-input"
          autoComplete="username"
          required
        />
      </div>

      <div>
        <label className="form-label" htmlFor="account-current">Mot de passe actuel</label>
        <input
          id="account-current"
          type="password"
          value={currentPassword}
          onChange={e => setCurrentPassword(e.target.value)}
          className="form-input"
          autoComplete="current-password"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="form-label" htmlFor="account-new">Nouveau mot de passe</label>
          <input
            id="account-new"
            type="password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            className="form-input"
            autoComplete="new-password"
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="account-confirm">Confirmer</label>
          <input
            id="account-confirm"
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="form-input"
            autoComplete="new-password"
          />
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {done && (
        <p className="text-green-400 text-sm">
          Modifications enregistrées.
          {newEmail.trim().toLowerCase() !== email.toLowerCase() && ' Reconnexion nécessaire avec le nouvel email…'}
        </p>
      )}

      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? 'Enregistrement…' : 'Enregistrer'}
      </button>
    </form>
  )
}
