import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Sans secret stable, NextAuth en dérive un nouveau à chaque redémarrage :
// les sessions déjà émises deviennent invalides et l'admin est redirigé
// vers le login en boucle.
const secret = process.env.NEXTAUTH_SECRET
if (!secret) {
  throw new Error(
    'NEXTAUTH_SECRET manquant. Génère-le avec `openssl rand -base64 32` ' +
    'et ajoute-le dans .env.local, puis redémarre le serveur.'
  )
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',         type: 'email' },
        password: { label: 'Mot de passe',  type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const admin = await prisma.admin.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })
        if (!admin) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[auth] aucun admin pour ${credentials.email}. Lance \`node scripts/checkAdmin.mjs\`.`)
          }
          return null
        }

        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) {
          if (process.env.NODE_ENV !== 'production') {
            console.warn(`[auth] mot de passe invalide pour ${admin.email}.`)
          }
          return null
        }

        return { id: admin.id, email: admin.email }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge:   8 * 60 * 60, // 8h
  },
  pages: {
    signIn:  '/admin/login',
    error:   '/admin/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (session.user) session.user.id = token.id as string
      return session
    },
  },
  secret,
}
