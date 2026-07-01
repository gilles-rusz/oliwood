import { type NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

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
        if (!admin) return null

        const valid = await bcrypt.compare(credentials.password, admin.password)
        if (!valid) return null

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
  secret: process.env.NEXTAUTH_SECRET,
}
