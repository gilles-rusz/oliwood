import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { statut, notes } = await req.json()

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
