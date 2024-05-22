/*
  Warnings:

  - Added the required column `processingFeeAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Made the column `paidAmount` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "processingFeeAmount" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "paidAmount" SET NOT NULL;
