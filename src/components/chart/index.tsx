import { useHabit } from "@/context/HabitProvider";
import { nanoid } from "nanoid";
import { useMemo, useState } from "react";
import { StackedBar } from "react-roughviz";

const ChartWrapper = ({
  color,
}: // dates,
{
  color: string;
  // dates: {
  // [key: string]: string;
  // };
}) => {
  const { completedDates: dates } = useHabit();
  const normalizedData = useMemo(() => {
    function calculateDates(dates: { [key: string]: string }) {
      let data = [
        { x: "Sun", y: 1, day: 0 },
        { x: "Mon", y: 1, day: 1 },
        { x: "Tue", y: 1, day: 2 },
        { x: "Wed", y: 1, day: 3 },
        { x: "Thu", y: 1, day: 4 },
        { x: "Fri", y: 1, day: 5 },
        { x: "Sat", y: 1, day: 6 },
      ];

      Object.keys(dates).forEach((date) => {
        const day = new Date(date).getDay();
        if (data[day]) {
          const index = data.findIndex((item) => item.day === day);
          data[index].y++;
          return;
        }
        data[day].y = 1;
      });
      return data;
    }

    const data = calculateDates(dates);
    const maxCompletionCount = Math.max(...data.map((d) => d.y));
    const minCompletionCount = Math.min(...data.map((d) => d.y));
    const range = maxCompletionCount - minCompletionCount;

    const normalizedData = data.map((d) => ({
      day: d.x,
      completed: d.y ?? ((d.y - minCompletionCount) / range) * 100,
      skipped: 2,
    }));
    return normalizedData;
  }, [dates]);

  const setOpacity = (hex: string, alpha: number) =>
    `${hex}${Math.floor(alpha * 255)
      .toString(16)
      .padStart(2, "0")}`;
  return (
    <div>
      <StackedBar
        width="400"
        data={normalizedData}
        labels="day"
        fillStyle={["zigzag"][0]}
        roughness={2}
        // title="Monthly Revenue"
        highlight={setOpacity(color, 0.8)}
        yLabel={null}
        colors={[color, color, setOpacity(color, 0.6), "skyblue"]}
        margin={{
          top: 20,
          left: 20,
          right: 0,
          bottom: 40,
        }}
      />
    </div>
  );
};

export default ChartWrapper;
