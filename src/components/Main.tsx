"use client";

import { HabitList } from "@/components/habits/HabitList";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useHabits } from "@/context/HabitsProvider";
import { cn } from "@/utils/misc";
import Link from "next/link";

export default function Home() {
  return <Main />;
}

export function Main() {
  const { habits } = useHabits();

  return (
    <div className="max-w-screen-sm w-full mx-auto">
      {habits.length === 0 ? (
        <div className="flex flex-col gap-3">
          <div>Get started</div>
          <Link
            href="/create"
            className={cn(
              buttonVariants({ variant: "jounral" }),
              "w-fit text-green-700 bg-green-200 hover:bg-green-200/50"
            )}
          >
            Add Habit
          </Link>
        </div>
      ) : (
        <>
          <HabitList habits={habits} />
        </>
      )}
    </div>
  );
}

export function ToastSimple() {
  const { toast } = useToast();

  return (
    <Button variant="outline" onClick={() => {}}>
      Show Toast
    </Button>
  );
}
