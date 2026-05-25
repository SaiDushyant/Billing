-- AlterTable
ALTER TABLE "Document" ADD COLUMN     "rebillFromId" TEXT;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_rebillFromId_fkey" FOREIGN KEY ("rebillFromId") REFERENCES "Document"("id") ON DELETE SET NULL ON UPDATE CASCADE;
