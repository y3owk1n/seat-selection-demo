-- DropIndex
DROP INDEX "Seat_label_column_row_indexFromLeft_status_price_transform__idx";

-- AlterTable
ALTER TABLE "Seat" ADD COLUMN     "lockedByUserId" TEXT,
ADD COLUMN     "lockedTill" TIMESTAMP(3),
ADD COLUMN     "orderId" TEXT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "checkoutSessionId" TEXT,
    "userId" TEXT NOT NULL,
    "receiptUrl" TEXT,
    "paidAmount" DOUBLE PRECISION,
    "paymentMethod" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Seat_label_column_row_indexFromLeft_status_price_transform__idx" ON "Seat"("label", "column", "row", "indexFromLeft", "status", "price", "transform", "d", "lockedTill", "lockedByUserId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_lockedByUserId_fkey" FOREIGN KEY ("lockedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
