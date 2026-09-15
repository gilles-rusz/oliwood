import webpush from 'web-push'
import { prisma } from '@/lib/prisma'
import type { Devis } from '@prisma/client'

const SUBJECT = 'mailto:contact@oliwood.fr'

/**
 * Paire de clés VAPID du site, générée à la première utilisation et conservée
 * en base : aucune variable d'environnement à configurer côté hébergeur.
 */
export async function getPushConfig() {
  const existing = await prisma.pushConfig.findUnique({ where: { id: 'singleton' } })
  if (existing) return existing

  const keys = webpush.generateVAPIDKeys()
  return prisma.pushConfig.create({
    data: { id: 'singleton', publicKey: keys.publicKey, privateKey: keys.privateKey },
  })
}

const TYPE_LABELS: Record<string, string> = {
  CHARPENTE: 'Charpente',
  TERRASSE: 'Terrasse',
  PERGOLA: 'Pergola',
  CARPORT: 'Carport',
  CABANE: 'Cabane',
  RENOVATION: 'Rénovation',
  AUTRE: 'Autre projet',
}

/** Notifie tous les appareils abonnés qu'une demande de devis vient d'arriver. */
export async function sendDevisPush(devis: Devis) {
  const subscriptions = await prisma.pushSubscription.findMany()
  if (subscriptions.length === 0) return

  const config = await getPushConfig()
  webpush.setVapidDetails(SUBJECT, config.publicKey, config.privateKey)

  const projet = TYPE_LABELS[devis.typeProjet] ?? 'Projet bois'
  const payload = JSON.stringify({
    title: 'Nouvelle demande de devis',
    body: `${devis.prenom} ${devis.nom} — ${projet}${devis.ville ? ` (${devis.ville})` : ''}`,
    url: '/admin/devis',
  })

  const results = await Promise.allSettled(
    subscriptions.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload,
      ),
    ),
  )

  // Un appareil qui a désinstallé l'application renvoie 404/410 : on nettoie.
  const stale = results.flatMap((result, index) =>
    result.status === 'rejected' &&
    [404, 410].includes((result.reason as { statusCode?: number }).statusCode ?? 0)
      ? [subscriptions[index].endpoint]
      : [],
  )

  if (stale.length > 0) {
    await prisma.pushSubscription.deleteMany({ where: { endpoint: { in: stale } } })
  }
}
