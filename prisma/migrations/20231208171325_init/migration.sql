/*
  Warnings:

  - You are about to drop the column `completedDates` on the `Habit` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "completedDates";

-- AlterTable
ALTER TABLE "completed_dates" ALTER COLUMN "date" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "status" SET DEFAULT 'Completed';
