import { DayWithToolTip } from "@/components/calendar/day";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DAYS } from "@/constants";
import { HabitProvider } from "@/routes/habit/$habitId";
import { useHabitsStore } from "@/state";
import {
  Archive,
  CaretLeft,
  CaretRight,
  DotsSixVertical,
  DotsThreeVertical,
  Plus,
  StackPlus,
} from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import dayjs from "dayjs";
import { formatDateRange } from "little-date";
import { useEffect } from "react";

import {
  WeeklyDateProvider,
  useWeeklyDate,
} from "@/components/calendar/weekly/date-provider";
import { RepeatedHeader } from "@/components/calendar/weekly/misc";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { TinyColor } from "@ctrl/tinycolor";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  restrictToVerticalAxis,
  restrictToWindowEdges,
} from "@dnd-kit/modifiers";
import {
  type AnimateLayoutChanges,
  SortableContext,
  defaultAnimateLayoutChanges,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useLocation } from "@tanstack/react-router";

export function WeeklyNavigation() {
  const { NEXT_DAY, PREV_DAY, dateArray } = useWeeklyDate();

  return (
    <div className="my-2 flex items-center justify-between gap-2 sm:grid sm:grid-cols-[minmax(0px,200px),6fr,40px]">
      <Button
        className="ml-auto"
        size="sm"
        variant="outline"
        onClick={PREV_DAY}
      >
        <CaretLeft className="h-5 w-5" />
      </Button>
      <div className="flex-1 justify-between hidden sm:flex">
        {dateArray.map((dateString) => {
          const date = new Date(dateString);
          return (
            <div
              key={date.toDateString()}
              className="flex flex-1 justify-between  text-center"
            >
              <span className="w-full text-center">
                <p>{DAYS[date.getDay()].substring(0, 2)}</p>
                <p>{date.getDate()}</p>
              </span>
            </div>
          );
        })}
      </div>
      <div className="block sm:hidden w-full text-center font-semibold">
        {formatDateRange(
          dayjs(dateArray[0]).startOf("day").toDate(),
          dayjs(dateArray[dateArray.length - 1])
            .startOf("day")
            .toDate(),
          {
            includeTime: false,
          }
        )}
      </div>
      <Button size="sm" variant="outline" onClick={NEXT_DAY}>
        <CaretRight className="h-5 w-5" />
      </Button>
    </div>
  );
}

export function HabitColor({
  color,
  className,
}: {
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn("size-3 rounded-full", className)}
      style={{
        backgroundColor: new TinyColor(color).desaturate().toHexString(),
      }}
    />
  );
}

export function SortableHabitRow({ habitId }: { habitId: string }) {
  const { dateArray } = useWeeklyDate();
  const markHabit = useHabitsStore((state) => state.markHabit);
  const deleteHabit = useHabitsStore((state) => state.deleteHabit);
  const archiveHabit = useHabitsStore((state) => state.archiveHabit);
  const { color, name, isArchived } = useHabitsStore(
    (state) => state.data[habitId]
  );
  const { isMobile } = useMediaQuery();
  const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({ ...args, wasDragging: true });

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    setActivatorNodeRef,
    isDragging,
  } = useSortable({ id: habitId, animateLayoutChanges });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  useEffect(() => {
    if (!isDragging) return;
    document.body.style.cursor = "grabbing";

    return () => {
      document.body.style.cursor = "";
    };
  }, [isDragging]);

  const Action = (
    <HabitRowAction
      habitId={habitId}
      archiveHabit={() => archiveHabit(habitId)}
      deleteFn={() => deleteHabit(habitId)}
      isArchived={isArchived}
    />
  );

  return (
    <>
      <div
        key={habitId}
        id={habitId}
        ref={setNodeRef}
        className="flex gap-1 items-center"
        {...attributes}
        style={style}
      >
        <div className="my-2 grid grid-rows-2 gap-2 sm:grid-cols-[minmax(0px,200px),6fr,40px] sm:grid-rows-1 w-full">
          <div className={clsx("flex items-center")}>
            {!isArchived && (
              <Button
                className="cursor-grab active:cursor-grabbing mx-1"
                size="xs"
                variant="ghost"
                ref={setActivatorNodeRef}
                {...listeners}
              >
                <DotsSixVertical />
              </Button>
            )}
            <HabitColor color={color} className="mr-2" />
            <Link
              to="/habit/$habitId"
              params={{ habitId }}
              className="flex items-center gap-2"
            >
              {name}
            </Link>
            {isMobile && <div className="ml-auto">{Action}</div>}
          </div>
          <HabitProvider habitId={habitId}>
            <div className="grid grid-cols-7 gap-2">
              {dateArray.map((date) => (
                <DayWithToolTip
                  key={date}
                  date={date}
                  markDate={() => markHabit({ id: habitId, date })}
                />
              ))}
            </div>
            {!isMobile && Action}
          </HabitProvider>
        </div>
      </div>
    </>
  );
}

