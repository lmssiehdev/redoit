import { useHabitsStore } from "@/state";
import type { HabitData } from "@/types";
import { createContext, useContext } from "react";

type ContextValue = {
  habitData: HabitData;
};

const HabitContext = createContext({} as ContextValue);

export function HabitProvider({
  children,
  habitId,
}: {
  children: React.ReactNode;
  habitId: string;
}) {
  const data = useHabitsStore((state) => state.data);
  const habitData = data[habitId];

  if (!habitData) return <div>{"Habit Doesn't Exist!"}</div>;

  return (
    <HabitContext.Provider value={{ habitData }}>
      {children}
    </HabitContext.Provider>
  );
}

export function useHabit() {
  const context = useContext(HabitContext);
  if (context === undefined) {
    throw new Error("useHabit must be used within a HabitProvider");
  }
  return context;
}
