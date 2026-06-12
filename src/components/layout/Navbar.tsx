'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogoImage } from '@/components/ui/LogoImage'

const NAV_LINKS = [
  { href: '/',             label: 'Accueil' },
  { href: '/realisations', label: 'Réalisations' },
  { href: '/a-propos',     label: 'À propos' },
  { href: '/devis',        label: 'Devis gratuit', cta: true },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const pathname                = usePathname()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => { setOpen(false) }, [pathname])

  const headerBg = scrolled ? 'rgba(75,28,1,.97)' : 'transparent'

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: headerBg,
        backdropFilter: scrolled ? 'blur(6px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,224,20,.1)' : 'none',
        transition: 'background .4s, backdrop-filter .4s',
        padding: scrolled ? '10px 0' : '18px 0',
      }}>
        <nav style={{
          maxWidth: 1180, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* ── Brand ── */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              width: 44, height: 44, borderRadius: '50%', overflow: 'hidden',
              border: '2px solid var(--jaune)',
              background: 'var(--creme)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <LogoImage width={38} height={38} style={{ objectFit: 'contain', display: 'block' }} />
            </div>
            <span style={{
              fontFamily: "'Oleo Script', cursive",
              fontSize: 'clamp(22px, 4vw, 28px)',
              color: 'var(--jaune)',
              lineHeight: 1, letterSpacing: '.5px',
            }}>
              Oli&apos;Wood
            </span>
          </Link>

          {/* ── Desktop links (md+) ── */}
          <ul
            className="hidden md:flex"
            style={{ alignItems: 'center', gap: '4px', listStyle: 'none', margin: 0, padding: 0 }}
          >
            {NAV_LINKS.map(({ href, label, cta }) => (
              <li key={href}>
                {cta ? (
                  <Link href={href} className="btn-primary-ow" style={{ fontSize: '16px', padding: '8px 20px' }}>
                    {label}
                  </Link>
                ) : (
                  <Link href={href} style={{
                    fontFamily: "'Khand', sans-serif",
                    fontWeight: 600, fontSize: '17px', letterSpacing: '.5px',
                    color: pathname === href ? 'var(--jaune)' : 'var(--creme)',
                    textDecoration: 'none',
                    padding: '8px 14px', borderRadius: '8px',
                    background: pathname === href ? 'rgba(255,224,20,.15)' : 'transparent',
                    transition: 'background .2s, color .2s',
                  }}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* ── Burger — mobile/tablette uniquement ──
              IMPORTANT : display géré par Tailwind (flex md:hidden),
              PAS via inline style (inline > Tailwind sans !important) */}
          <button
            className="flex md:hidden"
            onClick={() => setOpen(v => !v)}
            aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={open}
            style={{ flexDirection: 'column', gap: '5px', cursor: 'pointer', background: 'none', border: 0, padding: '6px' }}
          >
            <span style={{ width: 26, height: 3, background: 'var(--jaune)', borderRadius: 3, transition: 'transform .3s', transform: open ? 'rotate(45deg) translateY(8px)' : 'none', display: 'block' }} />
            <span style={{ width: 26, height: 3, background: 'var(--jaune)', borderRadius: 3, transition: 'opacity .3s', opacity: open ? 0 : 1, display: 'block' }} />
            <span style={{ width: 26, height: 3, background: 'var(--jaune)', borderRadius: 3, transition: 'transform .3s', transform: open ? 'rotate(-45deg) translateY(-8px)' : 'none', display: 'block' }} />
          </button>
        </nav>

        {/* ── Menu mobile déroulant ── */}
        <div
          className="md:hidden"
          style={{
            overflow: 'hidden',
            maxHeight: open ? '360px' : '0',
            transition: 'max-height .35s ease',
            borderTop: open ? '1px solid rgba(255,224,20,.15)' : 'none',
          }}
        >
          <ul style={{
            padding: '16px 24px 24px',
            display: 'flex', flexDirection: 'column',
            listStyle: 'none', margin: 0,
            background: 'rgba(74,28,1,.98)',
            backdropFilter: 'blur(8px)',
          }}>
            {NAV_LINKS.map(({ href, label, cta }) => (
              <li key={href}>
                {cta ? (
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    className="btn-primary-ow"
                    style={{ display: 'inline-block', marginTop: '12px', fontSize: '17px', padding: '10px 26px' }}
                  >
                    {label}
                  </Link>
                ) : (
                  <Link
                    href={href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: 'block',
                      fontFamily: "'Khand', sans-serif",
                      fontSize: '20px', fontWeight: 600,
                      color: pathname === href ? 'var(--jaune)' : 'var(--creme)',
                      textDecoration: 'none', letterSpacing: '.3px',
                      padding: '13px 0',
                      borderBottom: '1px solid rgba(255,224,20,.1)',
                    }}
                  >
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </header>

      {/* Overlay sombre — ferme le menu au clic en dehors */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,.35)',
          }}
        />
      )}
    </>
  )
}
