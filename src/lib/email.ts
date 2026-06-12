import nodemailer from 'nodemailer'
import type { Devis } from '@prisma/client'

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST,
  port:   Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendDevisEmail(devis: Devis) {
  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #c8823c; border-bottom: 1px solid #eee; padding-bottom: 12px;">
        Nouvelle demande de devis OliWood
      </h2>
      <table style="width:100%; border-collapse: collapse;">
        <tr><td style="padding:6px 0; color:#666; width:140px;">Prénom / Nom</td>
            <td style="padding:6px 0;"><strong>${devis.prenom} ${devis.nom}</strong></td></tr>
        <tr><td style="padding:6px 0; color:#666;">Email</td>
            <td style="padding:6px 0;"><a href="mailto:${devis.email}">${devis.email}</a></td></tr>
        ${devis.telephone ? `<tr><td style="padding:6px 0; color:#666;">Téléphone</td>
            <td style="padding:6px 0;">${devis.telephone}</td></tr>` : ''}
        ${devis.ville ? `<tr><td style="padding:6px 0; color:#666;">Ville</td>
            <td style="padding:6px 0;">${devis.ville}</td></tr>` : ''}
        <tr><td style="padding:6px 0; color:#666;">Type de projet</td>
            <td style="padding:6px 0;"><strong>${devis.typeProjet}</strong></td></tr>
        ${devis.budget ? `<tr><td style="padding:6px 0; color:#666;">Budget</td>
            <td style="padding:6px 0;">${devis.budget}</td></tr>` : ''}
        ${devis.description ? `<tr><td colspan="2" style="padding:12px 0;">
            <p style="color:#666; margin:0 0 6px;">Description :</p>
            <p style="background:#f9f9f9; padding:12px; border-left:3px solid #c8823c; margin:0;">
              ${devis.description.replace(/\n/g, '<br>')}
            </p></td></tr>` : ''}
      </table>
      <p style="color:#999; font-size:12px; margin-top:24px; border-top:1px solid #eee; padding-top:12px;">
        Envoyé le ${new Date().toLocaleDateString('fr-FR', { dateStyle: 'full', timeStyle: 'short' })}
        — ID: ${devis.id}
      </p>
    </div>
  `

  await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to:      process.env.EMAIL_TO,
    subject: `[OliWood] Nouveau devis — ${devis.prenom} ${devis.nom} (${devis.typeProjet})`,
    html,
    replyTo: devis.email,
  })
}
