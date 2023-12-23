"use client";

import VerticalCalendarWrapper from "@/components/calendar/Vertical";
import { HabitRow } from "@/components/habits/HabitRow";
import { buttonVariants } from "@/components/ui/button";
import { HabitProvider } from "@/context/HabitProvider";
import { useHabits } from "@/context/HabitsProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export function HabitList() {
  const { habits } = useHabits();

  return (
    <>
      <div className="my-2 flex justify-between items-center md:grid md:grid-cols-[minmax(0px,200px),6fr,40px] gap-2 ">
        <VerticalCalendarWrapper />
      </div>

      {habits.map(([k, v]) => {
        return (
          <div
            className="my-2 grid grid-rows-2 md:grid-rows-1 md:grid-cols-[minmax(0px,200px),6fr,40px] gap-2"
            key={k}
          >
            <HabitProvider habitId={k}>
              <HabitRow />
            </HabitProvider>
          </div>
        );
      })}
      <div className="my-2 grid grid-rows-2 md:grid-rows-1 md:grid-cols-[minmax(0px,200px),6fr,40px] gap-2">
        <Link
          href="/create"
          className={cn(
            buttonVariants({
              variant: "jounral",
              // size: "sm",
            }),
            "text-green-900 bg-green-100 hover:bg-green-100/50"
          )}
        >
          Add Habit
        </Link>
      </div>
    </>
  );
}
