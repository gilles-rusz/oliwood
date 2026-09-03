import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { prisma } from '@/lib/prisma'

/**
 * Meta signe chaque livraison avec l'App Secret. Sans cette vérification,
 * n'importe qui pourrait publier des photos dans la galerie.
 */
function hasValidSignature(rawBody: string, header: string | null) {
  const secret = process.env.META_APP_SECRET
  if (!secret || !header?.startsWith('sha256=')) return false

  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawBody).digest('hex')
  const received = Buffer.from(header)
  const computed = Buffer.from(expected)
  return received.length === computed.length && crypto.timingSafeEqual(received, computed)
}

interface FacebookFeedChange {
  field?: string
  value?: {
    item?: string
    photo_id?: string
    message?: string
  }
}

interface FacebookWebhookBody {
  object?: string
  entry?: Array<{ changes?: FacebookFeedChange[] }>
}

// GET — vérification du webhook par Meta
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mode      = searchParams.get('hub.mode')
  const token     = searchParams.get('hub.verify_token')
  const challenge = searchParams.get('hub.challenge')

  if (mode === 'subscribe' && token === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 })
  }
  return NextResponse.json({ error: 'Token invalide' }, { status: 403 })
}

// POST — réception des nouvelles photos publiées
export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  if (!hasValidSignature(rawBody, req.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 401 })
  }

  let body: FacebookWebhookBody
  try {
    body = JSON.parse(rawBody)
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  // Vérifier que c'est bien un événement de page
  if (body.object !== 'page') {
    return NextResponse.json({ ok: true })
  }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      // Nouvelle photo publiée sur la Page
      if (change.field === 'feed' && change.value?.item === 'photo') {
        const { photo_id, message } = change.value
        if (!photo_id) continue

        // Éviter les doublons
        const exists = await prisma.realisation.findUnique({
          where: { externalId: String(photo_id) },
        })
        if (exists) continue

        // Récupérer l'URL de la photo via l'API Graph
        const photoUrl = await fetchFacebookPhotoUrl(photo_id)
        if (!photoUrl) continue

        await prisma.realisation.create({
          data: {
            title:      message?.slice(0, 80) || 'Photo Facebook',
            description: message || null,
            imageUrl:   photoUrl,
            thumbUrl:   photoUrl,
            source:     'FACEBOOK',
            externalId: String(photo_id),
            published:  true,   // auto-publié — peut être mis false pour modération
          },
        })
      }
    }
  }

  return NextResponse.json({ ok: true })
}

async function fetchFacebookPhotoUrl(photoId: string): Promise<string | null> {
  const token = process.env.META_PAGE_ACCESS_TOKEN
  if (!token) return null

  try {
    const res  = await fetch(`https://graph.facebook.com/${photoId}?fields=images&access_token=${token}`)
    const data = await res.json()
    // Prendre l'image la plus grande
    const images = data.images as Array<{ source: string; width: number }>
    if (!images?.length) return null
    return images.sort((a, b) => b.width - a.width)[0].source
  } catch {
    return null
  }
}
