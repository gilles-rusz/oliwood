'use client'

import { CSSProperties } from 'react'
import Image from 'next/image'
import { FallingLayer } from './FallingLayer'

const BULB_COLORS = ['#e63946', '#ffe014', '#2f9e44', '#f4f1ec']
const BULB_COUNT = 26

function Garland() {
  const bulbs = Array.from({ length: BULB_COUNT }, (_, i) => {
    const t = i / (BULB_COUNT - 1)
    // Chaque ampoule suit la courbe du fil : 6 arcs successifs
    const droop = Math.abs(Math.sin(t * Math.PI * 6)) * 14
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

function Snowflake({ index }: { index: number }) {
  const glyphs = ['❄', '❅', '❆', '•']
  return <>{glyphs[index % glyphs.length]}</>
}

export function ChristmasDecor() {
  return (
    <>
      <div className="seasonal-glow xmas-glow" aria-hidden />
      <Garland />

      <div className="seasonal-corner xmas-houx-tl" aria-hidden>
        <Image src="/images/noel/houx.png" alt="" width={560} height={601} className="xmas-img" />
      </div>
      <div className="seasonal-corner xmas-houx-tr" aria-hidden>
        <Image src="/images/noel/houx.png" alt="" width={560} height={601} className="xmas-img" />
      </div>
      <div className="seasonal-corner xmas-sapin" aria-hidden>
        <Image src="/images/noel/sapin.png" alt="" width={512} height={760} className="xmas-img" />
      </div>
      <div className="seasonal-corner xmas-boules" aria-hidden>
        <Image src="/images/noel/boules.png" alt="" width={520} height={322} className="xmas-img" />
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
