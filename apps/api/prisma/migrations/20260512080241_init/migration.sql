-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "currentStock" INTEGER NOT NULL DEFAULT 0;

-- AddForeignKey
ALTER TABLE "PurchaseItem" ADD CONSTRAINT "PurchaseItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
