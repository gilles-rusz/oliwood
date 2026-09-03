import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  statut: z.enum(['NOUVEAU', 'VU', 'EN_COURS', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'ARCHIVE']).optional(),
  notes:  z.string().max(5000).nullable().optional(),
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
  const { statut, notes } = parsed.data

  const devis = await prisma.devis.update({
    where: { id: params.id },
    data: {
      ...(statut && { statut }),
      ...(notes !== undefined && { notes }),
    },
  })

  return NextResponse.json({ devis })
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  await prisma.devis.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
}
