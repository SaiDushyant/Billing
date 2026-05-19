/*
  Warnings:

  - The values [PENDING] on the enum `DocumentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentStatus_new" AS ENUM ('DRAFT', 'COMPLETED', 'CANCELLED', 'RETURNED');
ALTER TABLE "Document" ALTER COLUMN "status" TYPE "DocumentStatus_new" USING ("status"::text::"DocumentStatus_new");
ALTER TYPE "DocumentStatus" RENAME TO "DocumentStatus_old";
ALTER TYPE "DocumentStatus_new" RENAME TO "DocumentStatus";
DROP TYPE "public"."DocumentStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "isRefunded" BOOLEAN NOT NULL DEFAULT false;
