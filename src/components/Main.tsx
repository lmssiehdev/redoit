"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDateNavigator } from "@/hooks/useDayNavigation";
import { ReplicacheClient, useReplicache } from "@/hooks/useReplicache";
import { HABIT_TEMPLATE, Habit } from "@/utils/habits";
import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";
import Pusher from "pusher-js";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSubscribe } from "replicache-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Day } from "@/components/habits/Day";
import { cn } from "@/utils/misc";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home({ userId }: { userId?: string }) {
  const { data: rep } = useReplicache({
    userId,
  });

  useEffect(() => {
    if (!rep) return;
    listen({
      rep,
    });
  }, []);

  if (!rep) return "loading";
  return (
    <>
      <Main rep={rep} />
    </>
  );
}

export function Main({ rep }: { rep: ReplicacheClient }) {
  const messages = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: "habit/" })
        .entries()
        .toArray()) as [string, { id: string; name: string }][];
      // list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    []
  );

  const contentRef = useRef<HTMLInputElement>(null);

  const handleCreateMessage = () => {
    const habit = {
      ...HABIT_TEMPLATE,
      id: nanoid(),
      name: contentRef?.current?.value as unknown as string,
    } as Habit.Definition;

    rep?.mutate.createHabit(habit);

    contentRef.current.value = "";
  };

  const handleHabitDeletion = (id: string) => {
    rep?.mutate.deleteHabit(id);
  };

  const handleHabitUpdate = (id: string, args: Partial<Habit.Definition>) => {
    const result = messages.find((habit) => habit[0] === id);
    if (!result) return;

    const [_, habit] = result;

    rep?.mutate.updateHabit({
      id,
      args,
    });
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateMessage();
        }}
        className="flex gap-4"
      >
        <Input ref={contentRef} required />
        <Button type="submit">Add</Button>
      </form>
      <MessageList
        messages={messages}
        rep={rep}
        handleHabitDeletion={handleHabitDeletion}
        handleHabitUpdate={handleHabitUpdate}
      />
    </div>
  );
}

function MessageList({
  messages,
  handleHabitDeletion,
  handleHabitUpdate,
  rep,
}: {
  rep: any;
  messages: any[];
  handleHabitUpdate: (id: string, args: Partial<Habit.Definition>) => void;
  handleHabitDeletion: (id: string) => void;
}) {
  const { dateArray } = useDateNavigator();

  const [canEdit, setCanEdit] = useState(true);
  const [habitName, setHabitName] = useState("");

  return messages.map(([k, v]) => {
    return <HabitRow k={k} v={v} dateArray={dateArray} rep={rep} />;
  });
}

function HabitRow({
  k,
  v,
  dateArray,
  rep,
}: {
  k: string;
  v: Habit.Definition;
  dateArray: string[];
  rep: ReplicacheClient;
}) {
  const completedDates = useSubscribe(
    rep,
    async (tx) => {
      const list = (await tx
        .scan({ prefix: `date/${k}` })
        .entries()
        .toArray()) as []; // [string, { id: string; name: string }][];
      // list.sort(([, { order: a }], [, { order: b }]) => a - b);
      return list;
    },
    []
  );

  const datesObject = useMemo(
    () =>
      completedDates.reduce((prev, [id, status]) => {
        const tempArr = (id as string).split("/");
        const date = tempArr[tempArr.length - 1];
        prev[date as keyof typeof prev] = status;
        return prev;
      }, {} as Record<string, "checked" | "skipped">),
    [completedDates]
  );

  const handleMarkHabit = (id: string, date: string) => {
    const generateDateId = (habitId: string, date: string) =>
      `date/${habitId}/${date}`;
    const dateId = generateDateId(id, date);
    const newStatus = datesObject[date] === "checked" ? "skipped" : "checked";
    rep?.mutate.markHabit({
      id,
      args: {
        dateId,
        status: newStatus,
      },
    });
    return;
  };

  return (
    <div
      key={k}
      className="flex items-center justify-between border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted py-2"
    >
      <div>
        <>
          <b
            style={{
              backgroundColor: v.color,
            }}
          >
            {v.name}{" "}
          </b>
          {/* <button onClick={() => setCanEdit(true)}> - edit </button> */}
        </>
      </div>
      <div className="flex gap-3 items-center justify-center">
        {/* {JSON.stringify(datesObject)} */}
        {dateArray.map((date) => {
          return (
            <Day
              status={datesObject[date]}
              key={date}
              onClick={() => handleMarkHabit(k, date)}
              color={"purple"}
            />
          );
        })}
      </div>
      <div>
        <DataTableRowActions />
      </div>
    </div>
  );
}

function listen({ rep }: { rep: ReplicacheClient }) {
  if (!rep) {
    return;
  }

  console.log("listening");
  // Listen for pokes, and pull whenever we get one.
  Pusher.logToConsole = true;
  const pusher = new Pusher(process.env.NEXT_PUBLIC_REPLICHAT_PUSHER_KEY!, {
    cluster: "us2",
  });

  pusher;
  const channel = pusher.subscribe("default");
  channel.bind("poke", () => {
    console.log("got poked");
    rep.pull();
  });
}

export function DataTableRowActions() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-4 h-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>Edit</DropdownMenuItem>
        <DropdownMenuItem>Make a copy</DropdownMenuItem>
        <DropdownMenuItem>Favorite</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
