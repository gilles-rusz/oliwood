'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export function HeroSection({ noel = false }: { noel?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const t = setTimeout(() => contentRef.current?.classList.add('hero-ready'), 120)
    return () => clearTimeout(t)
  }, [])

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>

      {/* ── Photo de fond ── */}
      <Image
        src={noel ? '/images/hero-noel.jpg' : '/images/hero.jpg'}
        alt="Charpente ossature bois Oli'Wood à Moirans-en-Montagne, Jura"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />

      {/* ── Dégradé sombre côté gauche uniquement ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(74,28,1,.9) 0%, rgba(74,28,1,.66) 32%, rgba(74,28,1,.2) 62%, transparent 85%)',
      }} />

      {/* ── Contenu, aligné à gauche ── */}
      <div
        ref={contentRef}
        className="hero-content-wrap"
        style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          maxWidth: 620, padding: '0 24px',
          marginLeft: 'clamp(16px, 6vw, 90px)',
        }}
      >
        <span style={{
          fontFamily: "'Khand', sans-serif",
          color: 'var(--jaune)',
          fontSize: 'clamp(.8rem, 1.6vw, .95rem)',
          letterSpacing: '.35em',
          textTransform: 'uppercase',
          fontWeight: 600,
          marginBottom: '18px',
        }}>
          Artisan menuisier · Ossature bois
        </span>

        <h1 style={{
          fontFamily: "'Oleo Script', cursive",
          fontSize: 'clamp(38px, 6vw, 68px)',
          color: 'var(--creme)',
          lineHeight: 1.1,
          marginBottom: '20px',
        }}>
          Le bois, travaillé à votre image.
        </h1>

        <p style={{
          fontFamily: "'Khand', sans-serif",
          color: 'var(--creme)',
          fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
          fontWeight: 300,
          lineHeight: 1.5,
          opacity: .9,
          marginBottom: '34px',
        }}>
          Installés à Moirans-en-Montagne, dans le Jura, nous concevons et fabriquons vos structures bois sur mesure — de l&apos;étude à la pose.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/realisations" className="btn-ghost-ow" style={{ marginLeft: 0 }}>Nos réalisations</Link>
          <Link href="/devis" className="btn-primary-ow">Devis gratuit →</Link>
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
