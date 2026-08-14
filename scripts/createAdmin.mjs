// scripts/createAdmin.mjs
// Usage: node scripts/createAdmin.mjs
// Crée le compte admin, ou remplace le mot de passe s'il existe déjà.

import { createInterface } from 'readline'
import bcrypt from 'bcryptjs'
import { loadEnv, requireEnv } from './loadEnv.mjs'

const loaded = loadEnv()
requireEnv(['DATABASE_URL'])

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const rl = createInterface({ input: process.stdin, output: process.stdout })
const question = (q) => new Promise(resolve => rl.question(q, resolve))

// Saisie masquée : le mot de passe ne doit pas rester dans le terminal.
function hiddenQuestion(q) {
  return new Promise(resolve => {
    process.stdout.write(q)
    const onData = (char) => {
      if (char === '\n' || char === '\r' || char === '\u0004') return
      rl.output.write('\x1B[2K\x1B[200D' + q + '*'.repeat(rl.line.length))
    }
    rl.input.on('data', onData)
    rl.question('', (answer) => {
      rl.input.off('data', onData)
      process.stdout.write('\n')
      resolve(answer)
    })
  })
}

console.log('\n🪵 OliWood : création du compte admin')
console.log(`   Env chargé : ${loaded.length ? loaded.join(', ') : 'aucun fichier .env trouvé'}`)

if (!process.env.NEXTAUTH_SECRET) {
  console.warn("   ⚠️  NEXTAUTH_SECRET absent : la connexion admin échouera.")
  console.warn('      Génère-le avec `openssl rand -base64 32` et ajoute-le dans .env.local.\n')
}

const email    = (await question('Email admin : ')).trim().toLowerCase()
const password = await hiddenQuestion('Mot de passe (min 12 caractères) : ')

if (!email.includes('@')) {
  console.error('❌ Email invalide')
  process.exit(1)
}
if (password.length < 12) {
  console.error('❌ Mot de passe trop court (minimum 12 caractères)')
  process.exit(1)
}

try {
  const hash  = await bcrypt.hash(password, 12)
  const admin = await prisma.admin.upsert({
    where:  { email },
    update: { password: hash },
    create: { email, password: hash },
  })

  // Relecture depuis la base : garantit que le hash enregistré valide bien
  // le mot de passe saisi (détecte une écriture sur la mauvaise base).
  const saved = await prisma.admin.findUnique({ where: { email } })
  const ok    = saved ? await bcrypt.compare(password, saved.password) : false

  if (!ok) {
    console.error("\n❌ Le mot de passe enregistré ne se vérifie pas. Vérifie DATABASE_URL.")
    process.exit(1)
  }

  console.log(`\n✅ Compte admin prêt : ${admin.email}`)
  console.log('   Connexion : http://localhost:3000/admin/login\n')
} catch (e) {
  console.error('❌ Erreur :', e.message)
  process.exitCode = 1
} finally {
  rl.close()
  await prisma.$disconnect()
}
