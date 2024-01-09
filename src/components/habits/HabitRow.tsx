"use client";

import { Button } from "@/components/ui/button";

import { DayWithToolTip } from "@/components/calendar/Monthly";
import CurrentStreak from "@/components/habits/CurrentStreak";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDate } from "@/context/DateProvider";
import { useHabit } from "@/context/HabitProvider";
import { DotsThreeVertical } from "@phosphor-icons/react";
import Link from "next/link";
import { memo } from "react";

function HabitRow() {
  const {
    deleteHabit,
    markDate,
    completedDates,
    habitData,
    habitId,
    archiveHabit,
  } = useHabit();

  const { calendarDates: dateArray } = useDate();

  return (
    <>
      {/* <div className="flex items-center justify-between border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted py-2"> */}
      <div className="group flex items-center justify-between">
        <Link
          href={`habit/${habitId.replace("habit/", "")}`}
          className="flex items-center gap-2 border-l-2 pl-2"
          style={{
            borderColor: habitData?.color,
          }}
        >
          <span>
            {habitData?.name} {habitData?.archived ? "archive" : "unarchive"}
          </span>
        </Link>
        <div>
          <DataTableRowActions
            archiveHabit={archiveHabit}
            habitId={habitId.replace("habit/", "")}
            deleteFn={() => deleteHabit()}
          />
        </div>
      </div>
      <div className="flex items-center justify-around gap-3">
        {dateArray.map((date) => {
          return (
            <DayWithToolTip
              date={date}
              key={date}
              markDate={markDate}
              habitData={habitData}
              completedDates={completedDates}
            />
          );
        })}
      </div>
      <CurrentStreak completedDates={completedDates} />
    </>
  );
}

const memoHabitRow = memo(HabitRow);

export { memoHabitRow as HabitRow };

export function DataTableRowActions({
  habitId,
  archiveHabit,
  deleteFn,
}: {
  habitId: string;
  archiveHabit: () => void;
  deleteFn: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="group-hover:visible data-[state=open]:visible sm:invisible"
        >
          <DotsThreeVertical weight="bold" className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`edit/${habitId}`} className="">
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={archiveHabit}>
          Archive
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteFn}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
