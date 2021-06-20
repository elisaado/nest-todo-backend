/*
  Warnings:

  - You are about to drop the column `Verified` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Verified",
ADD COLUMN     "verificationCode" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "verified" BOOLEAN NOT NULL DEFAULT false;
