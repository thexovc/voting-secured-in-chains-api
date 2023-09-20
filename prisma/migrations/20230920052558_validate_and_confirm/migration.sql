-- AlterTable
ALTER TABLE "User" ADD COLUMN     "confirmed" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "manifesto" TEXT,
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "validated" BOOLEAN NOT NULL DEFAULT false;
