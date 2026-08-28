import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

const COLUMNS = [
  'Reçu le', 'Statut', 'Prénom', 'Nom', 'Email', 'Téléphone', 'Type de projet',
  'Longueur (m)', 'Largeur (m)', 'Hauteur (m)', 'Terrain', 'Implantation',
  'Plots béton', 'Toiture', 'Finition bois', 'Budget', 'Délai',
  'Adresse', 'Code postal', 'Ville', 'Description', 'Notes',
] as const

function cell(value: unknown) {
  if (value === null || value === undefined) return ''
  const text = String(value).replace(/"/g, '""')
  return `"${text}"`
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const devis = await prisma.devis.findMany({ orderBy: { createdAt: 'desc' } })

  const rows = devis.map(d => [
    d.createdAt.toLocaleDateString('fr-FR'), d.statut, d.prenom, d.nom, d.email, d.telephone,
    d.typeProjet, d.longueur, d.largeur, d.hauteur, d.typeTerrain, d.implantation,
    d.plotsBeton === null ? null : d.plotsBeton ? 'Oui' : 'Non',
    d.toiture, d.finitionBois, d.budget, d.delai,
    d.adresse, d.codePostal, d.ville, d.description, d.notes,
  ].map(cell).join(';'))

  // BOM + point-virgule : Excel FR ouvre le fichier directement en colonnes.
  const csv = '\uFEFF' + [COLUMNS.join(';'), ...rows].join('\r\n')
  const date = new Date().toISOString().slice(0, 10)

  return new NextResponse(csv, {
    headers: {
      'Content-Type':        'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="devis-oliwood-${date}.csv"`,
      'Cache-Control':       'no-store',
    },
  })
}
