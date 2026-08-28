// scripts/hashPassword.mjs
// Génère le hash bcrypt à coller dans ADMIN_PASSWORD_HASH (Vercel, .env) :
//   npm run admin:hash -- "MonMotDePasse"

import bcrypt from 'bcryptjs'

const password = process.argv[2]

if (!password) {
  console.error('Usage : npm run admin:hash -- "MonMotDePasse"')
  process.exit(1)
}

console.log(await bcrypt.hash(password.trim(), 12))
