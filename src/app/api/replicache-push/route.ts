import { mutationsApi } from "@/utils/api/replicache/mutations";
import { db } from "@/lib/db";
import { getErrorMessage } from "@/utils/misc";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { MessageWithID } from "@/types";
import { PrismaTx } from "@/utils/api/replicache/types";

export async function getVersion({
  tx,
  serverID,
}: {
  tx: PrismaTx;
  serverID: number;
}) {
  const data = await tx.replicacheServer.findFirstOrThrow({
    where: {
      id: serverID,
    },
  });

  if (!data) throw new Error("replicache_server_not_found");

  return {
    data: data.version,
  };
}

const serverID = 1;

export async function POST(req: NextRequest, res: NextResponse) {
  const push = req.body;
  console.log("Processing push", JSON.stringify(push));

  const t = await req.json();
  const { clientGroupID, clientID, mutations } = t;
  const t0 = Date.now();
  try {
    const { data: versionLatest } = await db.$transaction(
      async (tx) => {
        // Get the previous version and calculate the next one.

        const { data: prevVersion } = await getVersion({
          tx,
          serverID,
        });

        const nextVersion = prevVersion + 1;

        const lastMutationID = await getLastMutationID(tx, clientID);

        // #4. Iterate mutations, increase mutation Id on each iteration, but use next version for comparison
        await iterate({
          tx,
          lastMutationID,
          mutations,
          nextVersion,
          clientGroupID,
          clientID,
        });

        return {
          data: null,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );

    return NextResponse.json({ done: versionLatest });
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error("errorMessage", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  } finally {
  }
}

async function getLastMutationID(tx: PrismaTx, clientID: string) {
  const clientRow = await tx.replicacheClient.findFirst({
    where: {
      id: clientID,
    },
  });
  if (!clientRow) {
    return 0;
  }
  return clientRow.lastMutationId;
}

async function setLastMutationID({
  tx,
  clientID,
  clientGroupID,
  mutationID,
  version,
}: {
  tx: PrismaTx;
  clientID: string;
  clientGroupID: string;
  mutationID: number;
  version: number;
}) {
  const client = await tx.replicacheClient.findFirst({
    where: {
      id: clientID,
    },
  });

  if (!client) {
    await tx.replicacheClient.create({
      data: {
        id: clientID,
        clientGroupId: clientGroupID,
        lastMutationId: mutationID,
        version,
      },
    });
  } else {
    await tx.replicacheClient.update({
      data: {
        clientGroupId: clientGroupID,
        // @ts-ignore
        lastMutationId: mutationID,
        version,
      },
      where: {
        id: clientID,
      },
    });
  }
}

async function iterate({
  tx,
  lastMutationID,
  mutations,
  nextVersion,
  clientID,
  clientGroupID,
}: {
  tx: PrismaTx;
  lastMutationID: number;
  mutations: any;
  nextVersion: number;
  clientGroupID: string;
  clientID: string;
}) {
  console.log(mutations);
  for await (let mutation of mutations) {
    const { clientID } = mutation;
    const nextMutationID = await getLastMutationID(tx, clientID);
    // It's common due to connectivity issues for clients to send a
    // mutation which has already been processed. Skip these.
    if (mutation.id < nextMutationID + 1) {
      console.log(
        `Mutation ${mutation.id} has already been processed - skipping`,
        nextMutationID + 1
      );
      continue;
    }

    // If the Replicache client is working correctly, this can never
    // happen. If it does there is nothing to do but return an error to
    // client and report a bug to Replicache.
    if (mutation.id > nextMutationID + 1) {
      console.warn(`Mutation ${mutation.id} is from the future - aborting`);
      break;
    }

    try {
      switch (mutation.name) {
        case "createMessage": {
          await createMessage(tx, mutation.args, nextVersion);
          break;
        }
        case "deleteMessage": {
          await deleteMessage(tx, mutation.args);
        }
      }

      // Update lastMutationID for requesting client.
      await setLastMutationID({
        tx,
        clientID,
        clientGroupID,
        mutationID: nextMutationID + 1,
        version: nextVersion,
      });

      // Update global version.
      await tx.replicacheServer.update({
        data: {
          version: nextVersion,
        },
        where: {
          id: serverID,
        },
      });
    } catch (err) {
      console.error("Caught error from mutation", mutation, err);
    }
  }
}

async function createMessage(
  tx: PrismaTx,
  { id, from, content, order }: MessageWithID,
  version: number
) {
  await tx.message.create({
    data: {
      id: `message/${id}`,
      sender: from,
      context: content,
      ord: order,
      deleted: false,
      version,
    },
  });
}

async function deleteMessage(tx: PrismaTx, id: string) {
  console.log("id", id);
  await tx.message.delete({
    where: {
      id,
    },
  });
}
