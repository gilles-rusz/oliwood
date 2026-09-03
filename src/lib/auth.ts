import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyAdminCredentials } from '@/lib/adminAccount'
import { rateLimit } from '@/lib/rateLimit'

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 jours

const LOGIN_MAX_ATTEMPTS = 10
const LOGIN_WINDOW_MS    = 15 * 60 * 1000

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email:    { label: 'Email',         type: 'email' },
        password: { label: 'Mot de passe',  type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null

        const forwarded = req?.headers?.['x-forwarded-for']
        const ip = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0].trim() || 'unknown'
        if (await rateLimit(ip, 'admin-login', LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS)) {
          throw new Error('Trop de tentatives de connexion. Réessayez dans quelques minutes.')
        }

        return verifyAdminCredentials(credentials.email, credentials.password)
      },
    }),
  ],
  session: {
    strategy:  'jwt',
    maxAge:    SESSION_MAX_AGE,
    updateAge: 24 * 60 * 60, // le cookie est prolongé au plus une fois par jour
  },
  jwt: {
    maxAge: SESSION_MAX_AGE,
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
  secret: process.env.NEXTAUTH_SECRET,
}
