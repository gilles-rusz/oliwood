'use client'

import { useEffect, useState } from 'react'
import { getSession, signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router          = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  useEffect(() => {
    getSession().then(session => {
      if (session) router.replace('/admin/dashboard')
    })
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      email, password, redirect: false,
    })

    // NextAuth renvoie parfois ok: true avec une erreur de credentials :
    // c'est `error` qui fait foi.
    if (res?.error) {
      setError('Email ou mot de passe incorrect.')
      setLoading(false)
      return
    }

    router.replace('/admin/dashboard')
    router.refresh()
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
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              autoComplete="email"
              required
            />
          </div>
          <div>
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full mt-2" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
