-- AlterTable
ALTER TABLE "ReplicacheClient" ADD COLUMN     "lastModifiedVersion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastMutationId" INTEGER NOT NULL DEFAULT 0;
