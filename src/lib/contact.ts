import { getSiteSettings } from './settings'

export const DEFAULT_ADRESSE   = '1 Chemin sous Tongea, 39260 Moirans-en-Montagne'
export const DEFAULT_TELEPHONE = '06 52 14 74 34'
export const DEFAULT_EMAIL     = 'oliwood.eurl@gmail.com'

export const RAISON_SOCIALE  = "Oli'Wood"
export const FORME_JURIDIQUE = 'SARL'
export const RCS             = '883 952 681'
export const DIRECTEUR       = "Olivier, gérant d'Oli'Wood"

export async function getContactInfos() {
  const settings = await getSiteSettings()

  return {
    adresse:   settings?.adresse   || DEFAULT_ADRESSE,
    telephone: settings?.telephone || DEFAULT_TELEPHONE,
    email:     settings?.email     || DEFAULT_EMAIL,
  }
}
