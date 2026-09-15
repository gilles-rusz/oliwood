import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getPushConfig, sendDevisPush } from '@/lib/push'
import { z } from 'zod'

const schema = z.object({
  endpoint: z.string().url().max(1000),
  keys: z.object({
    p256dh: z.string().min(1).max(500),
    auth: z.string().min(1).max(500),
  }),
})

/** Clé publique VAPID + état de l'abonnement de cet appareil. */
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const config = await getPushConfig()
  const endpoint = req.nextUrl.searchParams.get('endpoint')
  const subscribed = endpoint
    ? (await prisma.pushSubscription.count({ where: { endpoint } })) > 0
    : false

  return NextResponse.json({ publicKey: config.publicKey, subscribed })
}

/** Enregistre l'appareil (ou met à jour ses clés si l'abonnement a été renouvelé). */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Abonnement invalide' }, { status: 400 })
  }

  const { endpoint, keys } = parsed.data
  await prisma.pushSubscription.upsert({
    where: { endpoint },
    create: {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: req.headers.get('user-agent')?.slice(0, 300) ?? null,
    },
    update: { p256dh: keys.p256dh, auth: keys.auth },
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const endpoint = req.nextUrl.searchParams.get('endpoint')
  if (!endpoint) return NextResponse.json({ error: 'Abonnement invalide' }, { status: 400 })

  await prisma.pushSubscription.deleteMany({ where: { endpoint } })
  return NextResponse.json({ ok: true })
}

/** Notification de test, pour vérifier l'installation sur le téléphone. */
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const devis = await prisma.devis.findFirst({ orderBy: { createdAt: 'desc' } })
  if (!devis) {
    return NextResponse.json({ error: 'Aucune demande de devis à utiliser pour le test.' }, { status: 404 })
  }

  await sendDevisPush(devis)
  return NextResponse.json({ ok: true })
}
