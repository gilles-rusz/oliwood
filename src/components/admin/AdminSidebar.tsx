'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clsx } from 'clsx'

const links = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: '◈' },
  { href: '/admin/galerie',   label: 'Galerie photos',  icon: '◻' },
  { href: '/admin/devis',     label: 'Devis reçus',     icon: '✉' },
  { href: '/admin/settings',  label: 'Réglages',        icon: '⚙' },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 w-60 h-screen bg-dark-800 border-r border-cream/5 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-cream/5">
        <p className="font-display text-lg font-bold">
          <span className="text-wood-400">Oli</span>
          <span className="text-cream">Wood</span>
        </p>
        <p className="text-cream/30 text-[0.6rem] tracking-widest uppercase mt-1">Admin</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {links.map(({ href, label, icon }) => (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 text-sm transition-colors rounded-sm',
                  pathname === href
                    ? 'bg-wood-400/15 text-wood-400'
                    : 'text-cream/50 hover:text-cream hover:bg-cream/5'
                )}
              >
                <span className="text-base">{icon}</span>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Déconnexion */}
      <div className="p-4 border-t border-cream/5">
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full text-left px-3 py-2 text-sm text-cream/30 hover:text-red-400 transition-colors"
        >
          Déconnexion
        </button>
      </div>
    </aside>
  )
}
