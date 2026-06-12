# OliWood — Site Web

Stack : **Next.js 14** · **Supabase** · **Prisma** · **NextAuth** · **Tailwind CSS**

---

## 🚀 Installation rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Copier le fichier d'environnement
cp .env.example .env.local
# → Remplir toutes les variables dans .env.local

# 3. Générer le client Prisma
npm run db:generate

# 4. Pousser le schéma vers Supabase
npm run db:push

# 5. Créer le compte admin
node scripts/createAdmin.mjs

# 6. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000)

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
- Choisir un thème (Noël ❄, Printemps 🌸)
- Activer/désactiver en un clic
- S'applique en temps réel sur tout le site
