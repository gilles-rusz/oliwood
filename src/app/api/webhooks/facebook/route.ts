import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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
  const body = await req.json()

  // Vérifier que c'est bien un événement de page
  if (body.object !== 'page') {
    return NextResponse.json({ ok: true })
  }

  for (const entry of body.entry ?? []) {
    for (const change of entry.changes ?? []) {
      // Nouvelle photo publiée sur la Page
      if (change.field === 'feed' && change.value?.item === 'photo') {
        const { photo_id, photos, message } = change.value

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
