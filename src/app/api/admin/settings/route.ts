import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { seasonalTheme, seasonalActive } = await req.json()

  await prisma.siteSettings.upsert({
    where:  { id: 'singleton' },
    update: { seasonalTheme, seasonalActive },
    create: { id: 'singleton', seasonalTheme, seasonalActive },
  })

  return NextResponse.json({ ok: true })
}
