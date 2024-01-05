"use client";

import VerticalCalendarWrapper from "@/components/calendar/Vertical";
import { HabitRow } from "@/components/habits/HabitRow";
import { buttonVariants } from "@/components/ui/button";
import { HabitProvider } from "@/context/HabitProvider";
import { useHabits } from "@/context/HabitsProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export function HabitList() {
  const { habitsObject } = useHabits();

  return (
    <>
      <div className="my-2 flex items-center justify-between gap-2 md:grid md:grid-cols-[minmax(0px,200px),6fr,40px] ">
        <VerticalCalendarWrapper />
      </div>

      {Object.keys(habitsObject).map((habitId) => {
        return (
          <div
            className="my-2 grid grid-rows-2 gap-2 md:grid-cols-[minmax(0px,200px),6fr,40px] md:grid-rows-1"
            key={habitId}
          >
            <HabitProvider habitId={habitId}>
              <HabitRow />
            </HabitProvider>
          </div>
        );
      })}
      <div className="my-2 grid grid-rows-2 gap-2 md:grid-cols-[minmax(0px,200px),6fr,40px] md:grid-rows-1">
        <Link
          href="/create"
          className={cn(
            buttonVariants({
              variant: "jounral",
            }),
            "bg-green-100 text-green-900 hover:bg-green-100/50",
          )}
        >
          Add Habit
        </Link>
      </div>
    </>
  );
}
