import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminAccountForm } from '@/components/admin/AdminAccountForm'

export const dynamic = 'force-dynamic'

export default async function AdminAccountPage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-2xl font-bold text-cream mb-8">Mon compte</h1>
      <AdminAccountForm email={session?.user?.email ?? ''} />
    </div>
  )
}
