import { PrismaTx } from "@/utils/api/replicache/types";

export async function setLastMutationId({
  tx,
  clientId,
  clientGroupId,
  nextMutationId,
  version,
}: {
  tx: PrismaTx;
  clientGroupId: string;
  clientId: string;
  nextMutationId: number;
  version: number;
}) {
  await tx.replicacheClient.update({
    where: {
      id: clientId,
      AND: {
        replicacheClientGroupId: clientGroupId,
      },
    },
    data: {
      lastMutationId: nextMutationId,
      lastModifiedVersion: version,
    },
  });

  return;
}

export async function getLastMutationId({
  tx,
  clientId,
  clientGroupId,
  spaceId,
}: {
  tx: PrismaTx;
  clientId: string;
  clientGroupId: string;
  spaceId: string;
}) {
  // ! FIX ME
  const client = await tx.replicacheClient.findFirst({
    where: {
      AND: [{ replicacheClientGroupId: clientGroupId, id: clientId }],
    },
  });

  if (!client) {
    // 1. Check if the ClientGroup exist

    const clientGroup = await tx.replicacheClientGroup.findFirst({
      where: {
        id: clientGroupId,
      },
    });

    if (!clientGroup) {
      await tx.replicacheClientGroup.create({
        data: {
          id: clientGroupId,
          clients: {
            createMany: {
              data: [
                {
                  id: clientId,
                  // ReplicacheClientGroupId: clientGroupId,
                  lastMutationId: 0,
                  lastModifiedVersion: 0,
                },
              ],
            },
          },
        },
      });
    } else {
      await tx.replicacheClient.create({
        data: {
          // clientGroupId,
          id: clientId,
          lastMutationId: 0,
          lastModifiedVersion: 0,
          ReplicacheClientGroup: {
            connect: {
              id: clientGroupId,
            },
          },
        },
      });
    }

    return { data: 0 };
  } else {
    return {
      data: client.lastMutationId,
    };
  }
}

export async function getLastMutationIds({
  tx,
  clientGroundId,
  fromVersion,
}: {
  tx: PrismaTx;
  clientGroundId: string;
  fromVersion: number;
}) {
  const rows = await tx.replicacheClient.findMany({
    where: {
      // replicacheClientGroupId: clientGroundId,
      lastModifiedVersion: {
        gt: fromVersion,
      },
    },
    select: {
      id: true,
      lastMutationId: true,
    },
  });

  const formatedDate = Object.fromEntries(
    rows.map((r) => [r.id, r.lastMutationId]),
  );

  return {
    data: formatedDate,
  };
}
