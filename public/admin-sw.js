// Service worker de l'application admin : notifications des demandes de devis.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()))

self.addEventListener('push', event => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = {}
  }

  const title = data.title || 'Oli\u2019Wood'
  const url = data.url || '/admin/devis'

  event.waitUntil(
    self.registration.showNotification(title, {
      body: data.body || 'Nouvelle activité sur votre espace admin.',
      icon: '/icons/admin-192.png',
      badge: '/icons/admin-192.png',
      tag: 'oliwood-devis',
      data: { url },
    }),
  )
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  const url = (event.notification.data && event.notification.data.url) || '/admin/devis'

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      const existing = clients.find(client => client.url.includes('/admin'))
      if (existing) {
        existing.focus()
        return existing.navigate(url)
      }
      return self.clients.openWindow(url)
    }),
  )
})
