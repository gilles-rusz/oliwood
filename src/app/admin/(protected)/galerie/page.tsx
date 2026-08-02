import { prisma } from '@/lib/prisma'
import { AdminGalerieClient } from '@/components/admin/AdminGalerieClient'

export const dynamic = 'force-dynamic'

export default async function AdminGaleriePage() {
  const realisations = await prisma.realisation.findMany({
    orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-2xl font-bold text-cream">Galerie photos</h1>
        <p className="text-cream/40 text-sm">{realisations.length} photo{realisations.length > 1 ? 's' : ''}</p>
      </div>
      <AdminGalerieClient realisations={realisations} />
    </div>
  )
}
