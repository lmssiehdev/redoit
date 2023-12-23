import { getSubscription } from "@/app/billing/page";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = createServerComponentClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const sub = await getSubscription(session?.user.id!);
    return NextResponse.json({
      sub,
    });
  } catch (err) {
    // later
    return NextResponse.json({});
  }
}
