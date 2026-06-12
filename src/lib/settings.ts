import { prisma } from './prisma'

export async function getSiteSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: 'singleton' } })
  } catch {
    return null
  }
}
