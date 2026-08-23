-- CreateEnum
CREATE TYPE "Implantation" AS ENUM ('ADOSSE', 'AUTOPORTE');

-- AlterEnum
ALTER TYPE "TypeProjet" ADD VALUE 'CARPORT';

-- AlterTable
ALTER TABLE "Devis" ADD COLUMN     "adresse" TEXT,
ADD COLUMN     "finitionBois" TEXT,
ADD COLUMN     "hauteur" DOUBLE PRECISION,
ADD COLUMN     "implantation" "Implantation",
ADD COLUMN     "largeur" DOUBLE PRECISION,
ADD COLUMN     "longueur" DOUBLE PRECISION,
ADD COLUMN     "plotsBeton" BOOLEAN,
ADD COLUMN     "toiture" TEXT,
ADD COLUMN     "typeTerrain" TEXT;
