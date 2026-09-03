import { prisma } from './prisma'
import type { Category } from '@prisma/client'

interface GetRealisationsOptions {
  category?: string
  featured?: boolean
  published?: boolean
  limit?: number
}

export async function getRealisations(opts: GetRealisationsOptions = {}) {
  const { category, featured, published, limit } = opts

  try {
    return await prisma.realisation.findMany({
      where: {
        ...(category && { category: category as Category }),
        ...(featured !== undefined && { featured }),
        ...(published !== undefined && { published }),
      },
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      take: limit,
    })
  } catch {
    return []
  }
}
