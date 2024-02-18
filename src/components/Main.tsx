"use client";

import { HabitList } from "@/components/habits/HabitList";
import { buttonVariants } from "@/components/ui/button";
import { useHabits } from "@/context/HabitsProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export default function Home() {
  const { habits, isSearching } = useHabits();

  if (isSearching) {
    // TODO: use a skeleton
    return <>loading...</>;
  }

  if (habits.length === 0) {
    return (
      <div className="mx-auto w-full max-w-screen-sm">
        <div className="flex flex-col items-center gap-3">
          <h2 className="text-lg ">You don't have any habits yet!</h2>
          <Link
            href="/create"
            className={cn(
              buttonVariants({ variant: "jounral" }),
              "w-fit bg-green-200 text-green-700 hover:bg-green-200/50",
            )}
          >
            Add Habit
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-screen-sm">
      <HabitList />
    </div>
  );
}
