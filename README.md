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

# 5. Créer le compte admin (email + mot de passe, stockés en base)
npm run admin:create

# 6. Lancer en développement
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000), admin sur [/admin/login](http://localhost:3000/admin/login).

---

## 🔑 Connexion admin : dépannage

Le compte admin vit dans la table `Admin` de la base, jamais dans `.env.local`.
Un seul compte suffit : `npm run admin:create` avec un email déjà existant
**remplace simplement son mot de passe**.

```bash
# Diagnostic complet : variables d'env, base, comptes existants
npm run admin:check

# Vérifier un couple email / mot de passe précis
node scripts/checkAdmin.mjs mon@email.fr "monMotDePasse"
```

| Symptôme | Cause | Correctif |
|---|---|---|
| Login accepté puis retour immédiat sur `/admin/login` | `NEXTAUTH_SECRET` absent ou modifié : le cookie de session ne peut plus être relu | Définir un `NEXTAUTH_SECRET` fixe (`openssl rand -base64 32`) dans `.env.local` et redémarrer |
| Reconnexion demandée à chaque redémarrage de `npm run dev` | idem | idem |
| « Email ou mot de passe incorrect » | Aucun admin en base, email saisi différent, ou mot de passe écrit dans une autre base | `npm run admin:check` puis `npm run admin:create` |
| Login qui échoue après changement de port | `NEXTAUTH_URL` ne correspond plus au port réel | Aligner `NEXTAUTH_URL` sur l'URL de `npm run dev` |

L'email est comparé en minuscules et sans espaces : `Contact@Oliwood.fr` et
`contact@oliwood.fr` sont le même compte.

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
| **Auth admin** | JWT NextAuth, session 8h, bcrypt (coût 12) sur le mot de passe, minimum 12 caractères |
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
