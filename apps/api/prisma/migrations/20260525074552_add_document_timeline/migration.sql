-- CreateEnum
CREATE TYPE "DocumentEventType" AS ENUM ('CREATED', 'UPDATED', 'CANCELLED', 'RETURNED', 'PARTIAL_RETURN', 'PAYMENT_ADDED', 'PAYMENT_REFUNDED', 'CONVERTED', 'APPROVED', 'REJECTED', 'REBILLED');

-- CreateTable
CREATE TABLE "DocumentTimeline" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "userId" TEXT,
    "type" "DocumentEventType" NOT NULL,
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DocumentTimeline_documentId_idx" ON "DocumentTimeline"("documentId");

-- CreateIndex
CREATE INDEX "DocumentTimeline_createdAt_idx" ON "DocumentTimeline"("createdAt");

-- AddForeignKey
ALTER TABLE "DocumentTimeline" ADD CONSTRAINT "DocumentTimeline_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTimeline" ADD CONSTRAINT "DocumentTimeline_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
