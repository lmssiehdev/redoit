// import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { ChevronLeft } from "@/components/icons/ChevronLeft";
import { ChevronRight } from "@/components/icons/ChevronRight";
import { Button } from "@/components/ui/button";
import { useDate } from "@/context/DateProvider";
import { days } from "@/utils/constants/date";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";

interface Props {
  className?: string;
}

export default function VerticalCalendarWrapper({ className }: Props) {
  const { calendarDates, goToNextDay, goToPrevDay } = useDate();

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
        <div className="flex flex-1">
          {calendarDates &&
            calendarDates.length > 0 &&
            calendarDates.map((item: string) => {
              const date = new Date(item);
              return (
                <div key={date.toDateString()} className="flex-1 text-center">
                  <span className="w-9">
                    <p>{days[date.getDay()].substring(0, 3)}</p>
                    <p>{date.getDate()}</p>
                    {/* <p key={item}>{months[date.getMonth()].substring(0, 3)}</p> */}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNextDay}
        className="flex items-center justify-center"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </Button>
    </>
  );
}
