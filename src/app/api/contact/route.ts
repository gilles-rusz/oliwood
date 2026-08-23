import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'
import { sendDevisEmail } from '@/lib/email'
import { verifyRecaptcha } from '@/lib/recaptcha'
import { rateLimit } from '@/lib/rateLimit'

const schema = z.object({
  // Honeypot
  website: z.string().max(0),

  typeProjet:     z.enum(['CHARPENTE','TERRASSE','PERGOLA','CARPORT','CABANE','RENOVATION','AUTRE']),
  budget:         z.enum(['MOINS_5K','ENTRE_5K_15K','ENTRE_15K_30K','ENTRE_30K_50K','PLUS_50K','A_DEFINIR']).optional(),
  description:    z.string().max(2000).optional(),
  longueur:       z.number().positive().max(200).optional(),
  largeur:        z.number().positive().max(200).optional(),
  hauteur:        z.number().positive().max(200).optional(),
  typeTerrain:    z.string().max(200).optional(),
  implantation:   z.enum(['ADOSSE','AUTOPORTE']).optional(),
  plotsBeton:     z.enum(['OUI','NON']).optional(),
  toiture:        z.string().max(1000).optional(),
  finitionBois:   z.string().max(1000).optional(),
  prenom:         z.string().min(2).max(50),
  nom:            z.string().min(2).max(50),
  email:          z.string().email(),
  telephone:      z.string().optional(),
  adresse:        z.string().max(200).optional(),
  ville:          z.string().optional(),
  recaptchaToken: z.string(),
})

export async function POST(req: NextRequest) {
  // ── Rate limiting ────────────────────────────────────────
  const ip = req.headers.get('x-forwarded-for') ?? req.headers.get('x-real-ip') ?? 'unknown'
  const limited = await rateLimit(ip, 'contact', 5, 900_000) // 5 requêtes / 15 min
  if (limited) {
    return NextResponse.json({ error: 'Trop de requêtes, réessayez plus tard.' }, { status: 429 })
  }

  // ── Parse body ───────────────────────────────────────────
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Données invalides' }, { status: 400 })
  }

  const data = parsed.data

  // ── Honeypot ─────────────────────────────────────────────
  if (data.website) {
    // Faux succès pour ne pas révéler la détection au bot
    return NextResponse.json({ ok: true })
  }

  // ── reCAPTCHA v3 ─────────────────────────────────────────
  const recaptchaScore = await verifyRecaptcha(data.recaptchaToken)
  if (recaptchaScore < 0.5) {
    return NextResponse.json({ error: 'Vérification échouée. Réessayez.' }, { status: 403 })
  }

  // ── Sauvegarde en base ───────────────────────────────────
  try {
    const devis = await prisma.devis.create({
      data: {
        prenom:      data.prenom,
        nom:         data.nom,
        email:       data.email,
        telephone:   data.telephone ?? null,
        typeProjet:  data.typeProjet,
        description: data.description ?? null,
        budget:      data.budget ?? null,
        longueur:     data.longueur ?? null,
        largeur:      data.largeur ?? null,
        hauteur:      data.hauteur ?? null,
        typeTerrain:  data.typeTerrain ?? null,
        implantation: data.implantation ?? null,
        plotsBeton:   data.plotsBeton ? data.plotsBeton === 'OUI' : null,
        toiture:      data.toiture ?? null,
        finitionBois: data.finitionBois ?? null,
        adresse:     data.adresse ?? null,
        ville:       data.ville ?? null,
        ipAddress:   ip,
        userAgent:   req.headers.get('user-agent') ?? null,
        honeypot:    data.website || null,
      },
    })

    // ── Email de notification ────────────────────────────────
    // La demande est déjà enregistrée : un SMTP absent ou en panne
    // ne doit pas faire échouer le formulaire côté visiteur.
    try {
      await sendDevisEmail(devis)
    } catch (e) {
      console.error('[Contact API] Email non envoyé:', e)
    }

    return NextResponse.json({ ok: true })
  } catch (e) {
    console.error('[Contact API] Error:', e)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
