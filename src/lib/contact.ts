import { getSiteSettings } from './settings'

export const DEFAULT_ADRESSE   = '1 Chemin sous Tongea, 39260 Moirans-en-Montagne'
export const DEFAULT_TELEPHONE = '06 52 14 74 34'
export const DEFAULT_EMAIL     = 'oliwood.eurl@gmail.com'

export const RAISON_SOCIALE  = "OLI'WOOD"
export const FORME_JURIDIQUE = 'EURL (entreprise unipersonnelle à responsabilité limitée)'
export const CAPITAL_SOCIAL  = '1 000 €'
export const SIREN           = '883 952 681'
export const SIRET           = '883 952 681 00020'
export const RCS             = '883 952 681 R.C.S. Lons-le-Saunier'
export const TVA             = 'FR81883952681'
export const DIRECTEUR       = 'Olivier Nirrengarten'

export async function getContactInfos() {
  const settings = await getSiteSettings()

  return {
    adresse:   settings?.adresse   || DEFAULT_ADRESSE,
    telephone: settings?.telephone || DEFAULT_TELEPHONE,
    email:     settings?.email     || DEFAULT_EMAIL,
  }
}
