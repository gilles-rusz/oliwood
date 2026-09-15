import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const STORAGE_BUCKET = 'realisations'

const PUBLIC_PREFIX = `/storage/v1/object/public/${STORAGE_BUCKET}/`

export function storageClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

/** Chemin de l'objet dans le bucket, ou null si l'URL ne vient pas de Supabase Storage. */
export function storagePathFromUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  const index = imageUrl.indexOf(PUBLIC_PREFIX)
  if (index === -1) return null
  const path = imageUrl.slice(index + PUBLIC_PREFIX.length).split('?')[0]
  return path ? decodeURIComponent(path) : null
}
