import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const MIN_PASSWORD_LENGTH = 10

export interface AdminIdentity {
  id: string
  email: string
}

function envEmail() {
  return process.env.ADMIN_EMAIL?.toLowerCase().trim() || null
}

/**
 * Compte de secours défini par variables d'environnement : permet d'ouvrir le
 * back-office sur un nouvel environnement (Vercel, préproduction) sans avoir à
 * lancer un script en ligne de commande sur la base de données.
 */
async function matchesEnvAdmin(email: string, password: string) {
  const expectedEmail = envEmail()
  if (!expectedEmail || email !== expectedEmail) return false

  const hash = process.env.ADMIN_PASSWORD_HASH?.trim()
  if (hash) return bcrypt.compare(password, hash)

  const plain = process.env.ADMIN_PASSWORD
  return Boolean(plain) && password === plain
}

export function normalizeEmail(email: string) {
  return email.toLowerCase().trim()
}

/** Les mots de passe collés depuis un gestionnaire ou un SMS traînent souvent une espace. */
export function normalizePassword(password: string) {
  return password.trim()
}

export async function verifyAdminCredentials(
  rawEmail: string,
  rawPassword: string,
): Promise<AdminIdentity | null> {
  const email    = normalizeEmail(rawEmail)
  const password = normalizePassword(rawPassword)
  if (!email || !password) return null

  const admin = await prisma.admin.findUnique({ where: { email } })

  if (admin && (await bcrypt.compare(password, admin.password))) {
    return { id: admin.id, email: admin.email }
  }

  if (await matchesEnvAdmin(email, password)) {
    // Premier accès avec les identifiants d'environnement : on matérialise le
    // compte en base pour qu'il puisse ensuite être géré depuis l'admin.
    const created = await prisma.admin.upsert({
      where:  { email },
      update: { password: await bcrypt.hash(password, 12) },
      create: { email, password: await bcrypt.hash(password, 12) },
    })
    return { id: created.id, email: created.email }
  }

  return null
}

export async function adminAccountStatus() {
  let adminCount = 0
  let databaseReachable = true
  try {
    adminCount = await prisma.admin.count()
  } catch {
    databaseReachable = false
  }

  return {
    databaseReachable,
    hasAdmin:      adminCount > 0,
    hasEnvAdmin:   Boolean(envEmail() && (process.env.ADMIN_PASSWORD_HASH || process.env.ADMIN_PASSWORD)),
    hasAuthSecret: Boolean(process.env.NEXTAUTH_SECRET),
  }
}