export function HabitRow({ archived = false }) {
  const habitData = useHabitsStore((state) => state.data);
  const orderedHabits = useHabitsStore((state) => state.orderedData);
  const reorderHabit = useHabitsStore((state) => state.reorderHabit);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const habitsToRender = orderedHabits.filter(
    (habitId) => habitData[habitId].isArchived === archived
  );

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}
      >
        <SortableContext
          items={habitsToRender}
          strategy={verticalListSortingStrategy}
        >
          {habitsToRender.map((id) => (
            <SortableHabitRow key={id} habitId={id} />
          ))}
        </SortableContext>
      </DndContext>
    </>
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    const activeId = active.id as string;
    const overId = over?.id as string;

    if (activeId !== overId) {
      reorderHabit({ activeId, overId });
    }
  }
}

export function HabitRowAction({
  habitId,
  archiveHabit,
  deleteFn,
  isArchived,
}: {
  habitId: string;
  archiveHabit: () => void;
  deleteFn: () => void;
  isArchived: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="group-hover:visible data-[state=open]:visible"
        >
          <DotsThreeVertical weight="bold" className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem asChild>
          <Link to="/edit/$habitId" params={{ habitId }}>
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={archiveHabit}>
          {isArchived ? "Unarchive" : "Archive"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={deleteFn} className="!text-destructive">
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function StreakRow() {
  const { dateArray } = useWeeklyDate();
  const data = useHabitsStore((state) => state.data);

  function caluculateDateStreak(date: string) {
    let count = 0;
    for (const { dates } of Object.values(data)) {
      if (dates[date] === "completed") {
        count++;
      }
    }
    return count;
  }

  return (
    <div className="flex items-center justify-between gap-2 sm:grid sm:grid-cols-[minmax(0px,200px),6fr,40px]">
      <div />
      <div className="grid grid-cols-7 gap-2 py-1 text-center">
        {dateArray.map((date, i) => (
          <div key={date}>{caluculateDateStreak(date)}</div>
        ))}
      </div>
      <div />
    </div>
  );
}

export function VerticalView() {
  const { isMobile } = useMediaQuery();
  const { pathname } = useLocation();
  const showArchived = pathname === "/archived";

  const emptyHabits = useHabitsStore(
    (state) =>
      Object.values(state.data).filter(
        ({ isArchived }) => isArchived === showArchived
      ).length === 0
  );

  if (emptyHabits)
    return (
      <div className="flex items-center flex-col gap-2 my-14">
        {showArchived ? (
          <>
            <Archive className="size-8 m-1" />
            <div className="text-xl">
              You don’t have any archived habits yet!
            </div>
          </>
        ) : (
          <>
            <StackPlus className="size-8 m-1" />
            <div className="text-xl">Your habit list is empty!</div>
            <Link
              to="/add"
              className={cn(
                buttonVariants({ size: "xs" }),
                "flex items-center gap-1"
              )}
            >
              <Plus weight="bold" className="size-3" />
              Add habit
            </Link>
          </>
        )}
      </div>
    );

  return (
    <>
      <div className="mt-2 mb-6">
        <h2 className="text-4xl font-semibold font-mathlete tracking-widest">
          {showArchived ? (
            <div className="flex gap-5">
              <RepeatedHeader word="archived" />
              <RepeatedHeader word="habits" />
            </div>
          ) : (
            <RepeatedHeader word="habits" />
          )}
        </h2>
      </div>
      <WeeklyDateProvider>
        <WeeklyNavigation />
        <HabitRow archived={showArchived} />
        {!isMobile && <StreakRow />}
      </WeeklyDateProvider>
    </>
  );
}
