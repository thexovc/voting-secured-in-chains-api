/*
  Warnings:

  - Added the required column `matNo` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "matNo" TEXT NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL;
