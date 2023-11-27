import { db } from "@/lib/db";
import { PrismaTx } from "@/utils/api/replicache/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const userId = "preacher";
  const spaceId = "space";
  const { clientGroupID: clientGroupId, mutations } = body;

  try {
    const transaction = db.$transaction(
      async (tx) => {
        for await (let mutation of mutations) {
          const { clientID: clientId } = mutation;

          /* 
            * Step 1:
            Get the previous version and calculate the next one.
          */
          const { data: version } = await getSpaceVersion({
            tx,
            userId,
            spaceId,
          });

          const nextVersion = version + 1;

          const { data: lastMutationId } = await getLastMutationId({
            tx,
            clientId,
            clientGroupId,
            spaceId,
          });
          const nextMutationId = lastMutationId + 1;

          /* 
            * Note:
            It's common due to connectivity issues for clients to send a
            mutation which has already been processed. Skip these.
           */
          if (mutation.id < nextMutationId) {
            console.log(
              `Mutation ${mutation.id} has already been processed - skipping`
            );
            // ! TEMP
            continue;
          }

          /*
            * Note
            If the Replicache client is working correctly, this can never
            happen. If it does there is nothing to do but return an error to
            client and report a bug to Replicache.
          */
          if (mutation.id > nextMutationId) {
            throw new Error(
              `Mutation ${mutation.id} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
            );
          }

          // For each possible mutation, run the server-side logic to apply the
          // mutation.
          switch (mutation.name) {
            case "createMessage":
              await createMessage({
                spaceId,
                tx,
                args: mutation.args,
                nextVersion,
              });
              break;
            default:
              throw new Error(`Unknown mutation: ${mutation.name}`);
          }

          setLastMutationId({
            clientGroupId,
            clientId,
            nextMutationId,
            tx,
            version: nextVersion,
          });

          await tx.replicacheSpace.update({
            where: {
              spaceId,
            },
            data: {
              version: nextVersion,
            },
          });
        }
        return {
          data: true,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );
    return NextResponse.json({
      mutations,
    });
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

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
      AND: [{ userId, spaceId }],
    },
  });

  if (!space) throw new Error("Space Doesn't Exist");

  return {
    data: space.version,
  };
}

async function getLastMutationId({
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
      AND: [{ clientGroupId, clientId }],
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
          spaceId,
          clients: {
            createMany: {
              data: [
                {
                  clientId,
                  clientGroupId,
                  id: clientId,
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
          clientId,
          clientGroupId,
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

async function createMessage({
  tx,
  args,
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: { id: string; from: string; content: string; order: number };
  nextVersion: number;
  spaceId: string;
}) {
  const { content, from, id, order } = args;
  await tx.message.create({
    data: {
      lastModifiedVersion: nextVersion,
      content,
      from,
      id,
      ord: order,
      space: {
        connect: {
          spaceId,
        },
      },
      deleted: false,
    },
  });
  return;
}

async function setLastMutationId({
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
      clientId,
      AND: {
        clientGroupId,
      },
    },
    data: {
      lastMutationId: nextMutationId,
      lastModifiedVersion: version,
    },
  });

  return;
}
