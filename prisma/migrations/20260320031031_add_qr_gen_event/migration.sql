-- CreateTable
CREATE TABLE "QRGenEvent" (
    "id" TEXT NOT NULL,
    "type" "QRType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QRGenEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "QRGenEvent_createdAt_idx" ON "QRGenEvent"("createdAt");
