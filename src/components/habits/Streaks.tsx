import { useHabit } from "@/context/HabitProvider";
import { cn, convertHexToRGBA } from "@/utils/misc";
import streakRanges from "@/utils/streakRanges";
import dayjs from "dayjs";
import { useMemo } from "react";

export function Streaks() {
  const { completedDates } = useHabit();
  const {
    habitData: { color },
  } = useHabit();
  const ranges = useMemo(() => {
    function getTop5RangesPercentages(
      ranges: ReturnType<typeof streakRanges>,
    ): number[] {
      const totalSum = ranges.reduce((sum, range) => sum + range.duration, 0);
      const percentages = ranges.map(
        (range) => (range.duration / totalSum) * 100,
      );
      return percentages;
    }

    const ranges = streakRanges(
      Object.keys(completedDates) as unknown as Date[],
    );

    const sortedRanges = ranges.sort((a, b) => b.duration - a.duration);
    const top5Ranges = sortedRanges.slice(0, 4);
    const top5RangesPercentages = getTop5RangesPercentages(top5Ranges);

    const updatedRage = top5Ranges.map((item, index) => {
      return {
        ...item,
        percentage: top5RangesPercentages[index],
      };
    });

    return updatedRage;
  }, [completedDates]);

  return (
    <div className="flex max-w-[400px] flex-col items-center justify-center gap-2 ">
      {ranges.map((item, index) => (
        <div key={index} className="flex w-full flex-1 justify-center gap-2 ">
          <span className="flex items-center whitespace-nowrap text-xs">
            {dayjs(new Date(item.start)).format("MMM DD")}
          </span>
          <div
            className={cn(
              "yellow transition-width min-w-fit justify-center rounded-[10px_0/100px_20px] px-1 py-[0.1rem] text-center duration-1000 ease-in-out",
            )}
            style={{
              width: `${item.percentage}%`,
              backgroundColor: convertHexToRGBA(color, 0.5),
            }}
          >
            <span className="mx-1 block">{item.duration}</span>
          </div>
          <span className="flex items-center whitespace-nowrap text-xs">
            {dayjs(new Date(item.end ? item.end : item.start)).format("MMM DD")}
          </span>
        </div>
      ))}
    </div>
  );
}
