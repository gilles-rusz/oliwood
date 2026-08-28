import fs from 'fs'
import path from 'path'

// Charge le premier fichier d'environnement trouvé (.env.local puis .env).
export function loadEnv() {
  const envPath = ['.env.local', '.env']
    .map(f => path.join(process.cwd(), f))
    .find(p => fs.existsSync(p))
  if (!envPath) return null

  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    if (!line.trim() || line.trim().startsWith('#')) continue
    const [key, ...vals] = line.split('=')
    const name = key?.trim()
    if (name && vals.length && !(name in process.env)) {
      process.env[name] = vals.join('=').trim().replace(/^"|"$/g, '')
    }
  }
  return envPath
}
