import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/siteUrl'

const PATHS = [
  { path: '/', priority: 1 },
  { path: '/realisations', priority: 0.9 },
  { path: '/a-propos', priority: 0.7 },
  { path: '/devis', priority: 0.8 },
  { path: '/mentions-legales', priority: 0.2 },
  { path: '/politique-confidentialite', priority: 0.2 },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return PATHS.map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority,
  }))
}
