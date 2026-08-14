import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { adminAuthBypassed } from '@/lib/adminAuthFlag'

// Point d'entrée unique des routes API admin : une seule condition à relire
// pour savoir qui a accès.
export async function isAdminAuthorized(): Promise<boolean> {
  if (adminAuthBypassed) return true
  return Boolean(await getServerSession(authOptions))
}
