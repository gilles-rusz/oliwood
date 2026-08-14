// scripts/checkAdmin.mjs
// Usage: node scripts/checkAdmin.mjs [email] [motdepasse]
// Diagnostique la connexion admin : env, base, comptes existants et
// (optionnellement) vérification d'un couple email / mot de passe.

import bcrypt from 'bcryptjs'
import { loadEnv, requireEnv } from './loadEnv.mjs'

const loaded = loadEnv()
requireEnv(['DATABASE_URL'])

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const [emailArg, passwordArg] = process.argv.slice(2)

console.log('\n🔍 OliWood : diagnostic connexion admin')
console.log(`   Env chargé : ${loaded.length ? loaded.join(', ') : 'aucun fichier .env trouvé'}`)

for (const key of ['DATABASE_URL', 'NEXTAUTH_SECRET', 'NEXTAUTH_URL']) {
  const value = process.env[key]
  const shown = key === 'DATABASE_URL' && value
    ? value.replace(/:\/\/[^@]+@/, '://***@')
    : key === 'NEXTAUTH_SECRET' && value
      ? `défini (${value.length} caractères)`
      : value
  console.log(`   ${value ? '✅' : '❌'} ${key} : ${shown ?? 'absent'}`)
}

if (!process.env.NEXTAUTH_SECRET) {
  console.log('\n   ⚠️  Sans NEXTAUTH_SECRET, la session est invalidée à chaque redémarrage')
  console.log('      du serveur : tu es renvoyé vers /admin/login même après un login réussi.')
  console.log('      Génère-le avec `openssl rand -base64 32` puis ajoute-le dans .env.local.')
}

try {
  const admins = await prisma.admin.findMany({ select: { email: true, createdAt: true } })

  if (!admins.length) {
    console.log("\n❌ Aucun compte admin en base. Lance `node scripts/createAdmin.mjs`.\n")
  } else {
    console.log(`\n👤 ${admins.length} compte(s) admin :`)
    for (const admin of admins) {
      console.log(`   - ${admin.email} (créé le ${admin.createdAt.toISOString().slice(0, 10)})`)
    }
  }

  if (emailArg && passwordArg) {
    const email = emailArg.trim().toLowerCase()
    const admin = await prisma.admin.findUnique({ where: { email } })

    if (!admin) {
      console.log(`\n❌ Aucun admin avec l'email ${email} (attention : l'email est comparé en minuscules).`)
    } else {
      const valid = await bcrypt.compare(passwordArg, admin.password)
      console.log(valid
        ? `\n✅ Le mot de passe est correct pour ${email}.`
        : `\n❌ Mot de passe incorrect pour ${email}. Relance \`node scripts/createAdmin.mjs\` pour le redéfinir.`)
    }
  } else {
    console.log('\nℹ️  Pour tester un mot de passe : node scripts/checkAdmin.mjs email@exemple.fr "monMotDePasse"')
  }
  console.log('')
} catch (e) {
  console.error('\n❌ Erreur base de données :', e.message)
  console.error('   Vérifie DATABASE_URL et que `npm run db:push` a bien été exécuté.\n')
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
