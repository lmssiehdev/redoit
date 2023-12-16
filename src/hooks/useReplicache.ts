import { pusherListen } from "@/lib/pusher";
import { mutators } from "@/utils/replicache/mutators/client";
import { useEffect, useState } from "react";
import { Replicache } from "replicache";

export type ReplicacheClient = Replicache<typeof mutators>;

export const useReplicache = ({ userId }: { userId?: string }) => {
  const [rep, setRep] = useState<ReplicacheClient | null>(null);

  useEffect(() => {
    if (userId) {
      const r = new Replicache<typeof mutators>({
        name: userId,
        licenseKey: process.env.NEXT_PUBLIC_REPLICACHE!,
        pushURL: `/api/replicache-push`,
        pullURL: `/api/replicache-pull`,
        mutators,
      });

      const disconnect = pusherListen({ rep: r });

      setRep(r);

      return () => {
        r.close();
        disconnect();
      };
    }
  }, [userId]);

  return { data: rep };
};
