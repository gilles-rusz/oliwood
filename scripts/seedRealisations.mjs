// scripts/seedRealisations.mjs
// Crée (ou met à jour) en base les réalisations livrées avec le site,
// dont les photos sont versionnées dans public/images/realisations/.
// Idempotent : relancer le script ne crée pas de doublons.
// Usage : npm run seed:realisations

import fs from 'fs'
import path from 'path'

// Charger les env vars depuis .env.local ou .env
const envPath = ['.env.local', '.env']
  .map(f => path.join(process.cwd(), f))
  .find(p => fs.existsSync(p))
if (envPath) {
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const [key, ...vals] = line.split('=')
    if (key && vals.length) process.env[key.trim()] = vals.join('=').trim().replace(/^"|"$/g, '')
  }
}

const { PrismaClient } = await import('@prisma/client')
const prisma = new PrismaClient()

const TERRASSE_TITLES = [
  'Pergola adossée en bois',
  'Pergola avec couverture polycarbonate',
  'Abri de terrasse adossé',
  'Pergola avec claustra brise-vue',
  'Pergola et brise-vue à lames bois',
  'Terrasse couverte sur mesure',
  'Pergola sur terrasse maçonnée',
  'Terrasse surélevée avec garde-corps',
  'Pergola adossée avec couverture translucide',
  'Pergola le long de la façade',
  'Pergola bois devant l\u2019entrée',
  'Auvent de façade en bois',
  'Abri de terrasse et carport',
  'Claustra brise-vue en bois',
  'Pergola sur terrasse en bois',
  'Abri contemporain avec claustra',
  'Abri de terrasse en bois',
  'Terrasse couverte avec spots intégrés',
  'Terrasse couverte et éclairée',
  'Auvent de terrasse laqué blanc',
  'Pergola avec charpente apparente',
  'Charpente de terrasse couverte',
  'Pergola avec couverture vitrée',
  'Pergola contemporaine anthracite',
  'Verrière de terrasse en bois',
  'Terrasse abritée avec bardage',
  'Brise-vue bois à lames verticales',
  'Charpente de pergola en éventail',
  'Kiosque en bois sur mesure',
  'Pergola avec éclairage intégré',
]

const TERRASSE = TERRASSE_TITLES.map((title, i) => {
  const n = String(i + 1).padStart(2, '0')
  return {
    externalId: `seed:terrasse-${n}`,
    title,
    category: 'TERRASSE',
    imageUrl: `/images/realisations/terrasse/terrasse-${n}.jpg`,
    order: i + 1,
  }
})

const REALISATIONS = [...TERRASSE]

let created = 0
let updated = 0

try {
  for (const r of REALISATIONS) {
    const filePath = path.join(process.cwd(), 'public', r.imageUrl)
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️  Photo manquante, ignorée : ${r.imageUrl}`)
      continue
    }

    const existing = await prisma.realisation.findUnique({ where: { externalId: r.externalId } })
    const data = {
      title:      r.title,
      category:   r.category,
      imageUrl:   r.imageUrl,
      thumbUrl:   r.imageUrl,
      source:     'MANUAL',
      published:  true,
      order:      r.order,
      externalId: r.externalId,
    }

    if (existing) {
      await prisma.realisation.update({ where: { id: existing.id }, data })
      updated++
    } else {
      await prisma.realisation.create({ data })
      created++
    }
  }

  console.log(`\n✅ Réalisations : ${created} créée(s), ${updated} mise(s) à jour.`)
} catch (e) {
  console.error('❌ Erreur :', e.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
