import { AdminSidebar } from '@/components/admin/AdminSidebar'

// L'authentification est vérifiée par le middleware (src/middleware.ts).
// Ce groupe de routes ne contient jamais /admin/login, donc pas de risque
// de boucle de redirection ici.
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <main className="flex-1 min-w-0 pt-20 px-4 pb-10 lg:pt-8 lg:px-8 lg:pb-8 lg:ml-60">
        {children}
      </main>
    </div>
  )
}
