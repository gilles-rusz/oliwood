'use client'

import { FallingLayer } from './FallingLayer'

function BlossomBranch({ className }: { className?: string }) {
  const flowers = [
    { x: 42, y: 30, r: 9, c: '#f8b6c8' },
    { x: 86, y: 48, r: 11, c: '#ffd1dc' },
    { x: 128, y: 66, r: 8.5, c: '#f8b6c8' },
    { x: 168, y: 88, r: 10, c: '#ffe0e8' },
  ]
  return (
    <svg viewBox="0 0 220 140" className={className} aria-hidden>
      <path d="M0 14 C 60 24, 130 46, 200 84" fill="none" stroke="#6b4423" strokeWidth="5" strokeLinecap="round" />
      <g stroke="#6b4423" strokeWidth="3" strokeLinecap="round">
        <path d="M60 22 l 16 -16" />
        <path d="M110 40 l 20 -12" />
        <path d="M156 62 l 14 -18" />
      </g>
      <g fill="#7cb342">
        <ellipse cx="80" cy="14" rx="11" ry="6" transform="rotate(-25 80 14)" />
        <ellipse cx="136" cy="26" rx="10" ry="5.5" transform="rotate(-15 136 26)" />
      </g>
      {flowers.map(({ x, y, r, c }, i) => (
        <g key={i}>
          {Array.from({ length: 5 }, (_, p) => (
            <ellipse
              key={p}
              cx={x}
              cy={y - r * 0.85}
              rx={r * 0.45}
              ry={r * 0.85}
              fill={c}
              transform={`rotate(${p * 72} ${x} ${y})`}
            />
          ))}
          <circle cx={x} cy={y} r={r * 0.3} fill="#ffe014" />
        </g>
      ))}
    </svg>
  )
}

function Meadow({ className }: { className?: string }) {
  const blooms = [
    { x: 26, y: 62, c: '#ffe014' },
    { x: 62, y: 48, c: '#f8b6c8' },
    { x: 98, y: 66, c: '#f4f1ec' },
    { x: 132, y: 52, c: '#ffe014' },
  ]
  return (
    <svg viewBox="0 0 160 110" className={className} aria-hidden>
      <g stroke="#4f8a35" strokeWidth="4" strokeLinecap="round" fill="none">
        {Array.from({ length: 12 }, (_, i) => {
          const x = 8 + i * 13
          const h = 30 + ((i * 37) % 45)
          return <path key={i} d={`M${x} 108 q ${i % 2 ? 8 : -8} -${h / 2}, ${i % 2 ? 3 : -3} -${h}`} />
        })}
      </g>
      {blooms.map(({ x, y, c }, i) => (
        <g key={i} className="spring-bloom" style={{ animationDelay: `${i * 0.6}s`, transformOrigin: `${x}px ${y}px` }}>
          <path d={`M${x} 108 q 4 -${(108 - y) / 2}, 0 -${108 - y}`} stroke="#4f8a35" strokeWidth="3.5" fill="none" />
          {Array.from({ length: 5 }, (_, p) => (
            <ellipse key={p} cx={x} cy={y - 7} rx={3.6} ry={7} fill={c} transform={`rotate(${p * 72} ${x} ${y})`} />
          ))}
          <circle cx={x} cy={y} r="3" fill="#e8a020" />
        </g>
      ))}
    </svg>
  )
}

function Butterfly({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 46" className={className} aria-hidden>
      <g fill="#ffb703" opacity=".9">
        <ellipse cx="18" cy="17" rx="15" ry="11" transform="rotate(-25 18 17)" />
        <ellipse cx="42" cy="17" rx="15" ry="11" transform="rotate(25 42 17)" />
        <ellipse cx="21" cy="32" rx="10" ry="8" transform="rotate(-15 21 32)" />
        <ellipse cx="39" cy="32" rx="10" ry="8" transform="rotate(15 39 32)" />
      </g>
      <rect x="28.5" y="10" width="3" height="28" rx="1.5" fill="#6b4423" />
    </svg>
  )
}

function Petal() {
  return (
    <svg viewBox="0 0 20 26" width="18" height="24" aria-hidden>
      <path d="M10 0 C 18 8, 18 18, 10 26 C 2 18, 2 8, 10 0z" fill="#f8b6c8" />
      <path d="M10 3 C 15 9, 15 17, 10 23 C 8 17, 8 9, 10 3z" fill="#ffd8e2" opacity=".8" />
    </svg>
  )
}

export function SpringDecor() {
  return (
    <>
      <div className="seasonal-glow spring-glow" aria-hidden />

      <div className="seasonal-corner spring-branch-tl" aria-hidden>
        <BlossomBranch className="spring-svg" />
      </div>
      <div className="seasonal-corner spring-branch-tr" aria-hidden>
        <BlossomBranch className="spring-svg" />
      </div>
      <div className="seasonal-corner spring-meadow-bl" aria-hidden>
        <Meadow className="spring-svg" />
      </div>
      <div className="seasonal-corner spring-meadow-br" aria-hidden>
        <Meadow className="spring-svg" />
      </div>
      <div className="seasonal-corner spring-butterfly" aria-hidden>
        <Butterfly className="spring-svg" />
      </div>

      <FallingLayer
        count={22}
        duration={[11, 22]}
        scale={[0.6, 1.2]}
        opacity={[0.5, 0.95]}
        className="spring-petal"
        render={() => <Petal />}
      />
    </>
  )
}
