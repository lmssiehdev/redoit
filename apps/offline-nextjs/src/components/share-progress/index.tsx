import { useMonthContext } from "@/components/calendar/monthly/date-provider";
import { Button } from "@/components/ui/button";
import { useHabit } from "@/app/habit/[id]/page";
import { useHabitsStore } from "@/state";
import dayjs, { type Dayjs } from "dayjs";
import { useRef } from "react";
import { useScreenshot } from "use-react-screenshot";

function generateProgressDates() {
  return Array.from({ length: 4 }, (_, i) => {
    const date = dayjs().subtract(i, "month");
    return {
      year: date.year(),
      month: date.month(),
      daysInMonth: date.daysInMonth(),
      startOffset: date.startOf("month").day(),
    };
  });
}

export function ShareProgress() {
  const {
    habitData: { color, dates },
  } = useHabit();
  const { daysInMonth, startOffset, currentMonth, currentYear } =
    useMonthContext();
  const markHabit = useHabitsStore((state) => state.markHabit);
  const { habitData } = useHabit();
  const ref = useRef(null);
  const [image, takeScreenshot] = useScreenshot();
  const getImage = () => takeScreenshot(ref.current);

  console.log({
    daysInMonth,
  });
  return (
    <>
      <Button onClick={getImage}>Share Progress</Button>
      <img width={"300"} src={image} alt={"Screenshot"} />
      <div ref={ref} className="polkadot flex p-4">
        {generateProgressDates().map(({ month }) => (
          <div key={month} className="grid grid-cols-7 gap-2 mx-2 ">
            {Array.from({ length: startOffset }, (_, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <div key={`${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const date: Dayjs = dayjs(
                `${currentMonth + 1}-${i + 1}-${currentYear}`
              );
              return (
                <div
                  key={date.toString()}
                  className="size-2.5 bg-red-400 rounded-md"
                />
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}
