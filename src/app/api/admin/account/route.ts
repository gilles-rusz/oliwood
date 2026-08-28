import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import bcrypt from 'bcryptjs'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import {
  MIN_PASSWORD_LENGTH,
  normalizeEmail,
  normalizePassword,
  verifyAdminCredentials,
} from '@/lib/adminAccount'

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const body = await req.json()
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : ''
  const newPassword     = typeof body.newPassword === 'string' ? normalizePassword(body.newPassword) : ''
  const newEmail        = typeof body.newEmail === 'string' && body.newEmail
    ? normalizeEmail(body.newEmail)
    : null

  const identity = await verifyAdminCredentials(session.user.email, currentPassword)
  if (!identity) {
    return NextResponse.json({ error: 'Mot de passe actuel incorrect.' }, { status: 400 })
  }

  if (!newPassword && !newEmail) {
    return NextResponse.json({ error: 'Aucune modification demandée.' }, { status: 400 })
  }

  if (newPassword && newPassword.length < MIN_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `Le nouveau mot de passe doit faire au moins ${MIN_PASSWORD_LENGTH} caractères.` },
      { status: 400 },
    )
  }

  if (newEmail && newEmail !== identity.email) {
    const taken = await prisma.admin.findUnique({ where: { email: newEmail } })
    if (taken) {
      return NextResponse.json({ error: 'Cet email est déjà utilisé.' }, { status: 400 })
    }
  }

  const admin = await prisma.admin.update({
    where: { id: identity.id },
    data: {
      ...(newEmail ? { email: newEmail } : {}),
      ...(newPassword ? { password: await bcrypt.hash(newPassword, 12) } : {}),
    },
  })

  // L'email est porté par le JWT : il faut se reconnecter pour le rafraîchir.
  return NextResponse.json({
    ok:               true,
    email:            admin.email,
    emailChanged:     Boolean(newEmail && newEmail !== identity.email),
    passwordChanged:  Boolean(newPassword),
  })
}
