/*
  Warnings:

  - The values [Completed,Skipped] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `completed_dates` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('completed', 'skipped');
ALTER TABLE "completed_dates" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "completed_dates" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
ALTER TABLE "completed_dates" ALTER COLUMN "status" SET DEFAULT 'completed';
COMMIT;

-- AlterTable
ALTER TABLE "completed_dates" DROP CONSTRAINT "completed_dates_pkey",
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "version" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "date" DROP DEFAULT,
ALTER COLUMN "date" SET DATA TYPE TEXT,
ALTER COLUMN "status" SET DEFAULT 'completed',
ADD CONSTRAINT "completed_dates_pkey" PRIMARY KEY ("habitId", "date");
