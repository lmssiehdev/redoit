/*
  Warnings:

  - You are about to drop the column `role` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `notes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `email` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "notes" DROP CONSTRAINT "notes_userId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "email" TEXT NOT NULL;

-- DropTable
DROP TABLE "notes";

-- DropEnum
DROP TYPE "Role";

-- CreateTable
CREATE TABLE "replicache_space" (
    "id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 0,
    "userId" UUID NOT NULL,

    CONSTRAINT "replicache_space_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplicacheClientGroup" (
    "id" TEXT NOT NULL,

    CONSTRAINT "ReplicacheClientGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplicacheClient" (
    "id" TEXT NOT NULL,
    "replicacheClientGroupId" TEXT NOT NULL,

    CONSTRAINT "ReplicacheClient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Habit" (
    "id" TEXT NOT NULL,
    "spaceId" TEXT NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 0,
    "title" TEXT NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Habit_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "replicache_space" ADD CONSTRAINT "replicache_space_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplicacheClient" ADD CONSTRAINT "ReplicacheClient_replicacheClientGroupId_fkey" FOREIGN KEY ("replicacheClientGroupId") REFERENCES "ReplicacheClientGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Habit" ADD CONSTRAINT "Habit_spaceId_fkey" FOREIGN KEY ("spaceId") REFERENCES "replicache_space"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
