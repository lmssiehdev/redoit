"use client";

import VerticalCalendarWrapper from "@/components/calendar/Vertical";
import { HabitRow } from "@/components/habits/HabitRow";
import { buttonVariants } from "@/components/ui/button";
import { HabitProvider } from "@/context/HabitProvider";
import { useHabits } from "@/context/HabitsProvider";
import { cn } from "@/utils/misc";
import { Plus } from "@phosphor-icons/react";
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
      <AddHabitButton />
    </>
  );
}

function AddHabitButton() {
  return (
    <>
      {/* Mobile */}
      <div className="absolute bottom-10 right-10">
        <Link
          href="/create"
          className={cn(
            buttonVariants({
              variant: "jounral",
            }),
            "inline-block h-20 w-20 rounded-full",
            "bg-green-100 text-green-900 hover:bg-green-100/50",
          )}
        >
          <Plus className="h-full w-full p-2" weight="bold" />
        </Link>
      </div>
      {/* Desktop */}
      <div className="my-2 grid hidden grid-rows-2 gap-2 md:grid-cols-[minmax(0px,200px),6fr,40px] md:grid-rows-1">
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
