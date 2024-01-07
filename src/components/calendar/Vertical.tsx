import { Button } from "@/components/ui/button";
import { useDate } from "@/context/DateProvider";
import { days } from "@/utils/constants/date";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import dayjs from "dayjs";

interface Props {
  className?: string;
}

export default function VerticalCalendarWrapper({ className }: Props) {
  const { calendarDates, goToNextDay, goToPrevDay, currDate } = useDate();

  return (
    <>
      <Button
        variant="ghost"
        onClick={goToPrevDay}
        className="ml-auto flex items-center justify-end p-2"
      >
        <CaretLeft className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 justify-between">
        <div className="hidden flex-1 gap-3 sm:flex ">
          {calendarDates &&
            calendarDates.length > 0 &&
            calendarDates.map((item: string) => {
              const date = new Date(item);
              return (
                <div
                  key={date.toDateString()}
                  className="flex flex-1 justify-between  text-center"
                >
                  <span className="w-full text-center">
                    <p>{days[date.getDay()].substring(0, 2)}</p>
                    <p>{date.getDate()}</p>
                    {/* <p key={item}>{months[date.getMonth()].substring(0, 3)}</p> */}
                  </span>
                </div>
              );
            })}
        </div>

        <div
          className="flex flex-1 items-center justify-center sm:hidden
        "
        >
          {`
          ${dayjs(calendarDates[0]).format("DD MMM")}
          -
          ${dayjs(calendarDates[calendarDates.length - 1]).format("DD MMM")}
          `}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        className="flex items-center justify-center disabled:cursor-not-allowed"
        disabled={currDate.startOf("day").isSame(dayjs().startOf("day"))}
      >
        <CaretRight className="h-5 w-5" />
      </Button>
      {}
    </>
  );
}
