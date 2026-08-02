# OliWood — Site Web

Stack : **Next.js 14** · **Supabase** · **Prisma** · **NextAuth** · **Tailwind CSS**

---

## 🚀 Installation rapide

### Développement local (sans Supabase)

Docker Desktop doit être installé et démarré.

```bash
npm install
npm run setup:local
npm run admin:create
npm run dev
```

`setup:local` crée automatiquement `.env`, démarre PostgreSQL dans Docker et initialise les tables. Ouvrir [http://localhost:3000](http://localhost:3000), puis l'admin sur [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

Pour arrêter la base locale :

```bash
npm run db:local:stop
```

### Connexion à Supabase

```bash
cp .env.example .env
# Remplir les variables Supabase et PostgreSQL dans .env
npm run db:generate
npm run db:push
npm run admin:create
npm run dev
```

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── (site)/              ← Pages publiques
│   │   ├── page.tsx         ← Accueil
│   │   ├── realisations/    ← Galerie
│   │   └── devis/           ← Formulaire devis
│   ├── admin/               ← Back-office (protégé)
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── galerie/         ← Gestion photos
│   │   └── settings/        ← Réglages + décors saisonniers
│   └── api/
│       ├── contact/         ← Route devis (honeypot + reCAPTCHA v3)
│       ├── upload/          ← Upload photos vers Supabase
│       ├── realisations/    ← CRUD photos
│       ├── admin/settings/  ← Réglages site
│       └── webhooks/facebook/ ← Sync auto Facebook → galerie
├── components/
│   ├── layout/  Navbar, Footer
│   ├── sections/ HeroSection, ServicesSection, DevisForm, ...
│   ├── ui/      SeasonalDecorations
│   └── admin/   AdminSidebar, AdminGalerieClient
└── lib/
    ├── prisma.ts    Client DB
    ├── email.ts     Nodemailer
    ├── recaptcha.ts Vérification reCAPTCHA v3
    ├── rateLimit.ts Anti-spam
    └── settings.ts  Paramètres site
```

---

## 🔐 Sécurité

| Mesure | Détail |
|---|---|
| **Honeypot** | Champ caché dans le formulaire — si rempli → silencieusement ignoré |
| **reCAPTCHA v3** | Score < 0.5 → requête rejetée |
| **Rate limiting** | 5 requêtes / 15 min par IP sur `/api/contact` |
| **Headers HTTP** | CSP, X-Frame-Options, HSTS via `next.config.js` |
| **Auth admin** | JWT NextAuth, session 8h, bcrypt sur le mot de passe |
| **Middleware** | Toutes les routes `/admin/*` vérifiées côté serveur |
| **Upload** | Vérification MIME + taille max 10 Mo |

---

## 🌐 Déploiement Vercel

1. Push le projet sur GitHub
2. Connecter le repo sur [vercel.com](https://vercel.com)
3. Ajouter toutes les variables d'env dans Vercel Dashboard
4. Deploy → c'est en ligne

---

## 📸 Ajout photo Supabase

Dans le dashboard Supabase :
1. Créer un bucket `realisations` (public)
2. Activer les policies de lecture publique

---

## 🔗 Webhook Facebook

URL à configurer dans Meta for Developers :
```
https://votre-domaine.com/api/webhooks/facebook
```
- Champs à souscrire : `feed`
- Token de vérification : valeur de `META_WEBHOOK_VERIFY_TOKEN` dans `.env`

---

## 🎄 Décors saisonniers

Dans l'admin → Réglages → Décoration saisonnière :
- Choisir un thème : **Noël** (guirlande lumineuse, houx dans les angles hauts, sapin décoré, boules de Noël, neige, + photo hero enneigée `public/images/hero-noel.jpg`) ou **Printemps** (cerisiers en fleurs, pétales, prairie fleurie, papillon)
- Le clic sur un thème affiche un **aperçu immédiat** dans l'admin
- Le bouton *Visible par les visiteurs* + *Enregistrer* applique le décor sur le site public (les pages statiques sont revalidées automatiquement)
- Décors allégés sur mobile et désactivés si le visiteur a activé « réduire les animations »

Le code vit dans `src/components/ui/seasonal/` et le CSS dans la section « Décors saisonniers » de `src/app/globals.css`.
