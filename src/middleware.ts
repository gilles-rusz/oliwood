import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // /admin/login et /api/auth/* sont toujours exclus de la protection
  // (le matcher ci-dessous ne couvre déjà que /admin/*, cette garde est
  // défensive si le matcher venait à être élargi un jour)
  if (pathname === '/admin/login' || pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Seules les autres routes /admin/* nécessitent un token valide
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
