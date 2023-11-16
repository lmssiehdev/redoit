import { db } from "@/lib/db";
import { getErrorMessage } from "@/utils/misc";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId)
      return NextResponse.json({ error: "insufficient_args" }, { status: 403 });

    const user = await db.user.findFirst({
      where: {
        userId,
      },
      select: {
        spaces: true,
        userId: true,
      },
    });

    if (!user?.userId)
      return NextResponse.json(
        { error: "user doesn't exist" },
        { status: 401 }
      );

    cookies().set("userId", user.userId);
    cookies().set("spaceId", user.spaces[0].spaceId);

    return NextResponse.json({ user, done: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 401 }
    );
  }
}
