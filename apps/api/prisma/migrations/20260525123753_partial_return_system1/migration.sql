/*
  Warnings:

  - You are about to drop the `DocumentReturn` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `DocumentReturnItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DocumentReturn" DROP CONSTRAINT "DocumentReturn_createdById_fkey";

-- DropForeignKey
ALTER TABLE "DocumentReturn" DROP CONSTRAINT "DocumentReturn_documentId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentReturnItem" DROP CONSTRAINT "DocumentReturnItem_documentItemId_fkey";

-- DropForeignKey
ALTER TABLE "DocumentReturnItem" DROP CONSTRAINT "DocumentReturnItem_returnId_fkey";

-- DropTable
DROP TABLE "DocumentReturn";

-- DropTable
DROP TABLE "DocumentReturnItem";
