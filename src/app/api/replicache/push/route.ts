import { db } from "@/lib/db";
import {
  getLastMutationId,
  updateLastMutationId,
} from "@/utils/api/replicache/client";
import { mutationsApi } from "@/utils/api/replicache/mutations";
// import { sendPoke } from "@/utils/api/replicache/poke/send";
import { getVersion, updateVersion } from "@/utils/api/replicache/space";
import { getErrorMessage } from "@/utils/misc";
import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
// import utilApiPokeSend from 'utils/api/replicache/poke/send'
// import utilAuth from 'utils/api/auth'

export async function POST(req: NextRequest, res: NextResponse) {
  console.log("\nPush: ***", req.body, "***\n");

  const userId = cookies().get("userId")?.value;
  if (!userId)
    return NextResponse.json({ error: "user_not_found" }, { status: 401 });

  // Provided by Replicache
  const { clientGroupID: clientID, mutations } = await req.json();

  const { searchParams } = new URL(req.url);
  // Provided by client
  const spaceId = searchParams.get("spaceId");

  if (!clientID || !spaceId || !mutations)
    return NextResponse.json({ error: "insufficient_args" }, { status: 403 });

  console.log(clientID, spaceId, mutations);
  try {
    const { data: versionLatest } = await db.$transaction(
      async (tx) => {
        // #1. Get next `version` for space
        const { data: version } = await getVersion({
          tx,
          spaceId,
          userId,
        });

        const versionNext = version + 1;

        // #2. Save new version to Space
        const { data: versionUpdated } = await updateVersion({
          tx,
          spaceId,
          versionAt: versionNext,
        });

        // #3. Get last mutation Id for client
        let { data: lastMutationId } = await getLastMutationId({
          replicacheClientId: clientID,
          tx,
        });

        // #4. Iterate mutations, increase mutation Id on each iteration, but use next version for comparison
        const { data: nextMutationId } = await mutationsApi({
          lastMutationId,
          mutations,
          spaceId,
          tx,
          versionNext,
        });

        // #5. Save mutation Id to Client
        await updateLastMutationId({
          replicacheClientId: clientID,
          nextMutationId,
          tx,
        });

        return { data: versionUpdated?.versionAt };
      },
      {
        isolationLevel: Prisma.TransactionIsolationLevel.Serializable, // Required for Replicache to work
        maxWait: 5000, // default: 2000
        timeout: 10000, // default: 5000
      }
    );

    // #6. Poke client(s) to send a pull.
    // await sendPoke();

    return NextResponse.json({ done: versionLatest });
  } catch (err) {
    const errorMessage = getErrorMessage(err);
    console.error("errorMessage", errorMessage);

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}
