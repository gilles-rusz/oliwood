import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

// Les réglages du site (thème saisonnier, textes, coordonnées) sont lus en base.
// Les pages publiques se régénèrent au maximum toutes les 60 s pour qu'un
// changement fait depuis l'admin apparaisse même si l'invalidation immédiate
// déclenchée par /api/admin/settings n'aboutit pas.
export const revalidate = 60

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
