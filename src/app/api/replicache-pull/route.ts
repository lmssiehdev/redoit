import { db } from "@/lib/db";
import { getLastMutationIds } from "@/utils/replicache/client";
import { getSpaceVersion } from "@/utils/replicache/space";
import { Prisma } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PatchOperation, PullResponse } from "replicache";

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();
  const { clientGroundID: clientGroundId } = body;
  const fromVersion = body.cookie ?? 0;

  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return NextResponse.json(
      {
        session,
        error: "insufficient_args",
      },
      {
        status: 403,
      },
    );

  const userId = session.user.id;
  const spaceId = userId;

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
            `fromVersion ${fromVersion} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`,
          );
        }

        // Get lmids for requesting client groups.
        console.log("getting changed messages before", fromVersion);
        const { data: lastMutationIds } = await getLastMutationIds({
          tx,
          clientGroundId,
          fromVersion,
        });

        const messages = await tx.habit.findMany({
          where: {
            AND: [{ spaceId }, { version: { gt: fromVersion } }],
          },
        });

        const dates = await tx.completedDate.findMany({
          where: {
            AND: [{ version: { gt: fromVersion } }],
          },
        });

        const patch: PatchOperation[] = [];
        for (let message of messages) {
          const {
            id,
            version: rowVersion,
            archived,
            color,
            completed,
            frequency,
            name,
            deleted,
          } = message;
          if (deleted) {
            if (rowVersion > fromVersion) {
              patch.push({
                op: "del",
                key: `habit/${id}`,
              });
            }
          } else {
            patch.push({
              op: "put",
              key: `habit/${id}`,
              value: {
                archived,
                color,
                completed,
                frequency,
                name,
              },
            });
          }
        }
        for (let date of dates) {
          const {
            id,
            deleted,
            version: rowVersion,
            status,
            date: completedDate,
          } = date;
          if (deleted) {
            if (rowVersion > fromVersion) {
              patch.push({
                op: "del",
                key: id,
              });
            }
          } else {
            patch.push({
              op: "put",
              key: id,
              value: status,
            });
          }
        }
        const body: PullResponse = {
          lastMutationIDChanges: lastMutationIds ?? {},
          cookie: currentVersion,
          patch,
        };
        return body;
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      },
    );

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error,
    });
  }
}
