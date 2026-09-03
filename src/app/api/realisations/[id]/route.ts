import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MAX_FEATURED } from '@/lib/gallery'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const data: Record<string, unknown> = {}
  for (const key of ['title', 'description', 'category', 'published', 'featured', 'order'] as const) {
    if (body[key] !== undefined) data[key] = body[key]
  }

  if (data.featured === true) {
    const alreadyFeatured = await prisma.realisation.count({
      where: { featured: true, id: { not: params.id } },
    })
    if (alreadyFeatured >= MAX_FEATURED) {
      return NextResponse.json(
        { error: `${MAX_FEATURED} photos sont déjà épinglées. Retirez-en une avant d'en ajouter une autre.` },
        { status: 409 },
      )
    }
  }

  const realisation = await prisma.realisation.update({
    where: { id: params.id },
    data,
  })

  return NextResponse.json({ realisation })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await prisma.realisation.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}
