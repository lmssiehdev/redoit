import { db } from "@/lib/db";
import { generateId, getErrorMessage } from "@/utils/misc";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const userId = "preacher" + generateId(2);

    if (!userId)
      return NextResponse.json(
        { error: "please provide a valid userId" },
        {
          status: 400,
        }
      );

    const spaceId = generateId();

    const user = await db.user.create({
      data: {
        // --- PUBLIC ID ---
        userId,
        // --- RELATIONS ---
        spaces: {
          createMany: {
            data: [{ spaceId }],
          },
        },
      },
      select: {
        userId: true,
        spaces: true,
      },
    });

    // In this demo, we’re just using basic cookies and not implementing a secure authentication system since auth isn’t the purpose of this demo. In a production app you’d implement a secure authentication system.

    // code below not working for some reason :/
    // setCookie("userId", user?.userId, { req, res });

    cookies().set("userId", userId);
    cookies().set("spaceId", spaceId);

    // redirect("/");

    return NextResponse.json({
      data: true,
      user: user,
      useId: userId,
      spaceId,
    });
  } catch (err) {
    console.error(getErrorMessage(err));

    return NextResponse.json({
      failed: true,
    });
  }
}
