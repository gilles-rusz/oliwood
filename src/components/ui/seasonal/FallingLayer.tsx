'use client'

import { CSSProperties, ReactNode, useMemo } from 'react'

interface Props {
  count: number
  /** Rendu d'une particule, en fonction de son index */
  render: (index: number) => ReactNode
  /** Durée de chute en secondes */
  duration: [number, number]
  /** Échelle appliquée à la particule */
  scale: [number, number]
  opacity: [number, number]
  className?: string
}

function between([min, max]: [number, number]) {
  return min + Math.random() * (max - min)
}

export function FallingLayer({ count, render, duration, scale, opacity, className }: Props) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const fall = between(duration)
        return {
          key: i,
          left: Math.random() * 100,
          fall,
          delay: -Math.random() * fall,
          sway: 3 + Math.random() * 4,
          scale: between(scale),
          opacity: between(opacity),
        }
      }),
    [count, duration, scale, opacity]
  )

  return (
    <div className="seasonal-layer" aria-hidden>
      {particles.map(p => (
        <span
          key={p.key}
          className={`seasonal-particle ${className ?? ''}`}
          style={{
            left: `${p.left}vw`,
            animationDuration: `${p.fall}s`,
            animationDelay: `${p.delay}s`,
            opacity: p.opacity,
          }}
        >
          <span
            className="seasonal-particle-inner"
            style={{ animationDuration: `${p.sway}s`, '--particle-scale': p.scale } as CSSProperties}
          >
            {render(p.key)}
          </span>
        </span>
      ))}
    </div>
  )
}
