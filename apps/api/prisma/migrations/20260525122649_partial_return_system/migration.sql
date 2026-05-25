-- AlterTable
ALTER TABLE "DocumentItem" ADD COLUMN     "returnedQuantity" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "DocumentReturn" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "reason" TEXT,
    "refundAmount" DECIMAL(12,2) NOT NULL,
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentReturn_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentReturnItem" (
    "id" TEXT NOT NULL,
    "returnId" TEXT NOT NULL,
    "documentItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "refundAmount" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "DocumentReturnItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DocumentReturn" ADD CONSTRAINT "DocumentReturn_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReturn" ADD CONSTRAINT "DocumentReturn_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReturnItem" ADD CONSTRAINT "DocumentReturnItem_returnId_fkey" FOREIGN KEY ("returnId") REFERENCES "DocumentReturn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentReturnItem" ADD CONSTRAINT "DocumentReturnItem_documentItemId_fkey" FOREIGN KEY ("documentItemId") REFERENCES "DocumentItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
