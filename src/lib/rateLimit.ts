// Rate limiter simple en mémoire
// Pour production avec plusieurs instances, remplacer par Redis/Upstash

const store = new Map<string, { count: number; resetAt: number }>()

export async function rateLimit(
  identifier: string,
  action: string,
  maxRequests: number,
  windowMs: number
): Promise<boolean> {
  const key     = `${action}:${identifier}`
  const now     = Date.now()
  const entry   = store.get(key)

  if (!entry || entry.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return false // pas limité
  }

  if (entry.count >= maxRequests) return true // limité

  entry.count++
  return false
}
