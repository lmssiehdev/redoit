import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  const server = await db.replicacheServer.create({
    data: {
      version: 1,
      id: 1,
    },
  });

  return NextResponse.json({
    server,
  });
}
