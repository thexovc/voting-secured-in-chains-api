/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Election` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Election_name_key" ON "Election"("name");
