import { Day } from "@/components/habits/Day";
import { Button } from "@/components/ui/button";
import { useHabit } from "@/context/HabitProvider";
import { useMonth } from "@/hooks/useMonthNavigation";
import { days, months } from "@/utils/constants/date";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";

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
    <div className="flex items-center justify-between gap-1 flex-1">
      <Button
        variant="ghost"
        size="icon"
        onClick={prevMonth}
        className="flex items-center border-1"
      >
        <ChevronLeftIcon />
      </Button>
      <span>{months[month]}</span>
      <Button
        variant="ghost"
        size="icon"
        onClick={nextMonth}
        className="flex items-center border-1"
        disabled={isCurrentMonth}
      >
        <ChevronRightIcon />
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
  // today: string;
  date: {
    year: number;
    month: number;
  };
}) {
  const { completedDates, habitData, habitId, markDate } = useHabit();

  return (
    <div className="">
      <div className=" grid grid-cols-7 grid-rows-7 children:aspect-square children:h-12 gap-3">
        {days.map((day) => (
          <div key={day} className=" flex justify-center items-center opaci ">
            {day.substring(0, 2)}
          </div>
        ))}
        {[...Array(startOffset)].map((e, index) => {
          return <div key={index}></div>;
        })}
        {[...Array(daysInMonth)].map((day, index) => {
          const dateJS = dayjs(
            `${date.month + 1}-${index + 1}-${date.year}`
          ) as dayjs.Dayjs;
          const formatedDate = dateJS.format("YYYY-M-D");
          return (
            <div className="flex justify-center" key={day} title={formatedDate}>
              <Day
                status={completedDates[formatedDate]}
                color={habitData?.color}
                // disabled={habit.frequency[dateJS.day()]}
                onClick={() => markDate(formatedDate)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
