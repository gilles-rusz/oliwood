'use client'

import { useCallback, useEffect, useState } from 'react'

type Status = 'loading' | 'unsupported' | 'blocked' | 'off' | 'on'

function urlBase64ToUint8Array(base64: string) {
  const padded = (base64 + '='.repeat((4 - (base64.length % 4)) % 4))
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  const raw = atob(padded)
  return Uint8Array.from(raw, char => char.charCodeAt(0))
}

export function AdminPushToggle() {
  const [status, setStatus] = useState<Status>('loading')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const supported = useCallback(
    () =>
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      'PushManager' in window &&
      'Notification' in window,
    [],
  )

  useEffect(() => {
    if (!supported()) {
      setStatus('unsupported')
      return
    }

    let cancelled = false

    ;(async () => {
      const registration = await navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' })
      const subscription = await registration.pushManager.getSubscription()
      if (cancelled) return

      if (Notification.permission === 'denied') {
        setStatus('blocked')
        return
      }
      setStatus(subscription ? 'on' : 'off')
    })().catch(() => {
      if (!cancelled) setStatus('unsupported')
    })

    return () => {
      cancelled = true
    }
  }, [supported])

  async function enable() {
    setBusy(true)
    setMessage(null)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'blocked' : 'off')
        return
      }

      const registration = await navigator.serviceWorker.register('/admin-sw.js', { scope: '/admin' })
      const { publicKey } = await (await fetch('/api/admin/push')).json()

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      })

      const res = await fetch('/api/admin/push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription.toJSON()),
      })
      if (!res.ok) {
        await subscription.unsubscribe()
        setMessage("L'activation a échoué, réessayez dans un instant.")
        return
      }

      setStatus('on')
      setMessage('Notifications activées sur cet appareil.')
    } catch {
      setMessage("L'activation a échoué, réessayez dans un instant.")
    } finally {
      setBusy(false)
    }
  }

  async function disable() {
    setBusy(true)
    setMessage(null)
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.getSubscription()
      if (subscription) {
        await fetch(`/api/admin/push?endpoint=${encodeURIComponent(subscription.endpoint)}`, {
          method: 'DELETE',
        })
        await subscription.unsubscribe()
      }
      setStatus('off')
    } catch {
      setMessage('Désactivation impossible, réessayez.')
    } finally {
      setBusy(false)
    }
  }

  async function test() {
    setBusy(true)
    setMessage(null)
    try {
      const res = await fetch('/api/admin/push', { method: 'PUT' })
      const data = await res.json().catch(() => ({}))
      setMessage(res.ok ? 'Notification de test envoyée.' : (data.error ?? 'Envoi impossible.'))
    } catch {
      setMessage('Envoi impossible, vérifiez votre connexion.')
    } finally {
      setBusy(false)
    }
  }

  if (status === 'loading') return null

  if (status === 'unsupported') {
    return (
      <p className="text-cream/40 text-xs">
        Les notifications ne sont pas disponibles sur ce navigateur. Sur iPhone, ajoutez d’abord
        l’admin à l’écran d’accueil via le bouton Partager de Safari.
      </p>
    )
  }

  if (status === 'blocked') {
    return (
      <p className="text-cream/40 text-xs">
        Notifications bloquées dans les réglages du navigateur pour ce site : autorisez-les puis
        rechargez la page.
      </p>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status === 'on' ? (
        <>
          <span className="text-green-400 text-xs">Notifications activées sur cet appareil</span>
          <button
            onClick={test}
            disabled={busy}
            className="text-cream/60 hover:text-cream text-xs underline disabled:opacity-50"
          >
            Envoyer un test
          </button>
          <button
            onClick={disable}
            disabled={busy}
            className="text-cream/40 hover:text-cream text-xs underline disabled:opacity-50"
          >
            Désactiver
          </button>
        </>
      ) : (
        <button
          onClick={enable}
          disabled={busy}
          className="text-[0.6rem] px-3 py-1.5 border border-wood-400/30 text-wood-400 hover:bg-wood-400/10 tracking-widest uppercase disabled:opacity-50"
        >
          {busy ? 'Activation…' : 'Activer les notifications sur cet appareil'}
        </button>
      )}
      {message && <span className="text-cream/50 text-xs">{message}</span>}
    </div>
  )
}
