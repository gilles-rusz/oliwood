'use client'

import { useEffect, useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const EMAIL_STORAGE_KEY = 'oliwood.admin.email'

interface AdminStatus {
  databaseReachable: boolean
  hasAdmin: boolean
  hasEnvAdmin: boolean
  hasAuthSecret: boolean
}

export default function AdminLoginPage() {
  const router                  = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(true)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [status, setStatus]     = useState<AdminStatus | null>(null)

  useEffect(() => {
    getSession().then(session => {
      if (session) router.replace('/admin/dashboard')
    })

    const saved = window.localStorage.getItem(EMAIL_STORAGE_KEY)
    if (saved) setEmail(saved)

    fetch('/api/admin/status')
      .then(res => (res.ok ? res.json() : null))
      .then(setStatus)
      .catch(() => setStatus(null))
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email: email.trim(), password, redirect: false,
    })

    if (res?.ok) {
      if (remember) window.localStorage.setItem(EMAIL_STORAGE_KEY, email.trim())
      else window.localStorage.removeItem(EMAIL_STORAGE_KEY)
      router.push('/admin/dashboard')
      return
    }

    if (status && !status.databaseReachable) {
      setError('La base de données est injoignable : la connexion est impossible pour le moment.')
    } else if (status && !status.hasAdmin && !status.hasEnvAdmin) {
      setError("Aucun compte administrateur n'existe encore. Crée-le avec « npm run admin:create » ou renseigne ADMIN_EMAIL / ADMIN_PASSWORD.")
    } else {
      setError('Email ou mot de passe incorrect.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <p className="font-display text-3xl font-bold">
            <span className="text-wood-400">Oli</span>
            <span className="text-cream">Wood</span>
          </p>
          <p className="text-cream/40 text-xs tracking-widest uppercase mt-2">Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="form-label" htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              autoComplete="username"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="admin-password">Mot de passe</label>
            <div className="relative">
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input pr-16"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] tracking-widest uppercase text-cream/40 hover:text-cream"
              >
                {showPassword ? 'Cacher' : 'Voir'}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-xs text-cream/50 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              className="accent-wood-400"
            />
            Retenir mon email sur cet appareil
          </label>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>

          <p className="text-cream/30 text-xs text-center">
            La connexion reste active 30 jours sur cet appareil.
          </p>
        </form>
      </div>
    </div>
  )
}
