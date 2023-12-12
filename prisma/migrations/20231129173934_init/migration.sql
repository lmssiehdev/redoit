/*
  Warnings:

  - You are about to drop the column `title` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `color` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `completedDates` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Habit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "title",
ADD COLUMN     "color" TEXT NOT NULL,
ADD COLUMN     "completedDates" JSONB NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "frequency" BOOLEAN[],
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
