"use client";

import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Habit } from "@/utils/habits";
import { createContext, useContext, useMemo } from "react";
import { ReadonlyJSONValue } from "replicache";
import { useSubscribe } from "replicache-react";
import { unknown } from "zod";

type ContextValue = {
  habits: Record<string, Habit.Definition>;
  habitsObject: Record<string, Habit.Definition>;
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

  const habits = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: "habit/" })
        .entries()
        .toArray()) as unknown as [[string, ReadonlyJSONValue]][];
      // list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    []
  );

  const habitsObject = useMemo(
    () =>
      habits.reduce((prev, curr) => {
        // @ts-ignore
        const [key, value] = curr;

        // @ts-ignore
        prev[key] = value;

        return prev;
      }, {}),
    [habits]
  );
  const value = useMemo(
    () =>
      ({
        habits: habits as unknown as ContextValue["habits"],
        habitsObject,
      } as ContextValue),
    [habits]
  );

  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
