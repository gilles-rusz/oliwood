import { NextResponse } from 'next/server'
import { adminAccountStatus } from '@/lib/adminAccount'

export const dynamic = 'force-dynamic'

// Utilisé par la page de connexion pour afficher un message utile lorsque le
// back-office n'est pas encore configuré (aucun compte, base injoignable…).
export async function GET() {
  const status = await adminAccountStatus()
  return NextResponse.json(status, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
