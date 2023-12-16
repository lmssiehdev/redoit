"use client";

import { Button } from "@/components/ui/button";
import { Habit } from "@/utils/habits";

import { Day } from "@/components/habits/Day";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useHabit } from "@/context/HabitProvider";
import { useCalculateStreak } from "@/hooks/useCalculateStreak";
import { LightningBoltIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useDate } from "@/context/DateProvider";
import { memo } from "react";

function HabitRow() {
  const {
    deleteHabit,
    markDate,
    completedDates: datesObject,
    habitData: v,
    habitId,
  } = useHabit();

  const { calendarDates: dateArray } = useDate();
  const { currentStreak } = useCalculateStreak(datesObject);

  return (
    <>
      {/* <div className="flex items-center justify-between border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted py-2"> */}
      {/* {JSON.stringify(streak)} */}
      <div className="flex items-center justify-between group">
        <Link
          href={`habit/${habitId.replace("habit/", "")}`}
          className="flex items-center gap-2 border-l-2 pl-2"
          style={{
            borderColor: v?.color,
          }}
        >
          {/* <span className="h-3 w-3 rounded-full" style={{}}></span> */}
          <span>{v?.name} </span>
        </Link>
        <div>
          <DataTableRowActions
            habitId={habitId.replace("habit/", "")}
            deleteFn={() => deleteHabit()}
          />
        </div>
      </div>
      <div className="flex gap-3 justify-around items-center">
        {dateArray.map((date) => {
          return (
            <Day
              status={datesObject[date]}
              key={date}
              onClick={() => markDate(date)}
              color={v?.color}
            />
          );
        })}
      </div>
      <span className="flex gap-1.5  items-center text-sm">
        <LightningBoltIcon />
        {currentStreak}
      </span>
    </>
  );
}

const memoHabitRow = memo(HabitRow);

export { memoHabitRow as HabitRow };

export function DataTableRowActions({
  habitId,
  deleteFn,
}: {
  habitId: string;
  deleteFn: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="group-hover:visible data-[state=open]:visible invisible"
        >
          <Pencil1Icon />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link href={`edit/${habitId}`}>Edit</Link>
        </DropdownMenuItem>
        {/* <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={deleteFn}>
          Delete
          {/* <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut> */}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
