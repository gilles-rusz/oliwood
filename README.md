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
npm run seed:realisations
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
npm run seed:realisations
npm run dev
```

### Galerie : photos livrées avec le site

Les photos du catalogue initial sont versionnées dans `public/images/realisations/<catégorie>/`.
`npm run seed:realisations` crée les fiches correspondantes en base (titre, catégorie, ordre).
Le script est idempotent : on peut le relancer après chaque déploiement sans créer de doublons.
Sur une fiche déjà en base, il ne réécrit que le chemin de l'image : les titres, descriptions,
catégories et statuts modifiés depuis l'admin sont conservés.

Chaque vignette de l'admin affiche la référence de sa photo (par ex. `pergola-07`), et un champ de
recherche permet de retrouver une photo par titre, description ou référence.

Les photos ajoutées ensuite depuis l'admin sont, elles, envoyées dans le bucket Supabase Storage
`realisations` ; les deux sources s'affichent dans la même galerie.

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
│   │   ├── settings/        ← Réglages, textes, coordonnées, décors saisonniers
│   │   └── compte/          ← Email et mot de passe de connexion
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

## 🔑 Back-office : connexion et compte admin

| Besoin | Commande / écran |
|---|---|
| Créer ou réinitialiser le compte | `npm run admin:create` (ou `npm run admin:create -- email "motdepasse"`) |
| Diagnostiquer une connexion refusée | `npm run admin:check` (ou `npm run admin:check -- email "motdepasse"`) |
| Générer un hash pour Vercel | `npm run admin:hash -- "MonMotDePasse"` |
| Changer email / mot de passe | `/admin/compte` |

Sur un environnement où l'on ne peut pas lancer de script (Vercel), renseigner
`ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` : la première connexion avec ces
identifiants crée le compte en base, puis tout se gère depuis `/admin/compte`.

`NEXTAUTH_SECRET` doit être défini partout : sans lui, la session n'est pas
signée et la connexion échoue en production. La session reste valide 30 jours.

---

## 🔐 Sécurité

| Mesure | Détail |
|---|---|
| **Honeypot** | Champ caché dans le formulaire — si rempli → silencieusement ignoré |
| **reCAPTCHA v3** | Score < 0.5 → requête rejetée |
| **Rate limiting** | 5 requêtes / 15 min par IP sur `/api/contact` |
| **Headers HTTP** | CSP, X-Frame-Options, HSTS via `next.config.js` |
| **Auth admin** | JWT NextAuth, session 30 jours, bcrypt sur le mot de passe |
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
