/*
  Warnings:

  - You are about to drop the column `refundedAmount` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "refundedAmount",
ADD COLUMN     "refundAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "refundReason" TEXT;
