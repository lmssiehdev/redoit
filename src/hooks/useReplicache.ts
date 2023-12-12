import { mutators } from "@/utils/replicache/mutators/client";
import { useEffect, useState } from "react";
import { Replicache } from "replicache";

export type ReplicacheClient = Replicache<typeof mutators>;

export const useReplicache = ({ userId }: { userId?: string }) => {
  const [rep, setRep] = useState<ReplicacheClient | null>(null);

  useEffect(() => {
    if (userId) {
      const r = new Replicache({
        // logLevel: "debug",
        name: `${userId}`,
        licenseKey:
          "l00000000000000000000000000000001" ??
          process.env.NEXT_PUBLIC_REPLICACHE!,
        pushURL: `/api/replicache-push`,
        pullURL: `/api/replicache-pull`,
        mutators,
      });
      const log = async () => {
        console.log(await r.query((tx) => tx.scan().toArray()));
      };
      log();
      setRep(r);

      return () => void r.close();
    }
  }, [userId]);

  return { data: rep };
};

export type ReplicacheInstanceType = ReturnType<typeof useReplicache>;
