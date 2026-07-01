-- CreateEnum
CREATE TYPE "Category" AS ENUM ('CHARPENTE', 'TERRASSE', 'PERGOLA', 'CARPORT', 'OSSATURE_BOIS', 'CABANE', 'RENOVATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "Source" AS ENUM ('MANUAL', 'FACEBOOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "TypeProjet" AS ENUM ('CHARPENTE', 'TERRASSE', 'PERGOLA', 'CABANE', 'RENOVATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "Budget" AS ENUM ('MOINS_5K', 'ENTRE_5K_15K', 'ENTRE_15K_30K', 'ENTRE_30K_50K', 'PLUS_50K', 'A_DEFINIR');

-- CreateEnum
CREATE TYPE "StatutDevis" AS ENUM ('NOUVEAU', 'VU', 'EN_COURS', 'ENVOYE', 'ACCEPTE', 'REFUSE', 'ARCHIVE');

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Realisation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "category" "Category" NOT NULL DEFAULT 'AUTRE',
    "imageUrl" TEXT NOT NULL,
    "thumbUrl" TEXT,
    "source" "Source" NOT NULL DEFAULT 'MANUAL',
    "externalId" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Realisation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Devis" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telephone" TEXT,
    "typeProjet" "TypeProjet" NOT NULL,
    "description" TEXT,
    "budget" "Budget",
    "delai" TEXT,
    "ville" TEXT,
    "codePostal" TEXT,
    "statut" "StatutDevis" NOT NULL DEFAULT 'NOUVEAU',
    "notes" TEXT,
    "honeypot" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Devis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "seasonalTheme" TEXT,
    "seasonalActive" BOOLEAN NOT NULL DEFAULT false,
    "heroTitle" TEXT,
    "heroSubtitle" TEXT,
    "metaDescription" TEXT,
    "telephone" TEXT,
    "email" TEXT,
    "adresse" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Realisation_externalId_key" ON "Realisation"("externalId");
