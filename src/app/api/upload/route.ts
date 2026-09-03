import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/prisma'
import { MAX_FEATURED } from '@/lib/gallery'
import { v4 as uuidv4 } from 'uuid'
import type { Category } from '@prisma/client'

const CATEGORIES = [
  'CHARPENTE', 'TERRASSE', 'PERGOLA', 'CARPORT', 'OSSATURE_BOIS',
  'CABANE', 'RENOVATION', 'AVANT_APRES', 'AUTRE',
] as const

const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'avif']

function supabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const supabase = supabaseClient()
  if (!supabase) {
    return NextResponse.json({ error: 'Stockage Supabase non configuré' }, { status: 503 })
  }

  const formData = await req.formData()
  const file     = formData.get('file') as File | null
  const title    = formData.get('title')    as string
  const rawCategory = String(formData.get('category') ?? '')
  const category = (CATEGORIES as readonly string[]).includes(rawCategory)
    ? rawCategory as Category
    : 'AUTRE'
  const description = formData.get('description') as string
  let featured = formData.get('featured') === 'true'

  if (!file) return NextResponse.json({ error: 'Pas de fichier' }, { status: 400 })

  // Vérification type MIME
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Fichier image requis' }, { status: 400 })
  }

  // Limite taille 10 Mo
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'Fichier trop volumineux (max 10 Mo)' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return NextResponse.json({ error: 'Format accepté : JPG, PNG, WebP ou AVIF' }, { status: 400 })
  }
  const filename = `${uuidv4()}.${ext}`
  const buffer   = Buffer.from(await file.arrayBuffer())

  // Upload vers Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('realisations')
    .upload(filename, buffer, { contentType: file.type, upsert: false })

  if (uploadError) {
    console.error('[Upload] Supabase error:', uploadError)
    return NextResponse.json({ error: 'Erreur upload' }, { status: 500 })
  }

  const { data: { publicUrl } } = supabase.storage.from('realisations').getPublicUrl(filename)

  if (featured) {
    const alreadyFeatured = await prisma.realisation.count({ where: { featured: true } })
    if (alreadyFeatured >= MAX_FEATURED) featured = false
  }

  // Créer l'entrée en base
  const realisation = await prisma.realisation.create({
    data: {
      title:       (title || filename).slice(0, 120),
      category,
      description: description || null,
      imageUrl:    publicUrl,
      thumbUrl:    publicUrl,
      source:      'MANUAL',
      published:   true,
      featured,
    },
  })

  return NextResponse.json({ realisation })
}
