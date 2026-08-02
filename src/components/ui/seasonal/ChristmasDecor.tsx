'use client'

import { CSSProperties } from 'react'
import { FallingLayer } from './FallingLayer'

const BULB_COLORS = ['#e63946', '#ffe014', '#2f9e44', '#f4f1ec']
const BULB_COUNT = 26

function Garland() {
  const bulbs = Array.from({ length: BULB_COUNT }, (_, i) => {
    const t = i / (BULB_COUNT - 1)
    // Chaque ampoule suit la courbe du fil : 3 arcs successifs
    const droop = Math.abs(Math.sin(t * Math.PI * 3)) * 16
    return { i, left: t * 100, top: 4 + droop, color: BULB_COLORS[i % BULB_COLORS.length] }
  })

  return (
    <div className="xmas-garland" aria-hidden>
      <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="xmas-garland-wire">
        <path
          d="M0 4 Q 8.33 24, 16.66 4 T 33.33 4 T 50 4 T 66.66 4 T 83.33 4 T 100 4"
          fill="none"
          stroke="#3b2a12"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {bulbs.map(({ i, left, top, color }) => (
        <span
          key={i}
          className="xmas-bulb"
          style={{
            left: `${left}%`,
            top: `${top}px`,
            '--bulb-color': color,
            animationDelay: `${(i % 5) * 0.35}s`,
          } as CSSProperties}
        />
      ))}
    </div>
  )
}

function HollySprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden>
      <g fill="#2f7a3d">
        <path d="M12 46c14-22 38-30 58-26-6 10-4 18 2 25-16 10-42 12-60 1z" />
        <path d="M52 22c16-14 38-16 56-8-9 8-11 16-8 25-18 3-38-3-48-17z" opacity=".9" />
        <path d="M46 62c18-6 38-2 52 10-13 7-18 14-19 23-14-9-27-20-33-33z" opacity=".8" />
      </g>
      <g fill="#c8102e">
        <circle cx="60" cy="46" r="7" />
        <circle cx="74" cy="52" r="6" />
        <circle cx="66" cy="60" r="5.5" />
      </g>
      <g fill="#f4f1ec" opacity=".55">
        <circle cx="57.5" cy="43.5" r="1.8" />
        <circle cx="72" cy="50" r="1.5" />
      </g>
    </svg>
  )
}

// Branche de sapin : courbe quadratique garnie d'aiguilles perpendiculaires
const BRANCH = { p0: [4, 8], c: [110, 26], p1: [206, 104] } as const

function branchPoint(t: number) {
  const [x0, y0] = BRANCH.p0
  const [cx, cy] = BRANCH.c
  const [x1, y1] = BRANCH.p1
  const u = 1 - t
  const x = u * u * x0 + 2 * u * t * cx + t * t * x1
  const y = u * u * y0 + 2 * u * t * cy + t * t * y1
  const dx = 2 * u * (cx - x0) + 2 * t * (x1 - cx)
  const dy = 2 * u * (cy - y0) + 2 * t * (y1 - cy)
  const len = Math.hypot(dx, dy)
  return { x, y, nx: -dy / len, ny: dx / len, tx: dx / len, ty: dy / len }
}

function PineBranch({ className }: { className?: string }) {
  const needles = Array.from({ length: 26 }, (_, i) => {
    const t = 0.03 + (i / 25) * 0.94
    const p = branchPoint(t)
    const len = 26 - Math.abs(t - 0.45) * 16
    return { p, len }
  })
  const baubles = [0.34, 0.62, 0.86].map((t, i) => {
    const p = branchPoint(t)
    return {
      x: p.x,
      y: p.y,
      drop: [26, 34, 22][i],
      r: [10, 8.5, 7.5][i],
      color: ['#c8102e', '#ffe014', '#f4f1ec'][i],
    }
  })

  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden>
      <g stroke="#2b6b38" strokeLinecap="round" fill="none">
        {needles.map(({ p, len }, i) => (
          <g key={i} strokeWidth="3">
            <path d={`M${p.x} ${p.y} l ${(p.nx * 0.7 + p.tx * 0.7) * len} ${(p.ny * 0.7 + p.ty * 0.7) * len}`} />
            <path
              d={`M${p.x} ${p.y} l ${(-p.nx * 0.7 + p.tx * 0.7) * len} ${(-p.ny * 0.7 + p.ty * 0.7) * len}`}
              stroke="#37804a"
            />
            {i % 3 === 0 && (
              <path d={`M${p.x} ${p.y} l ${p.tx * len * 0.9} ${p.ty * len * 0.9}`} stroke="#245c30" opacity=".85" />
            )}
          </g>
        ))}
        <path
          d={`M${BRANCH.p0[0]} ${BRANCH.p0[1]} Q ${BRANCH.c[0]} ${BRANCH.c[1]}, ${BRANCH.p1[0]} ${BRANCH.p1[1]}`}
          stroke="#5a3a1c"
          strokeWidth="5"
        />
      </g>
      {baubles.map(({ x, y, drop, r, color }, i) => (
        <g key={i}>
          <line x1={x} y1={y} x2={x} y2={y + drop} stroke="#d9b45b" strokeWidth="2.2" />
          <circle cx={x} cy={y + drop + r} r={r} fill={color} />
          <circle cx={x - r * 0.35} cy={y + drop + r * 0.6} r={r * 0.28} fill="#fff" opacity=".45" />
        </g>
      ))}
    </svg>
  )
}

