"use client";

import { AppBackButton } from "@/app/(replicache)/create/page";
import { MonthlyCalendar } from "@/components/calendar/Monthly";
import ChartWrapper from "@/components/chart";
import { Button, buttonVariants } from "@/components/ui/button";
import { HabitProvider, useHabit } from "@/context/HabitProvider";
import { useReplicacheFromContext } from "@/context/ReplicacheProvider";
import { cn } from "@/utils/misc";
import streakRanges from "@/utils/streakRanges";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

export default function HabitPage({ params }: { params: { id: string } }) {
  const habitId = `habit/${params.id}`;

  return (
    <div>
      <AppBackButton />
      <HabitProvider habitId={habitId}>
        <Content paramsId={habitId} />
      </HabitProvider>
    </div>
  );
}

function Content({ paramsId }: { paramsId: string }) {
  const router = useRouter();
  const { completedDates, habitData, habitId, markDate, deleteHabit } =
    useHabit();
  if (!habitData || habitData.id != paramsId)
    return <div>Habits doesn't exist : /</div>;

  console.log(completedDates, Object.values(completedDates).length);
  function handleDeleteHabit() {
    deleteHabit();
    router.push("/web");
  }

  // return ;

  return (
    <div className="max-w-screen-sm w-full mx-auto">
      <div className="max-w-fit w-full mx-auto">
        <div className="max-w-[350px] w-full mx-auto">
          <div className="flex justify-between items-center ">
            <div
              className="border-l-2 pl-2"
              style={{
                borderColor: habitData?.color,
              }}
            >
              {habitData.name}
            </div>
            <div className="flex gap-2 items-center">
              <Link
                className={buttonVariants({
                  variant: "ghost",
                  size: "icon",
                })}
                href={`/edit/${habitId.replace("habit/", "")}`}
              >
                <Pencil1Icon className="h-4 w-4" />
              </Link>
              <Button variant="ghost" size="icon" onClick={handleDeleteHabit}>
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="my-5">
            <MonthlyCalendar />
          </div>
          <Streaks />
        </div>
        {/* <div>
          <h2 className="text-center font-bold text-lg tracking-wide">
            Completion Rate
          </h2>
          <ChartWrapper color={habitData.color} />
        </div> */}
      </div>
    </div>
  );
}

function Streaks() {
  const { completedDates } = useHabit();
  const {
    habitData: { color },
  } = useHabit();
  const ranges = useMemo(() => {
    function getTop5RangesPercentages(
      ranges: ReturnType<typeof streakRanges>
    ): number[] {
      const totalSum = ranges.reduce((sum, range) => sum + range.duration, 0);
      const percentages = ranges.map(
        (range) => (range.duration / totalSum) * 100
      );
      return percentages;
    }

    const ranges = streakRanges(
      Object.keys(completedDates) as unknown as Date[]
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
    <div>
      <h2 className="text-xl text-center mb-5">Streaks</h2>
      <div className="flex flex-col items-center justify-center gap-2 max-w-[400px] ">
        {ranges.map((item, index) => (
          <div key={index} className="flex-1 w-full flex justify-center gap-2 ">
            <span className="whitespace-nowrap text-xs flex items-center">
              {dayjs(new Date(item.start)).format("MMM DD")}
            </span>
            <div
              className={cn(
                "rounded-[10px_0/100px_20px] yellow text-center justify-center px-1 min-w-fit py-[0.1rem] transition-width duration-1000 ease-in-out"
              )}
              style={{
                width: `${item.percentage}%`,
                ...convertHexToRGBA(color),
              }}
            >
              <span className="mx-1 block">{item.duration}</span>
            </div>
            <span className="whitespace-nowrap text-xs flex items-center">
              {dayjs(new Date(item.end ? item.end : item.start)).format(
                "MMM DD"
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
