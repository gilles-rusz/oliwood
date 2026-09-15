import { prisma } from '@/lib/prisma'
import { AdminDevisClient } from '@/components/admin/AdminDevisClient'
import { AdminPushToggle } from '@/components/admin/AdminPushToggle'

export const dynamic = 'force-dynamic'

export default async function AdminDevisPage() {
  const devis = await prisma.devis.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">Devis reçus</h1>
        <p className="text-cream/40 text-sm">{devis.length} demande{devis.length > 1 ? 's' : ''}</p>
      </div>
      <div className="mb-6">
        <AdminPushToggle />
      </div>
      <AdminDevisClient devis={devis} />
    </div>
  )
}
