import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { put, del } from '@vercel/blob'

export const STORAGE_BUCKET = 'realisations'

const SUPABASE_PUBLIC_PREFIX = `/storage/v1/object/public/${STORAGE_BUCKET}/`
const BLOB_HOSTNAME_SUFFIX = '.public.blob.vercel-storage.com'

export function storageClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

function blobConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN)
}

/** Chemin de l'objet dans le bucket Supabase, ou null si l'URL ne vient pas de Supabase Storage. */
export function storagePathFromUrl(imageUrl: string | null | undefined): string | null {
  if (!imageUrl) return null
  const index = imageUrl.indexOf(SUPABASE_PUBLIC_PREFIX)
  if (index === -1) return null
  const path = imageUrl.slice(index + SUPABASE_PUBLIC_PREFIX.length).split('?')[0]
  return path ? decodeURIComponent(path) : null
}

function isBlobUrl(imageUrl: string | null | undefined): boolean {
  if (!imageUrl) return false
  try {
    return new URL(imageUrl).hostname.endsWith(BLOB_HOSTNAME_SUFFIX)
  } catch {
    return false
  }
}

export function storageConfigured(): boolean {
  return blobConfigured() || storageClient() !== null
}

/** Envoie le fichier sur Vercel Blob, avec repli sur Supabase Storage, et renvoie l'URL publique. */
export async function uploadImage(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<{ url: string } | { error: string }> {
  if (blobConfigured()) {
    try {
      const { url } = await put(`${STORAGE_BUCKET}/${filename}`, buffer, {
        access: 'public',
        contentType,
        addRandomSuffix: false,
      })
      return { url }
    } catch (error) {
      console.error('[Storage] Vercel Blob upload error:', error)
      return { error: 'Erreur upload' }
    }
  }

  const supabase = storageClient()
  if (!supabase) return { error: 'non_configure' }

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(filename, buffer, { contentType, upsert: false })

  if (uploadError) {
    console.error('[Storage] Supabase upload error:', uploadError)
    return { error: 'Erreur upload' }
  }

  const { data: { publicUrl } } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename)
  return { url: publicUrl }
}

/** Supprime les fichiers correspondants, qu'ils soient sur Vercel Blob ou sur Supabase Storage. */
export async function deleteImages(urls: (string | null | undefined)[]): Promise<void> {
  const unique = Array.from(new Set(urls.filter((url): url is string => Boolean(url))))

  const blobUrls = unique.filter(isBlobUrl)
  if (blobUrls.length > 0) {
    try {
      await del(blobUrls)
    } catch (error) {
      console.error('[Storage] Suppression Vercel Blob échouée:', error)
    }
  }

  const supabasePaths = unique
    .map(storagePathFromUrl)
    .filter((path): path is string => path !== null)
  if (supabasePaths.length > 0) {
    const supabase = storageClient()
    if (supabase) {
      const { error } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove(Array.from(new Set(supabasePaths)))
      if (error) console.error('[Storage] Suppression Supabase échouée:', error)
    }
  }
}
