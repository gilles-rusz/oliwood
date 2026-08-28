import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { verifyAdminCredentials } from '@/lib/adminAccount'

const SESSION_MAX_AGE = 30 * 24 * 60 * 60 // 30 jours

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
