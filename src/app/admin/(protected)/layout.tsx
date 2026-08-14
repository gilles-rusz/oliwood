import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { adminAuthBypassed } from '@/lib/adminAuthFlag'

// L'authentification est vérifiée par le middleware (src/middleware.ts).
// Ce groupe de routes ne contient jamais /admin/login, donc pas de risque
// de boucle de redirection ici.
export default function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-dark-900">
      <AdminSidebar />
      <main className="flex-1 ml-60 p-8">
        {adminAuthBypassed && (
          <p className="mb-6 border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
            Mode démo : authentification désactivée via <code>ADMIN_AUTH_BYPASS</code> dans
            <code> .env.local</code>. Retire cette variable pour réactiver le login.
          </p>
        )}
        {children}
      </main>
    </div>
  )
}
