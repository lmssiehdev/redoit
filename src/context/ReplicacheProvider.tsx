"use client";

import { useUser } from "@/context/AuthProvider";
import { useReplicache, type ReplicacheClient } from "@/hooks/useReplicache";
import { createContext, useContext, useMemo } from "react";

type ContextValue = {
  rep: ReplicacheClient;
};
const ReplicacheContext = createContext<ContextValue>({} as ContextValue);

export function useReplicacheFromContext() {
  const context = useContext(ReplicacheContext);
  if (!context)
    throw new Error("useUser must be used within an ReplicacheContext.");
  return context;
}

export function ReplicacheProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useUser();

  const { data: rep } = useReplicache({
    userId: session?.user?.id,
  });

  const value = useMemo(
    () =>
      ({
        rep,
      } as ContextValue),
    [rep]
  );

  return (
    <>
      <ReplicacheContext.Provider value={value}>
        {children}
      </ReplicacheContext.Provider>
    </>
  );
}
