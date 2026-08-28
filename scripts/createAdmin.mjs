// scripts/createAdmin.mjs
// Interactif       : node scripts/createAdmin.mjs
// Non interactif   : node scripts/createAdmin.mjs contact@oliwood.fr "MonMotDePasse"
//                    ADMIN_EMAIL=... ADMIN_PASSWORD=... node scripts/createAdmin.mjs

import { createInterface } from 'readline'
import bcrypt from 'bcryptjs'
import { loadEnv } from './loadEnv.mjs'

const MIN_LENGTH = 10

loadEnv()

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const [argEmail, argPassword] = process.argv.slice(2)

let email    = argEmail    || process.env.ADMIN_EMAIL    || ''
let password = argPassword || process.env.ADMIN_PASSWORD || ''

console.log("\n🪵 OliWood — Compte admin\n")

if (!email || !password) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const question = (q) => new Promise(resolve => rl.question(q, resolve))
  if (!email)    email    = await question('Email admin : ')
  if (!password) password = await question(`Mot de passe (min ${MIN_LENGTH} caractères) : `)
  rl.close()
}

email    = email.toLowerCase().trim()
password = password.trim()

if (password.length < MIN_LENGTH) {
  console.error(`❌ Mot de passe trop court (minimum ${MIN_LENGTH} caractères)`)
  process.exit(1)
}

try {
  const hash  = await bcrypt.hash(password, 12)
  const admin = await prisma.admin.upsert({
    where:  { email },
    update: { password: hash },
    create: { email, password: hash },
  })
  console.log(`\n✅ Compte admin prêt : ${admin.email}`)
  console.log('   Connexion : /admin/login')
} catch (e) {
  console.error('❌ Erreur :', e.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
