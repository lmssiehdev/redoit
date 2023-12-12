/*
  Warnings:

  - You are about to drop the column `userId` on the `replicache_space` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `replicache_space` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "replicache_space" DROP CONSTRAINT "replicache_space_userId_fkey";

-- AlterTable
ALTER TABLE "replicache_space" DROP COLUMN "userId",
ADD COLUMN     "user_id" UUID NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DEFAULT 'example@gmail.com';

-- CreateIndex
CREATE INDEX "replicache_space_user_id_idx" ON "replicache_space"("user_id");

-- AddForeignKey
ALTER TABLE "replicache_space" ADD CONSTRAINT "replicache_space_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
