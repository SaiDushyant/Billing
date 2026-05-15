/*
  Warnings:

  - You are about to drop the column `sellingPrice` on the `ProductVariant` table. All the data in the column will be lost.
  - Added the required column `mrp` to the `ProductVariant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariant" DROP COLUMN "sellingPrice",
ADD COLUMN     "mrp" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "profitMargin" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "ProductVariant_productId_idx" ON "ProductVariant"("productId");
