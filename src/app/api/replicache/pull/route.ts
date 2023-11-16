import { db } from "@/lib/db";
import { getLastMutationId } from "@/utils/api/replicache/client";
import { getTodos } from "@/utils/api/replicache/entries";
import { getVersion } from "@/utils/api/replicache/space";
import { getErrorMessage } from "@/utils/misc";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("\nPull: ***", req.body, "***\n");

  const userId = cookies().get("userId")?.value;
  if (!userId)
    return NextResponse.json({ error: "user_not_found" }, { status: 401 });

  // Provided by ReplicacheInstanceType
  const requestJSON = await req.json();
  const { clientGroupID: clientID, cookie } = requestJSON;

  const { searchParams } = new URL(req.url);
  // Provided by client
  const spaceId = searchParams.get("spaceId");

  // if (!clientID || !spaceId || cookie === undefined)
  //   return NextResponse.json({ error: "insufficient_args" }, { status: 403 });

  try {
    const { lastMutationId, versionAt, patch } = await db.$transaction(
      async (tx) => {
        let lastMutationId,
          patch = [];

        // #1. Get `version` for space
        const { data: version } = await getVersion({
          tx,
          spaceId,
          userId,
        });
        console.log(version);
        // #2. Get last mutation Id for the current replicache client
        let { data: mutationId } = await getLastMutationId({
          replicacheClientId: clientID,
          tx,
        });

        lastMutationId = mutationId;

        // #3. Get all transactions done after the last client request for the current space
        const { data: apiEntriesTodoGet } = await getTodos({
          spaceId,
          tx,
          userId,
          versionAt: cookie,
        });

        // #4. Put together a patch with instructions for the client
        // if (cookie === null) patch.push({ op: "clear" });

        if (apiEntriesTodoGet?.length)
          patch.push(
            ...apiEntriesTodoGet.map((todo) => ({
              op: !todo.isDeleted ? "put" : "del",
              key: `${spaceId}/habit/${todo.todoId}`,
              value: { ...todo },
            }))
          );

        return { lastMutationId, versionAt: version, patch };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );

    // #5. Return object to client
    return NextResponse.json({
      lastMutationID: lastMutationId,
      cookie: versionAt,
      patch,
    });
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error("Error Message", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
