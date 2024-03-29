"use client";

import { useToast } from "@/components/ui/use-toast";
import { useHabits } from "@/context/HabitsProvider";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { Habit } from "@/utils/habits";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSubscribe } from "replicache-react";

type ContextValue = {
  habit: Habit.Definition;
  isSearching: boolean;
  completedDates: Record<string, "checked" | "skipped">;
  habitData: Habit.Definition;
  habitId: string;
  markDate: (date: string) => void;
  deleteHabit: () => void;
  archiveHabit: () => void;
};
const HabitContext = createContext<ContextValue | null>(null);

export function useHabit() {
  const context = useContext(HabitContext);
  if (!context) throw new Error("useUser must be used within an HabitContext.");
  return context;
}

export function HabitProvider({
  children,
  habitId,
}: {
  habitId: string;
  children: React.ReactNode;
}) {
  const { rep } = useReplicacheFromContext();
  const { habitsObject: _habits } = useHabits();
  const { toast } = useToast();

  // const habits = useSubscribe(
  //   rep,
  //   async (tx) => {
  //     console.log("searching for", habitId);
  //     const list = (await tx
  //       .scan({ prefix: `${habitId}` })
  //       .entries()
  //       .toArray()) as []; // [string, { id: string; name: string }][];
  //     // list.sort(([, { order: a }], [, { order: b }]) => a - b);
  //     setIsSearching(false);
  //     return list;
  //   },
  //   [],
  // );
  const completedDates = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: `date/${habitId}` })
        .entries()
        .toArray()) as []; // [string, { id: string; name: string }][];
      // list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    [],
  );

  // const habitData = useMemo(() => {
  //   const [result] = habits as unknown as [[string, Habit.Definition]];
  //   if (result == undefined || result.length != 2) return;
  //   return {
  //     ...result[1],
  //     id: result[0],
  //   };
  // }, [habits]);

  const datesObject = useMemo(
    () =>
      completedDates.reduce(
        (prev, [id, status]) => {
          const tempArr = (id as string).split("/");
          const date = tempArr[tempArr.length - 1];
          prev[date as keyof typeof prev] = status;
          return prev;
        },
        {} as Record<string, "checked" | "skipped">,
      ),
    [completedDates],
  );

  const deleteHabit = () => {
    rep?.mutate.deleteHabit(habitId);
    toast({
      description: "Habit deleted.",
      duration: 1500,
    });
  };

  const value = useMemo(
    () =>
      ({
        habitData: _habits[habitId],
        completedDates: datesObject,
        habitId,
        deleteHabit,
        markDate: (date: string) => {
          const generateDateId = (habitId: string, date: string) =>
            `date/${habitId}/${date}`;
          const dateId = generateDateId(habitId, date);

          if (datesObject[date] === "skipped") {
            rep.mutate.deleteDate({
              dateId,
              habitId,
            });
            return;
          }

          const newStatus =
            datesObject[date] === "checked" ? "skipped" : "checked";
          rep?.mutate.markHabit({
            id: habitId,
            args: {
              dateId,
              status: newStatus,
            },
          });
          return;
        },
        archiveHabit: () => {
          const habitData = _habits[habitId];
          if (!habitData) return;
          const updatedHabit = {
            ...habitData,
            archived: !habitData?.archived,
          };
          rep?.mutate.updateHabit({
            id: habitId,
            args: updatedHabit,
          });
        },
      }) as ContextValue,
    [datesObject, habitId, rep],
  );

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
}
