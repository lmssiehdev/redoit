"use client";

import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Habit } from "@/utils/habits";
import { createContext, useContext, useMemo, useState } from "react";
import { ReadonlyJSONValue } from "replicache";
import { useSubscribe } from "replicache-react";

type ContextValue = {
  habits: [string, Habit.Definition][];
  habitsObject: Record<string, Habit.Definition>;
  isSearching: boolean;
};
const HabitsContext = createContext<ContextValue>({} as ContextValue);

export function useHabits() {
  const context = useContext(HabitsContext);
  if (!context)
    throw new Error("useUser must be used within an HabitsContext.");
  return context;
}

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const { rep } = useReplicacheFromContext();
  const [isSearching, setIsSearching] = useState(true);

  const habits = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: "habit/" })
        .entries()
        .toArray()) as unknown as [[string, ReadonlyJSONValue]][];
      setIsSearching(false);
      return list;
    },
    [],
  );

  const habitsObject = useMemo(
    () =>
      habits.reduce((prev, curr) => {
        // @ts-ignore
        const [key, value] = curr;

        // @ts-ignore
        prev[key] = { ...value, id: key };

        return prev;
      }, {}),
    [habits],
  );
  const value = useMemo(
    () =>
      ({
        habits: habits as unknown as ContextValue["habits"],
        habitsObject,
        isSearching,
      }) as ContextValue,
    [habits, habitsObject],
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
