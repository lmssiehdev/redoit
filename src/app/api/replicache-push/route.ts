import { db } from "@/lib/db";
import { sendPusherPoke } from "@/lib/pusher";
import { PrismaTx } from "@/utils/api/replicache/types";
import { Habit } from "@/utils/habits";
import {
  getLastMutationId,
  setLastMutationId,
} from "@/utils/replicache/client";
import {
  createHabit,
  deleteDate,
  markHabit,
  updateHabit,
} from "@/utils/replicache/mutators/server";
import { getSpaceVersion, updateSpaceVersion } from "@/utils/replicache/space";
import { Prisma } from "@prisma/client";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Pusher from "pusher";
import { z } from "zod";

const mutationSchema = z.object({
  clientID: z.string(),
  id: z.number(),
  name: z.string(),
  args: z.any(),
  timestamp: z.number(),
});

const bodySchema = z.object({
  profileID: z.string(),
  clientGroupID: z.string(),
  pushVersion: z.number(),
  schemaVersion: z.string(),
  mutations: z.array(mutationSchema),
});

export async function POST(req: NextRequest, res: NextResponse) {
  const body = await req.json();

  const { clientGroupID: clientGroupId, mutations } = bodySchema.parse(body);

  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.json(
      {
        session,
        error: "insufficient_args",
      },
      {
        status: 403,
      },
    );
  }

  const userId = session.user.id;
  const spaceId = userId;
  try {
    db.$transaction(
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
              `Mutation ${mutation.id} has already been processed - skipping`,
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
              `Mutation ${mutation.id} is from the future - aborting. This can happen in development if the server restarts. In that case, clear appliation data in browser and refresh.`,
            );
          }

          // For each possible mutation, run the server-side logic to apply the
          // mutation.
          switch (mutation.name) {
            case "createHabit":
              await createHabit({
                spaceId,
                tx,
                args: mutation.args,
                nextVersion,
              });
              break;
            case "deleteHabit": {
              await deleteHabit({
                tx,
                args: mutation.args,
                spaceId,
                nextVersion,
              });
              break;
            }
            case "updateHabit": {
              await updateHabit({
                tx,
                args: mutation.args,
                spaceId,
                nextVersion,
              });
              break;
            }
            case "markHabit": {
              await markHabit({
                tx,
                args: mutation.args,
                spaceId,
                nextVersion,
              });
              break;
            }
            case "deleteDate": {
              await deleteDate({
                tx,
                args: mutation.args,
                spaceId,
                nextVersion,
              });
              break;
            }
            default:
              throw new Error(`Unknown mutation: ${mutation.name}`);
          }

          await setLastMutationId({
            clientGroupId,
            clientId,
            nextMutationId,
            tx,
            version: nextVersion,
          });

          await updateSpaceVersion({
            nextVersion,
            spaceId,
            tx,
          });
        }
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        // maxWait: 5000, // default: 2000
        // timeout: 10000, // default: 5000
      },
    );
    await Poke();

    return NextResponse.json({
      done: true,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
    });
  }
}

async function deleteHabit({
  tx,
  args,
  nextVersion,
  spaceId,
}: {
  tx: PrismaTx;
  args: string;
  nextVersion: number;
  spaceId: string;
}) {
  await tx.habit.update({
    where: {
      // ! Temp
      id: args.replace("habit/", ""),
      AND: [{ spaceId }],
    },
    data: {
      version: nextVersion,
      deleted: true,
    },
  });
  return;
}

async function Poke() {
  const pusher = new Pusher({
    appId: "1640260",
    key: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!,
    secret: process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_SECRET!,
    cluster: "us2",
    useTLS: true,
  });
  const t0 = Date.now();
  await pusher.trigger("default", "poke", {});
  console.log("Sent poke in", Date.now() - t0);
}
