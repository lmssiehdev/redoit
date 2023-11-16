import { getLastMutationId } from "@/utils/api/replicache/client";
import { getVersion } from "@/app/api/replicache-push/route";
import { db } from "@/lib/db";
import { PrismaTx } from "@/utils/api/replicache/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/utils/misc";

const serverID = 1;
export async function POST(req: NextRequest, res: NextResponse) {
  const pull = await req.json();
  console.log(`Processing pull`, JSON.stringify(pull));
  const { clientGroupID } = pull;
  const fromVersion = pull.cookie ?? 0;
  const t0 = Date.now();

  try {
    const data = await db.$transaction(
      async (tx) => {
        // Get current version.
        const { data: currentVersion } = await getVersion({ tx, serverID });

        if (fromVersion > currentVersion) {
          throw new Error(
            `fromVersion ${fromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
          );
        }

        // Get lmids for requesting client groups.
        const lastMutationIDChanges = await getLastMutationIDChanges(
          tx,
          clientGroupID,
          fromVersion
        );

        // Get changed domain objects since requested version.
        const changes = await tx.message.findMany({
          where: {
            version: {
              gt: fromVersion,
            },
          },
        });

        // Build and return response.
        const patch = [];

        for (let row of changes) {
          let { context, deleted, id, ord, sender, version: rowVersion } = row;

          if (deleted) {
            if (rowVersion > fromVersion) {
              patch.push({
                op: "del",
                key: "message",
              });
            }
          } else {
            patch.push({
              op: "put",
              key: `message/${id}`,
              value: {
                from: sender,
                order: ord,
                content: context,
              },
            });
          }
        }
        return {
          lastMutationIDChanges,
          cookie: currentVersion,
          patch,
        };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );

    return NextResponse.json(data);
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error("Error Message", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

async function getLastMutationIDChanges(
  tx: PrismaTx,
  clientGroupID: string,
  fromVersion: number
) {
  const rows = await tx.replicacheClient.findMany({
    select: {
      id: true,
      lastMutationId: true,
    },
    where: {
      clientGroupId: clientGroupID,
      version: {
        gt: fromVersion,
      },
    },
  });

  return Object.fromEntries(rows.map((r) => [r.id, r.lastMutationId]));
}
