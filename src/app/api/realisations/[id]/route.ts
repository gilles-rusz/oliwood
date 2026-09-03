import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MAX_FEATURED } from '@/lib/gallery'
import { z } from 'zod'

const CATEGORIES = [
  'CHARPENTE', 'TERRASSE', 'PERGOLA', 'CARPORT', 'OSSATURE_BOIS',
  'CABANE', 'RENOVATION', 'AVANT_APRES', 'AUTRE',
] as const

const schema = z.object({
  title:       z.string().min(1).max(120).optional(),
  description: z.string().max(2000).nullable().optional(),
  category:    z.enum(CATEGORIES).optional(),
  published:   z.boolean().optional(),
  featured:    z.boolean().optional(),
  order:       z.number().int().min(0).max(9999).optional(),
})

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const parsed = schema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }
  const data: Record<string, unknown> = parsed.data
  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: 'Aucune modification demandée.' }, { status: 400 })
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
