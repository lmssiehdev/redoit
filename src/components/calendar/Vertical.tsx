import { Button } from "@/components/ui/button";
import { useDate } from "@/context/DateProvider";
import { days } from "@/utils/constants/date";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
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
        className="flex items-center justify-end p-2 ml-auto"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </Button>
      <div className="flex flex-1 justify-between">
        <div className="hidden sm:flex gap-3 flex-1 ">
          {calendarDates &&
            calendarDates.length > 0 &&
            calendarDates.map((item: string) => {
              const date = new Date(item);
              return (
                <div
                  key={date.toDateString()}
                  className="flex-1 text-center flex  justify-between"
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
          className="sm:hidden flex-1 flex items-center justify-center
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
        <ChevronRightIcon className="h-5 w-5" />
      </Button>

      {}
    </>
  );
}
