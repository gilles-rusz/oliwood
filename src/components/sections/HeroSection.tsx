'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoImage } from '@/components/ui/LogoImage'

export function HeroSection() {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => contentRef.current?.classList.add('hero-ready'), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* ── Photo de fond ── */}
      <Image src="/images/hero.jpg" alt="" fill priority style={{ objectFit: 'cover' }} />

      {/* ── Voile sombre brun ── */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(74,28,1,.52)' }} />

      {/* ── Contenu centré ── */}
      <div
        ref={contentRef}
        className="hero-content-wrap"
        style={{
          position: 'absolute', inset: 0, zIndex: 10,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          paddingBottom: '6vh', textAlign: 'center', padding: '0 16px',
        }}
      >
        {/* Logo + halo jaune */}
        <div style={{ position: 'relative', marginBottom: '4px' }}>
          <div style={{
            position: 'absolute', inset: '-40%',
            background: 'radial-gradient(circle, rgba(255,224,20,.32), transparent 65%)',
            pointerEvents: 'none',
          }} />
          <LogoImage width={270} height={160} style={{ position: 'relative', display: 'block' }} />
        </div>

       

        {/* Sous-titre */}
        <p style={{
          fontFamily: "'Khand', sans-serif",
          color: 'var(--creme)',
          fontSize: 'clamp(.8rem, 1.8vw, 1rem)',
          letterSpacing: '.45em',
          textTransform: 'uppercase',
          marginTop: '12px',
          opacity: .82,
        }}>
          Charpenterie &amp; Construction Bois
        </p>

        {/* CTA */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0', justifyContent: 'center', marginTop: '36px' }}>
          <Link href="/devis" className="btn-primary-ow">Demander mon devis</Link>
          <Link href="/realisations" className="btn-ghost-ow">Voir nos réalisations</Link>
        </div>
      </div>

      <style jsx>{`
        .hero-content-wrap {
          opacity: 0;
          transform: translateY(18px);
        }
        .hero-content-wrap.hero-ready {
          animation: heroAppear 1.1s ease-out .15s forwards;
        }
        @keyframes heroAppear {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
