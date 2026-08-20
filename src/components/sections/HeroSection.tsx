'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { LogoImage } from '@/components/ui/LogoImage'

const MADE_IN_JURA_URL = 'https://www.madeinjura.pro/entreprises/oliwood/'

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
        alt="Structures bois Oli'Wood à Moirans-en-Montagne, Jura"
        fill
        priority
        style={{ objectFit: 'cover' }}
      />

      {/* ── Dégradé sombre côté gauche uniquement ── */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(74,28,1,.9) 0%, rgba(74,28,1,.66) 32%, rgba(74,28,1,.2) 62%, transparent 85%)',
      }} />

      {/* ── Logo Oli'Wood, centré en haut ── */}
      <div className="hero-logo" aria-hidden>
        <LogoImage width={150} height={150} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
      </div>

      {/* ── Badge Made in Jura, en haut à droite ── */}
      <a
        href={MADE_IN_JURA_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hero-jura"
        title="Oli'Wood, adhérent Made in Jura n°160630"
      >
        <Image
          src="/images/made-in-jura.png"
          alt="Made in Jura — adhérent n°160630"
          width={520}
          height={758}
          style={{ width: '100%', height: 'auto', display: 'block' }}
        />
      </a>

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
          Artisan menuisier · Structures bois
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
          Installé à Moirans-en-Montagne, dans le Jura, je conçois et fabrique vos structures bois sur mesure — du devis à la pose.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px' }}>
          <Link href="/realisations" className="btn-ghost-ow" style={{ marginLeft: 0 }}>Mes réalisations</Link>
          <Link href="/devis" className="btn-primary-ow">Devis gratuit →</Link>
        </div>
      </div>

      <style jsx>{`
        .hero-logo {
          position: absolute;
          top: clamp(84px, 11vh, 118px);
          left: 50%;
          z-index: 12;
          width: clamp(104px, 13vw, 172px);
          transform: translateX(-50%);
          filter: drop-shadow(0 10px 22px rgba(0, 0, 0, .45));
          animation: logoDrop 1s cubic-bezier(.2, .8, .3, 1) .25s both,
                     logoFloat 6s ease-in-out 1.4s infinite;
        }
        .hero-jura {
          position: absolute;
          top: clamp(84px, 11vh, 118px);
          right: clamp(16px, 4vw, 54px);
          z-index: 12;
          display: block;
          width: clamp(78px, 9vw, 118px);
          padding: 10px 10px 8px;
          border-radius: 14px;
          background: var(--creme);
          border: 2px solid var(--jaune);
          box-shadow: 0 8px 20px rgba(0, 0, 0, .4);
          animation: juraWiggle 5s ease-in-out 1.8s infinite;
          transition: transform .25s;
        }
        .hero-jura:hover {
          transform: scale(1.08) rotate(0deg);
          animation-play-state: paused;
        }
        @keyframes logoDrop {
          from { opacity: 0; transform: translateX(-50%) translateY(-40px) rotate(-25deg) scale(.7); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0) rotate(0) scale(1); }
        }
        @keyframes logoFloat {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50%      { transform: translateX(-50%) translateY(-8px); }
        }
        @keyframes juraWiggle {
          0%, 62%, 100%       { transform: rotate(0deg) scale(1); }
          66%                 { transform: rotate(-7deg) scale(1.06); }
          70%                 { transform: rotate(6deg) scale(1.06); }
          74%                 { transform: rotate(-5deg) scale(1.05); }
          78%                 { transform: rotate(4deg) scale(1.04); }
          82%                 { transform: rotate(-2deg) scale(1.02); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-logo, .hero-jura { animation: none; }
        }
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
