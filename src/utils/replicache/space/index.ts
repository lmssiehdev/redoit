import { PrismaTx } from "@/utils/api/replicache/types";

export async function getSpaceVersion({
  tx,
  userId,
  spaceId,
}: {
  tx: PrismaTx;
  userId: string;
  spaceId: string;
}) {
  const space = await tx.replicacheSpace.findFirst({
    where: {
      AND: [{ userId, id: spaceId }],
    },
  });

  if (!space)
    console.log({
      userId,
      spaceId,
      error: "BIG",
    });
  if (!space) throw new Error("Space Doesn't Exist " + userId + spaceId);

  return {
    data: space.version,
  };
}

export async function updateSpaceVersion({
  tx,
  spaceId,
  nextVersion,
}: {
  tx: PrismaTx;
  spaceId: string;
  nextVersion: number;
}) {
  const space = await tx.replicacheSpace.update({
    where: {
      id: spaceId,
    },
    data: {
      version: nextVersion,
    },
    select: {
      version: true,
    },
  });

  return {
    data: space.version,
  };
}
