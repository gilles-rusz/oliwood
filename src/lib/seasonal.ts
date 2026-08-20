export const SEASONAL_THEMES = ['NOEL', 'PRINTEMPS'] as const

export type SeasonalTheme = (typeof SEASONAL_THEMES)[number]

export const SEASONAL_LABELS: Record<SeasonalTheme, { label: string; icon: string; desc: string }> = {
  NOEL:      { label: 'Noël',      icon: '🎄', desc: 'Guirlande, houx, boules, neige + accueil enneigé' },
  PRINTEMPS: { label: 'Printemps', icon: '🌸', desc: 'Cerisiers, pétales, prairie fleurie' },
}

export function isSeasonalTheme(value: unknown): value is SeasonalTheme {
  return typeof value === 'string' && (SEASONAL_THEMES as readonly string[]).includes(value)
}
