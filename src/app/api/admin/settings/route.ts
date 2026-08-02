import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isSeasonalTheme } from '@/lib/seasonal'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })

  return NextResponse.json({
    seasonalTheme:  settings?.seasonalTheme  ?? null,
    seasonalActive: settings?.seasonalActive ?? false,
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { seasonalTheme, seasonalActive } = await req.json()

  if ((seasonalTheme !== null && !isSeasonalTheme(seasonalTheme)) || typeof seasonalActive !== 'boolean') {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }

  await prisma.siteSettings.upsert({
    where:  { id: 'singleton' },
    update: { seasonalTheme, seasonalActive },
    create: { id: 'singleton', seasonalTheme, seasonalActive },
  })

  // Les pages publiques sont statiques : on invalide le layout pour que le
  // décor saisonnier apparaisse immédiatement côté visiteurs.
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
