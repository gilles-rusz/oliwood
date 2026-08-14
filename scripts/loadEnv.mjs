// scripts/loadEnv.mjs
// Charge .env.local puis .env (comme Next.js) pour les scripts Node.

import fs from 'fs'
import path from 'path'

function parse(content) {
  const out = {}
  for (const rawLine of content.split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const eq = line.indexOf('=')
    if (eq === -1) continue

    const key = line.slice(0, eq).replace(/^export\s+/, '').trim()
    let value  = line.slice(eq + 1).trim()

    const quoted = /^(['"]).*\1$/s.test(value)
    if (quoted) {
      value = value.slice(1, -1)
    } else {
      // commentaire en fin de ligne uniquement sur les valeurs non quotées
      const hash = value.indexOf(' #')
      if (hash !== -1) value = value.slice(0, hash).trim()
    }

    if (key) out[key] = value
  }
  return out
}

export function loadEnv(cwd = process.cwd()) {
  const loaded = []
  for (const file of ['.env.local', '.env']) {
    const filePath = path.join(cwd, file)
    if (!fs.existsSync(filePath)) continue
    const vars = parse(fs.readFileSync(filePath, 'utf-8'))
    for (const [key, value] of Object.entries(vars)) {
      if (process.env[key] === undefined) process.env[key] = value
    }
    loaded.push(file)
  }
  return loaded
}

export function requireEnv(keys) {
  const missing = keys.filter(key => !process.env[key])
  if (missing.length) {
    console.error(`\n❌ Variables d'environnement manquantes : ${missing.join(', ')}`)
    console.error('   Renseigne-les dans .env.local (voir .env.example), puis relance.\n')
    process.exit(1)
  }
}
