import { prisma } from '@/lib/prisma'

export default async function AdminDashboard() {
  const [totalPhotos, totalDevis, devisNouveaux] = await Promise.all([
    prisma.realisation.count(),
    prisma.devis.count(),
    prisma.devis.count({ where: { statut: 'NOUVEAU' } }),
  ])

  const recentDevis = await prisma.devis.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-cream mb-8">Tableau de bord</h1>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          { label: 'Photos en ligne',  value: totalPhotos  },
          { label: 'Devis reçus',      value: totalDevis   },
          { label: 'Nouveaux devis',   value: devisNouveaux, highlight: true },
        ].map(({ label, value, highlight }) => (
          <div key={label} className="bg-dark-800 border border-cream/5 p-5">
            <p className="text-cream/40 text-xs tracking-widest uppercase mb-2">{label}</p>
            <p className={`font-display text-3xl font-bold ${highlight && value > 0 ? 'text-wood-400' : 'text-cream'}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      {/* Derniers devis */}
      <div>
        <h2 className="text-sm tracking-widest uppercase text-cream/40 mb-4">Dernières demandes</h2>
        <div className="space-y-2">
          {recentDevis.length === 0 ? (
            <p className="text-cream/30 text-sm">Aucune demande reçue pour l&apos;instant.</p>
          ) : recentDevis.map((d) => (
            <div key={d.id} className="bg-dark-800 border border-cream/5 px-5 py-3 flex items-center justify-between">
              <div>
                <p className="text-cream text-sm font-medium">{d.prenom} {d.nom}</p>
                <p className="text-cream/40 text-xs">{d.typeProjet} · {d.email}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 ${d.statut === 'NOUVEAU' ? 'bg-wood-400/20 text-wood-400' : 'bg-cream/5 text-cream/40'}`}>
                  {d.statut}
                </span>
                <p className="text-cream/30 text-xs mt-1">
                  {new Date(d.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
