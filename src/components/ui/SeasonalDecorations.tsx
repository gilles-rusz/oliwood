'use client'

import { useEffect, useState } from 'react'
import { ChristmasDecor } from './seasonal/ChristmasDecor'
import { SpringDecor } from './seasonal/SpringDecor'

export function SeasonalDecorations({ theme }: { theme: string }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.season = theme.toLowerCase()
    return () => { delete root.dataset.season }
  }, [theme])

  if (!mounted) return null
  if (theme === 'NOEL') return <ChristmasDecor />
  if (theme === 'PRINTEMPS') return <SpringDecor />
  return null
}
