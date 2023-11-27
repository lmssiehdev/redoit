import { cookies } from "next/headers";
import { getSpaceVersion } from "@/app/api/replicache-push/route";
import { db } from "@/lib/db";
import { PrismaTx } from "@/utils/api/replicache/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const userId = "preacher";
  const spaceId = "space";
  const { clientGroundID: clientGroundId } = body;
  const fromVersion = body.cookie ?? 0;

  try {
    const data = await db.$transaction(
      async (tx) => {
        const { data: currentVersion } = await getSpaceVersion({
          spaceId,
          tx,
          userId,
        });

        if (fromVersion > currentVersion) {
          throw new Error(
            `fromVersion ${fromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`
          );
        }

        // Get lmids for requesting client groups.
        console.log("getting changed messages before", fromVersion);
        const { data: lastMutationIds } = await getLastMutationIds({
          tx,
          clientGroundId,
          fromVersion,
        });

        const messages = await tx.message.findMany({
          where: {
            lastModifiedVersion: {
              gt: fromVersion,
            },
          },
        });
        console.log({ fromVersion, messages });
        const patch = [];
        for (let message of messages) {
          const {
            id,
            from,
            content,
            ord,
            lastModifiedVersion: rowVersion,
            deleted,
          } = message;
          if (deleted) {
            if (rowVersion > fromVersion) {
              patch.push({
                op: "del",
                key: `message/${id}`,
              });
            }
          } else {
            patch.push({
              op: "put",
              key: `message/${id}`,
              value: {
                from,
                content,
                order: ord,
              },
            });
          }
        }
        return {
          lastMutationIDChanges: lastMutationIds ?? {},
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
  } catch (error) {
    return NextResponse.json({
      error,
    });
  }
}

async function getLastMutationIds({
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
      replicacheClientGroupId: clientGroundId,
      lastModifiedVersion: {
        lt: fromVersion,
      },
    },
    select: {
      id: true,
      lastMutationId: true,
    },
  });

  const formatedDate = Object.fromEntries(
    rows.map((r) => [r.id, r.lastMutationId])
  );

  return {
    data: formatedDate,
  };
}
