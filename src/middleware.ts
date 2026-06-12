import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Si on est sur /admin/* sans token valide → redirect login
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        // Les routes /admin/* (sauf /admin/login) nécessitent un token
        if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/admin/:path*'],
}
