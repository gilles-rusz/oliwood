'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { clsx } from 'clsx'

const links = [
  { href: '/admin/dashboard', label: 'Tableau de bord', icon: '◈' },
  { href: '/admin/galerie',   label: 'Galerie photos',  icon: '◻' },
  { href: '/admin/devis',     label: 'Devis reçus',     icon: '✉' },
  { href: '/admin/settings',  label: 'Réglages',        icon: '⚙' },
  { href: '/admin/compte',    label: 'Mon compte',      icon: '◉' },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      {/* Barre mobile */}
      <header className="lg:hidden fixed inset-x-0 top-0 z-40 h-14 bg-brun border-b border-jaune/10 flex items-center justify-between px-4">
        <p className="font-display text-lg font-bold">
          <span className="text-jaune">Oli</span>
          <span className="text-cream">Wood</span>
          <span className="text-cream/40 text-[0.6rem] tracking-widest uppercase ml-2">Admin</span>
        </p>
        <button
          onClick={() => setOpen(v => !v)}
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          className="text-cream text-2xl leading-none px-2 py-1"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="lg:hidden fixed inset-0 top-14 z-30 bg-black/60"
        />
      )}

      <aside
        className={clsx(
          'fixed left-0 z-30 w-60 bg-brun border-r border-jaune/10 flex flex-col transition-transform',
          'top-14 h-[calc(100vh-3.5rem)] lg:top-0 lg:h-screen lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
      {/* Logo */}
      <div className="hidden lg:block p-6 border-b border-jaune/10">
        <p className="font-display text-lg font-bold">
          <span className="text-jaune">Oli</span>
          <span className="text-cream">Wood</span>
        </p>
        <p className="text-cream/40 text-[0.6rem] tracking-widest uppercase mt-1">Admin</p>
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

      <div className="p-4 border-t border-jaune/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="block px-3 py-2 text-sm text-cream/60 hover:text-jaune transition-colors"
        >
          Voir le site public ↗
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="w-full text-left px-3 py-2 text-sm text-cream/40 hover:text-red-400 transition-colors"
        >
          Déconnexion
        </button>
      </div>
      </aside>
    </>
  )
}
