-- CreateEnum
CREATE TYPE "ReturnReason" AS ENUM ('DAMAGED', 'CUSTOMER_RETURN', 'BILLING_ERROR', 'EXPIRED', 'OTHER');

-- CreateTable
CREATE TABLE "DocumentItemReturn" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "documentItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refundAmount" DECIMAL(12,2) NOT NULL,
    "reason" "ReturnReason" NOT NULL,
    "notes" TEXT,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentItemReturn_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentItemReturn_documentId_idx" ON "DocumentItemReturn"("documentId");

-- CreateIndex
CREATE INDEX "DocumentItemReturn_documentItemId_idx" ON "DocumentItemReturn"("documentItemId");

-- AddForeignKey
ALTER TABLE "DocumentItemReturn" ADD CONSTRAINT "DocumentItemReturn_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentItemReturn" ADD CONSTRAINT "DocumentItemReturn_documentItemId_fkey" FOREIGN KEY ("documentItemId") REFERENCES "DocumentItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentItemReturn" ADD CONSTRAINT "DocumentItemReturn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
