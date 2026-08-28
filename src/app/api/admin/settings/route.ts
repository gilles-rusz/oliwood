import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { isSeasonalTheme } from '@/lib/seasonal'

const TEXT_FIELDS = [
  'heroTitle', 'heroSubtitle', 'metaDescription', 'telephone', 'email', 'adresse',
] as const

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const settings = await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })

  return NextResponse.json({
    seasonalTheme:  settings?.seasonalTheme  ?? null,
    seasonalActive: settings?.seasonalActive ?? false,
    ...Object.fromEntries(TEXT_FIELDS.map(field => [field, settings?.[field] ?? ''])),
  })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await req.json()
  const { seasonalTheme, seasonalActive } = body

  if ((seasonalTheme !== null && !isSeasonalTheme(seasonalTheme)) || typeof seasonalActive !== 'boolean') {
    return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
  }

  const texts: Record<string, string | null> = {}
  for (const field of TEXT_FIELDS) {
    if (body[field] === undefined) continue
    if (typeof body[field] !== 'string') {
      return NextResponse.json({ error: 'Paramètres invalides' }, { status: 400 })
    }
    texts[field] = body[field].trim() || null
  }

  await prisma.siteSettings.upsert({
    where:  { id: 'singleton' },
    update: { seasonalTheme, seasonalActive, ...texts },
    create: { id: 'singleton', seasonalTheme, seasonalActive, ...texts },
  })

  // Les pages publiques sont statiques : on invalide le layout pour que le
  // décor saisonnier et les textes apparaissent immédiatement côté visiteurs.
  revalidatePath('/', 'layout')

  return NextResponse.json({ ok: true })
}
