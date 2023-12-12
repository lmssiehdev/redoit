import { PrismaTx } from "./types";

export const getLastMutationId = async ({
  replicacheClientId,
  tx,
}: {
  replicacheClientId: string;
  tx: PrismaTx;
}) => {
  let lastMutationId;

  const prismaReplicacheFindUnique = await tx.replicacheClient.findUnique({
    where: { replicacheClientId },
    select: { lastMutationId: true },
  });

  if (prismaReplicacheFindUnique)
    lastMutationId = prismaReplicacheFindUnique.lastMutationId;
  else {
    await tx.replicacheClient.create({
      data: {
        // --- PUBLIC ID ---
        replicacheClientId,
        // --- FIELDS ---
        lastMutationId: 0,
      },
      select: { lastMutationId: true },
    });

    lastMutationId = 0;
  }

  return { data: lastMutationId };
};

export const updateLastMutationId = async ({
  replicacheClientId,
  nextMutationId,
  tx,
}: {
  replicacheClientId: string;
  nextMutationId: number;
  tx: PrismaTx;
}) => {
  await tx.replicacheClient.update({
    where: { replicacheClientId },
    data: { lastMutationId: nextMutationId },
  });
};
