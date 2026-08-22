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

const PERGOLA_TITLES = [
  'Pergola adossée en bois',
  'Pergola avec couverture polycarbonate',
  'Abri de terrasse adossé',
  'Pergola avec claustra brise-vue',
  'Pergola et brise-vue à lames bois',
  'Abri de terrasse sur mesure',
  'Pergola sur terrasse maçonnée',
  'Auvent bois sur terrasse surélevée',
  'Pergola adossée avec couverture translucide',
  'Pergola le long de la façade',
  'Pergola bois devant l\u2019entrée',
  'Auvent de façade en bois',
  'Abri de terrasse et carport',
  'Claustra brise-vue en bois',
  'Pergola sur terrasse en bois',
  'Abri contemporain avec claustra',
  'Abri de terrasse en bois',
  'Abri de terrasse avec spots intégrés',
  'Pergola éclairée sur mesure',
  'Auvent de terrasse laqué blanc',
  'Pergola avec charpente apparente',
  'Charpente d’abri de terrasse',
  'Pergola avec couverture vitrée',
  'Pergola contemporaine anthracite',
  'Verrière de terrasse en bois',
  'Abri bois avec bardage',
  'Brise-vue bois à lames verticales',
  'Charpente de pergola en éventail',
  'Kiosque en bois sur mesure',
  'Pergola avec éclairage intégré',
]

const TERRASSE_TITLES = [
  'Terrasse surélevée avec garde-corps inox',
  'Grande terrasse sur ossature bois',
  'Terrasse en douglas et gabions',
  'Terrasse en bois exotique sous auvent',
  'Terrasse bois devant baie vitrée',
  'Terrasse d’angle avec trappe de visite',
  'Terrasse couverte avec claustra',
  'Terrasse en lames rainurées',
  'Terrasse de piscine en bois exotique',
  'Terrasse en douglas rainuré',
]

const CARPORT_TITLES = [
  'Carport adossé avec couverture bac acier',
  'Carport double avec claustra brise-vue',
  'Carport fermé avec bardage à claire-voie',
  'Carport anthracite avec couverture translucide',
  'Carport bois à toit plat',
  'Grand carport avec bardage douglas',
  'Carport en longueur avec gouttière zinc',
  'Carport double avec claustra en enfilade',
]

const AUTRE_TITLES = [
  'Avant / Après — terrasse bois sur dalle béton',
  'Avant / Après — carport fermé et aménagé',
  'Avant / Après — claustras brise-vue de cour',
  'Avant / Après — bardage ravivé et lasuré',
  'Avant / Après — habillage bois de soubassement',
  'Portail bois laqué rouge',
  'Pool house avec charpente apparente éclairée',
  'Pool house en bois sur mesure',
  'Pont de jardin en bois',
  'Passerelle de bassin en bois',
  'Auvent de porte en douglas',
  'Abri à toit plat avec polycarbonate',
  'Abri de jardin quatre pans',
  'Garde-corps bois et verre',
  'Bardage de chalet en bois',
  'Garde-corps verre sur terrasse panoramique',
  'Abri bois bardé sur mesure',
  'Terrasse de piscine et garde-corps verre',
  'Terrasse et claustra brise-vue en douglas',
  'Claustra bas de jardin',
  'Abri de jardin avec bûcher',
  'Clôture bois à lames horizontales',
  'Auvent de garage contemporain',
  'Claustras brise-vue devant carport',
  'Habillage bois de façade enterrée',
  'Charpente apparente en douglas',
  'Local à vélos fermé en bois',
  'Abri public couvert avec bancs',
  'Abri pour moutons en bois',
]

function catalogue(slug, category, titles) {
  return titles.map((title, i) => {
    const n = String(i + 1).padStart(2, '0')
    return {
      externalId: `seed:${slug}-${n}`,
      title,
      category,
      imageUrl: `/images/realisations/${slug}/${slug}-${n}.jpg`,
      order: i + 1,
    }
  })
}

const REALISATIONS = [
  ...catalogue('terrasse', 'TERRASSE', TERRASSE_TITLES),
  ...catalogue('pergola', 'PERGOLA', PERGOLA_TITLES),
  ...catalogue('carport', 'CARPORT', CARPORT_TITLES),
  ...catalogue('autre', 'AUTRE', AUTRE_TITLES),
]

let created = 0
let updated = 0
let removed = 0

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

  // Retirer les fiches issues d'un ancien catalogue (photo renommée ou déplacée).
  // Ne touche jamais aux réalisations ajoutées depuis l'admin (externalId null).
  const ids = REALISATIONS.map(r => r.externalId)
  const { count } = await prisma.realisation.deleteMany({
    where: {
      externalId: { startsWith: 'seed:', notIn: ids },
    },
  })
  removed = count

  console.log(`\n✅ Réalisations : ${created} créée(s), ${updated} mise(s) à jour, ${removed} obsolète(s) retirée(s).`)
} catch (e) {
  console.error('❌ Erreur :', e.message)
  process.exitCode = 1
} finally {
  await prisma.$disconnect()
}
