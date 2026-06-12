'use client'

import { useEffect, useRef } from 'react'

interface Props {
  theme: string
}

const CONFIGS: Record<string, { chars: string[]; count: number; speed: [number, number] }> = {
  NOEL:      { chars: ['❄', '❅', '❆', '·'], count: 40, speed: [4, 12] },
  PRINTEMPS: { chars: ['🌸', '🌺', '✿', '❀'], count: 25, speed: [5, 14] },
}

export function SeasonalDecorations({ theme }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const config = CONFIGS[theme]
    if (!config || !containerRef.current) return

    const container = containerRef.current
    const particles: HTMLSpanElement[] = []

    for (let i = 0; i < config.count; i++) {
      const el = document.createElement('span')
      el.className = 'snow-particle'
      el.textContent = config.chars[Math.floor(Math.random() * config.chars.length)]

      const left     = Math.random() * 100
      const duration = config.speed[0] + Math.random() * (config.speed[1] - config.speed[0])
      const delay    = Math.random() * -duration
      const size     = 0.75 + Math.random() * 0.75

      el.style.cssText = `
        left: ${left}vw;
        font-size: ${size}rem;
        animation-duration: ${duration}s;
        animation-delay: ${delay}s;
        opacity: ${0.4 + Math.random() * 0.4};
      `

      container.appendChild(el)
      particles.push(el)
    }

    return () => particles.forEach(p => p.remove())
  }, [theme])

  return <div ref={containerRef} aria-hidden style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }} />
}
