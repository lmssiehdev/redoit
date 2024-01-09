"use client";

import { AppBackButton } from "@/app/(replicache)/create/page";
import { MonthlyCalendar } from "@/components/calendar/Monthly";
import { Overview } from "@/components/habits/Overview";
import { Streaks } from "@/components/habits/Streaks";
import { Button, buttonVariants } from "@/components/ui/button";
import { HabitProvider, useHabit } from "@/context/HabitProvider";
import { PencilSimple, TrashSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HabitPage({ params }: { params: { id: string } }) {
  const habitId = `habit/${params.id}`;

  return (
    <div>
      <div className="mb-5">
        <AppBackButton />
      </div>
      <HabitProvider habitId={habitId}>
        <Content paramsId={habitId} />
      </HabitProvider>
    </div>
  );
}

function Content({ paramsId }: { paramsId: string }) {
  const router = useRouter();
  const { completedDates, habitData, habitId, markDate, deleteHabit } =
    useHabit();
  if (!habitData || habitData.id != paramsId)
    return <div>Habits doesn't exist : /</div>;

  function handleDeleteHabit() {
    deleteHabit();
    router.push("/web");
  }

  return (
    <div className="mx-auto flex w-full flex-col gap-12 sm:flex-row">
      <div className="flex-1">
        <div className="flex items-center justify-between ">
          <div
            className="border-l-2 pl-2"
            style={{
              borderColor: habitData?.color,
            }}
          >
            {habitData.name}
          </div>
          <div className="flex items-center gap-2">
            <Link
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
              href={`/edit/${habitId.replace("habit/", "")}`}
            >
              <PencilSimple className="h-4 w-4" />
            </Link>
            <Button variant="ghost" size="icon" onClick={handleDeleteHabit}>
              <TrashSimple className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="my-5">
          <MonthlyCalendar />
        </div>
      </div>
      <div className="flex-1">
        <div>
          <h2 className="mb-5 text-center text-xl">Overview</h2>
          <Overview color={habitData?.color} />
        </div>
        <div>
          <h2 className="mb-5 text-center text-xl">Streaks</h2>
          <Streaks />
        </div>
      </div>
    </div>
  );
}
