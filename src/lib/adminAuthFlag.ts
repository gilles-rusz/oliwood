// Interrupteur de démo : ADMIN_AUTH_BYPASS=true dans .env.local ouvre
// l'admin sans login. Ignoré dès que NODE_ENV vaut "production", donc
// impossible à activer sur le site livré au client.
// Ce module n'importe rien : il est utilisable depuis le middleware (edge).
export const adminAuthBypassed =
  process.env.NODE_ENV !== 'production' && process.env.ADMIN_AUTH_BYPASS === 'true'
