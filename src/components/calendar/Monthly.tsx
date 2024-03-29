import { Day } from "@/components/habits/Day";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useHabit } from "@/context/HabitProvider";
import { useMonth } from "@/hooks/useMonthNavigation";
import { days, months } from "@/utils/constants/date";
import { Habit } from "@/utils/habits";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";

import dayjs, { Dayjs } from "dayjs";

export function MonthlyCalendar() {
  const {
    currentYear,
    currentMonth,
    goToNextMonth,
    goToPrevMonth,
    isCurrentMonth,
    startOffset,
    daysInMonth,
  } = useMonth();

  return (
    <>
      <MonthlyNavigation
        month={currentMonth}
        nextMonth={goToNextMonth}
        prevMonth={goToPrevMonth}
        isCurrentMonth={isCurrentMonth}
      />
      <MonthlyView
        startOffset={startOffset}
        daysInMonth={daysInMonth}
        date={{ year: currentYear, month: currentMonth }}
      />
    </>
  );
}

function MonthlyNavigation({
  month,
  nextMonth,
  prevMonth,
  isCurrentMonth,
}: {
  month: number;
  nextMonth: () => void;
  prevMonth: () => void;
  isCurrentMonth: boolean;
}) {
  return (
    <div className="flex flex-1 items-center justify-between gap-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={prevMonth}
        className="border-1 flex items-center"
      >
        <CaretLeft />
      </Button>
      <span>{months[month]}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
        className="border-1 flex items-center"
        disabled={isCurrentMonth}
      >
        <CaretRight />
      </Button>
    </div>
  );
}

function MonthlyView({
  startOffset,
  daysInMonth,
  date,
}: {
  startOffset: number;
  daysInMonth: number;
  date: {
    year: number;
    month: number;
  };
}) {
  const { completedDates, habitData, markDate } = useHabit();
  console.log({ completedDates });
  return (
    <div className="">
      <div className=" grid-rows-7 children:aspect-square children:h-12 grid grid-cols-7 gap-3">
        {days.map((day) => (
          <div key={day} className=" flex items-center justify-center  ">
            {day.substring(0, 2)}
          </div>
        ))}
        {[...Array(startOffset)].map((e, index) => {
          return <div key={index}></div>;
        })}
        {[...Array(daysInMonth)].map((day, index) => {
          const dateJS = dayjs(
            `${date.month + 1}-${index + 1}-${date.year}`,
          ) as dayjs.Dayjs;
          return (
            <DayWithToolTip
              key={day}
              date={dateJS}
              markDate={markDate}
              habitData={habitData}
              completedDates={completedDates}
            />
          );
        })}
      </div>
    </div>
  );
}

export function DayWithToolTip({
  date,
  markDate,
  habitData,
  completedDates,
}: {
  date: Dayjs | string;
  markDate: (date: string) => void;
  habitData: Habit.Definition;
  completedDates: Record<string, "checked" | "skipped">;
}) {
  const formatedDate = dayjs(date).format("YYYY-M-D");
  const isFuture = dayjs(date).isAfter(new Date());
  const isActive = habitData?.frequency[dayjs(date).day()];

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex justify-center ">
            <Day
              status={completedDates[formatedDate]}
              color={habitData?.color}
              // disabled={habit.frequency[dateJS.day()]}
              disabled={!isActive || isFuture}
              onClick={() => {
                if (isFuture) return;
                markDate(formatedDate);
              }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>
            {isActive ? (
              <>
                {completedDates[formatedDate]
                  ? `${completedDates[formatedDate]} • `
                  : ""}
              </>
            ) : (
              "not tracked • "
            )}
            {formatedDate}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
