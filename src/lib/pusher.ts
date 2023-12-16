"use client";

import { ReplicacheClient } from "@/hooks/useReplicache";
import { default as PusherClient } from "pusher-js";
import Pusher from "pusher";

export function pusherListen({ rep }: { rep: ReplicacheClient }) {
  PusherClient.logToConsole = process.env.NODE_ENV === "development";
  const pusher = new PusherClient(
    process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!,
    {
      cluster: "us2",
    }
  );

  const channel = pusher.subscribe("default");
  channel.bind("poke", () => {
    console.log("got poked");
    rep.pull();
  });

  return () => channel.unbind("poke");
}

export async function sendPusherPoke() {
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
