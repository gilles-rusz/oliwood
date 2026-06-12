// scripts/createAdmin.mjs
// Usage: node scripts/createAdmin.mjs

import { createInterface } from 'readline'
import { createHash } from 'crypto'

// Charger les env vars depuis .env.local
const fs = await import('fs')
const path = await import('path')

const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '')
  }
}

const { PrismaClient } = await import('@prisma/client')
const bcrypt = await import('bcryptjs')

const prisma = new PrismaClient()

const rl = createInterface({ input: process.stdin, output: process.stdout })
const question = (q) => new Promise(resolve => rl.question(q, resolve))

console.log('\n🪵 OliWood — Création du compte admin\n')

const email    = await question('Email admin : ')
const password = await question('Mot de passe (min 12 caractères) : ')

if (password.length < 12) {
  console.error('❌ Mot de passe trop court (minimum 12 caractères)')
  process.exit(1)
}

const hash = await bcrypt.hash(password, 12)

try {
  const admin = await prisma.admin.upsert({
    where:  { email: email.toLowerCase() },
    update: { password: hash },
    create: { email: email.toLowerCase(), password: hash },
  })
  console.log(`\n✅ Compte admin créé : ${admin.email}`)
} catch (e) {
  console.error('❌ Erreur :', e.message)
} finally {
  rl.close()
  await prisma.$disconnect()
}
