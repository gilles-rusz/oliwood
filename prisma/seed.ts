// prisma/seed.ts
// Usage: npx ts-node prisma/seed.ts (ou via package.json "prisma": {"seed": "..."})

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Paramètres site par défaut
  await prisma.siteSettings.upsert({
    where:  { id: 'singleton' },
    update: {},
    create: {
      id:             'singleton',
      seasonalActive: false,
      heroTitle:      'OliWood',
      heroSubtitle:   'Charpenterie & Construction Bois',
      metaDescription:'Artisans charpentiers passionnés — terrasses, pergolas, cabanes, charpentes.',
      telephone:      '+33 6 XX XX XX XX',
      email:          'contact@oliwood.fr',
      adresse:        'Grand Est, France',
    },
  })

  console.log('✅ Seed terminé')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
