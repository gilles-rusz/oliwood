import { prisma } from '@/lib/prisma'
import { AdminGalerieClient } from '@/components/admin/AdminGalerieClient'

export const dynamic = 'force-dynamic'

export default async function AdminGaleriePage() {
  const realisations = await prisma.realisation.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-cream mb-8">Galerie photos</h1>
      <AdminGalerieClient realisations={realisations} />
    </div>
  )
}
