import { execFileSync } from 'node:child_process'
import { existsSync, writeFileSync } from 'node:fs'
import { randomBytes } from 'node:crypto'

function run(command, args) {
  execFileSync(command, args, { stdio: 'inherit' })
}

if (!existsSync('.env')) {
  const secret = randomBytes(32).toString('base64')
  writeFileSync(
    '.env',
    `DATABASE_URL="postgresql://oliwood:oliwood@localhost:5432/oliwood"\n` +
      `DIRECT_URL="postgresql://oliwood:oliwood@localhost:5432/oliwood"\n` +
      `NEXTAUTH_SECRET="${secret}"\n` +
      `NEXTAUTH_URL="http://localhost:3000"\n`
  )
  console.log('Fichier .env local créé.')
}

run('docker', ['compose', 'up', '-d', '--wait', 'postgres'])
run('npx', ['prisma', 'db', 'push'])

console.log('\nOliWood est prêt. Lance maintenant : npm run dev')
console.log('Pour créer le compte admin : npm run admin:create')
