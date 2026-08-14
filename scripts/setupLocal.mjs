// scripts/setupLocal.mjs
// Prépare un environnement de développement complet : PostgreSQL dans Docker,
// .env / .env.local corrects, tables Prisma, admin ouvert pour la démo.
// Aucune valeur Supabase n'est nécessaire.

import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

const LOCAL_DB = 'postgresql://oliwood:oliwood@localhost:5432/oliwood'

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

// Une valeur d'exemple (`postgresql://user:password@host:port/db`,
// `generer_avec_...`) casse Prisma aussi sûrement qu'une valeur absente.
function isPlaceholder(value) {
  if (!value) return true
  return /host:port|user:password|votre_|generer_|xxxx|\[|\]/i.test(value)
}

function readEnvFile(file) {
  if (!existsSync(file)) return []
  return readFileSync(file, 'utf-8').replace(/\r\n/g, '\n').split('\n')
}

function getValue(lines, key) {
  const line = lines.find(l => l.trim().startsWith(`${key}=`))
  if (!line) return undefined
  return line.slice(line.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')
}

// Réécrit la clé si elle est absente ou inutilisable, en laissant le reste
// du fichier (SMTP, reCAPTCHA, Meta…) intact.
function upsert(lines, key, value, { onlyIfPlaceholder = true } = {}) {
  const next = `${key}="${value}"`
  const index = lines.findIndex(l => l.trim().startsWith(`${key}=`))
  if (index === -1) {
    // Une ligne commentée (`# ADMIN_AUTH_BYPASS="true"`) est activée sur place
    // plutôt que dupliquée en fin de fichier.
    const commented = lines.findIndex(l => new RegExp(`^\\s*#\\s*${key}=`).test(l))
    if (commented !== -1) lines[commented] = next
    else lines.push(next)
    return true
  }
  if (onlyIfPlaceholder && !isPlaceholder(getValue(lines, key))) return false
  lines[index] = next
  return true
}

function writeEnv(file, secret) {
  const lines = readEnvFile(file)
  const before = lines.join('\n')
  if (existsSync(file)) copyFileSync(file, `${file}.bak`)

  upsert(lines, 'DATABASE_URL', LOCAL_DB)
  upsert(lines, 'DIRECT_URL', LOCAL_DB)
  upsert(lines, 'NEXTAUTH_SECRET', secret)
  upsert(lines, 'NEXTAUTH_URL', 'http://localhost:3000')
  upsert(lines, 'ADMIN_AUTH_BYPASS', 'true', { onlyIfPlaceholder: false })

  const after = lines.join('\n').replace(/\n*$/, '\n')
  if (after !== before) {
    writeFileSync(file, after)
    console.log(`${file} mis à jour${existsSync(`${file}.bak`) ? ` (sauvegarde : ${file}.bak)` : ''}`)
  }
}

const secret = randomBytes(32).toString('base64')

// Next.js lit .env.local en priorité ; le CLI Prisma ne lit que .env.
// Les deux doivent donc pointer sur la même base.
writeEnv('.env', secret)
writeEnv('.env.local', secret)

run('docker', ['compose', 'up', '-d', '--wait', 'postgres'])
run('npx', ['prisma', 'db', 'push'])

console.log('\nOliWood est prêt : lance `npm run dev`, puis http://localhost:3000')
console.log('Le bouton « admin » en bas de page ouvre directement le back-office')
console.log('(ADMIN_AUTH_BYPASS="true", mode démo local, sans effet en production).')
console.log('Pour réactiver le login : retire ADMIN_AUTH_BYPASS de .env.local + `npm run admin:create`.')