function FirTree({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="0 0 100 150" className={className} style={style} aria-hidden>
      <rect x="44" y="122" width="12" height="22" rx="2" fill="#5a3a1c" />
      <g fill="#1f5c33">
        <path d="M50 8 L78 56 L22 56 Z" />
        <path d="M50 38 L86 92 L14 92 Z" />
        <path d="M50 70 L94 128 L6 128 Z" />
      </g>
      <g fill="#f4f1ec" opacity=".85">
        <path d="M50 8 L62 28 Q50 22, 38 28 Z" />
        <path d="M50 38 L66 62 Q50 54, 34 62 Z" />
        <path d="M50 70 L70 100 Q50 90, 30 100 Z" />
      </g>
      <g>
        <circle cx="38" cy="72" r="3.5" fill="#e63946" />
        <circle cx="62" cy="84" r="3.5" fill="#ffe014" />
        <circle cx="46" cy="108" r="3.5" fill="#ffe014" />
        <circle cx="68" cy="114" r="3.5" fill="#e63946" />
      </g>
      <path d="M50 0 l3.5 7.5 8 1-6 5.5 1.7 8-7.2-4-7.2 4 1.7-8-6-5.5 8-1z" fill="#ffe014" />
    </svg>
  )
}

function Santa({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 90 110" className={className} aria-hidden>
      {/* Corps */}
      <path d="M24 108 q-2-34 21-34 t21 34 z" fill="#c8102e" />
      <rect x="22" y="96" width="46" height="10" rx="4" fill="#3b2a12" />
      <rect x="38" y="96" width="14" height="10" fill="#ffe014" />
      {/* Barbe */}
      <path d="M27 60 q18 34 36 0 q2 20-18 22 t-18-22z" fill="#f4f1ec" />
      {/* Visage */}
      <circle cx="45" cy="52" r="17" fill="#f3c9a8" />
      <circle cx="38" cy="50" r="2.4" fill="#3b2a12" />
      <circle cx="52" cy="50" r="2.4" fill="#3b2a12" />
      <circle cx="45" cy="58" r="4" fill="#e07a5f" />
      <path d="M31 62 q14 14 28 0 q-14 8-28 0z" fill="#f4f1ec" />
      {/* Bonnet */}
      <path d="M26 40 q19-26 38 0 z" fill="#c8102e" />
      <path d="M64 40 q10-16 4-24 q-8 4-12 12z" fill="#c8102e" />
      <rect x="24" y="36" width="42" height="9" rx="4.5" fill="#f4f1ec" />
      <circle cx="70" cy="14" r="7" fill="#f4f1ec" />
    </svg>
  )
}

function Snowflake({ index }: { index: number }) {
  const glyphs = ['❄', '❅', '❆', '•']
  return <>{glyphs[index % glyphs.length]}</>
}

export function ChristmasDecor() {
  return (
    <>
      <div className="seasonal-glow xmas-glow" aria-hidden />
      <Garland />

      <div className="seasonal-corner xmas-branch-tl" aria-hidden>
        <PineBranch className="xmas-svg" />
      </div>
      <div className="seasonal-corner xmas-holly-tr" aria-hidden>
        <HollySprig className="xmas-svg" />
      </div>
      <div className="seasonal-corner xmas-holly-bl" aria-hidden>
        <HollySprig className="xmas-svg" />
      </div>

      <div className="seasonal-corner xmas-trees" aria-hidden>
        <FirTree className="xmas-tree xmas-tree-small" />
        <Santa className="xmas-santa" />
        <FirTree className="xmas-tree" />
      </div>

      <FallingLayer
        count={38}
        duration={[9, 20]}
        scale={[0.7, 1.5]}
        opacity={[0.35, 0.85]}
        className="xmas-snow"
        render={i => <Snowflake index={i} />}
      />
    </>
  )
}
