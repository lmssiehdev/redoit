import { db } from "@/lib/db";
import { generateId, getErrorMessage } from "@/utils/misc";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const spaceId = generateId();

    if (!userId || !spaceId)
      return NextResponse.json(
        {
          error: "insufficient_args",
        },
        {
          status: 403,
        }
      );

    const user = await db.user.create({
      data: {
        name: userId,
        userId: userId,
        spaces: {
          createMany: {
            data: [{ spaceId }],
          },
        },
      },
    });

    if (!user) throw new Error("couldn't find the user");

    return NextResponse.json({ user, spaceId, userId });
  } catch (err) {
    const error = getErrorMessage(err);

    return NextResponse.json({ error }, { status: 401 });
  }
}
