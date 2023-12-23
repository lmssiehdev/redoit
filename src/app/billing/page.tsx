import Plans from "@/app/billing/plans";
import { db } from "@/lib/db";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";

export async function getPlans() {
  return await db.plan.findMany({
    where: {
      NOT: {
        status: "draft",
      },
    },
  });
}

export async function getSubscription(userId: string) {
  // Gets the most recent subscription
  console.log(userId);
  return await db.subscription.findFirst({
    where: {
      userId: userId,
    },
    include: {
      plan: true,
    },
    orderBy: {
      lemonSqueezyId: "desc",
    },
  });
}

export default async function Page() {
  const supabase = createServerComponentClient({
    cookies: () => cookies(),
  });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/auth");
  }

  // const d = await getSubscription(session?.user.id!);

  // return (
  //   <>
  //     <pre>{JSON.stringify(d, null, 2)}</pre>
  //   </>
  // );
  // console.log(session);
  const plans = await getPlans();

  const subscription = null; // TODO

  return (
    <div className="container mx-auto max-w-lg">
      <h1 className="text-xl font-bold mb-3">Billing</h1>

      <Plans plans={plans} subscription={subscription} />

      <Script src="https://app.lemonsqueezy.com/js/lemon.js" />
    </div>
  );
}
