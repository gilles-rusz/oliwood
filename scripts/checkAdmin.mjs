// scripts/checkAdmin.mjs
// Diagnostic de la connexion au back-office :
//   node scripts/checkAdmin.mjs
//   node scripts/checkAdmin.mjs contact@oliwood.fr "MotDePasseATester"

import bcrypt from 'bcryptjs'
import { loadEnv } from './loadEnv.mjs'

const envPath = loadEnv()

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const [testEmail, testPassword] = process.argv.slice(2)

console.log("\n🪵 OliWood — Diagnostic admin\n")
console.log(`Fichier d'environnement : ${envPath ?? 'aucun (variables système uniquement)'}`)

for (const key of ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'ADMIN_EMAIL']) {
  const value = process.env[key]
  const shown = key === 'DATABASE_URL' ? (value ? value.replace(/:[^:@/]+@/, ':****@') : '') : value
  console.log(`${value ? '✅' : '❌'} ${key}${value && key !== 'NEXTAUTH_SECRET' ? ` = ${shown}` : ''}`)
}

try {
  const admins = await prisma.admin.findMany({ select: { email: true, updatedAt: true } })
  console.log(`\n✅ Base accessible — ${admins.length} compte(s) admin :`)
  for (const a of admins) {
    console.log(`   • ${a.email} (mot de passe modifié le ${a.updatedAt.toLocaleDateString('fr-FR')})`)
  }
  if (admins.length === 0) {
    console.log('   ⚠️  Aucun compte : lance « npm run admin:create »')
  }

  if (testEmail && testPassword) {
    const admin = await prisma.admin.findUnique({ where: { email: testEmail.toLowerCase().trim() } })
    if (!admin) {
      console.log(`\n❌ Aucun compte pour ${testEmail}`)
    } else {
      const ok = await bcrypt.compare(testPassword.trim(), admin.password)
      console.log(`\n${ok ? '✅ Mot de passe valide' : '❌ Mot de passe invalide'} pour ${admin.email}`)
    }
  }
} catch (e) {
  console.error('\n❌ Base injoignable :', e.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
