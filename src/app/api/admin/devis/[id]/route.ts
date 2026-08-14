import { NextRequest, NextResponse } from 'next/server'
import { isAdminAuthorized } from '@/lib/adminSession'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!await isAdminAuthorized()) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

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
