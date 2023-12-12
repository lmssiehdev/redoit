-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Completed', 'Skipped');

-- CreateTable
CREATE TABLE "completed_dates" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "habitId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "completed_dates_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "completed_dates" ADD CONSTRAINT "completed_dates_habitId_fkey" FOREIGN KEY ("habitId") REFERENCES "Habit"("id") ON DELETE CASCADE ON UPDATE CASCADE;
