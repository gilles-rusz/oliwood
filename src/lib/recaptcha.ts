export async function verifyRecaptcha(token: string): Promise<number> {
  const secret = process.env.RECAPTCHA_SECRET_KEY
  if (!secret) {
    console.warn('[reCAPTCHA] RECAPTCHA_SECRET_KEY manquant — score par défaut 1')
    return 1
  }

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }).toString(),
    })

    const data = await res.json() as { success: boolean; score: number; action: string }

    if (!data.success) return 0
    return data.score ?? 0
  } catch (e) {
    console.error('[reCAPTCHA] Erreur:', e)
    return 0
  }
}
