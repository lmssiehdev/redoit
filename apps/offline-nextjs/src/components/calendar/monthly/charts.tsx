"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { DAYS } from "@/constants";
import { LightenDarkenColor, convertHex, lightOrDark } from "@/lib/utils";
import { useHabit } from "@/app/habit/[id]/page";
import { type HabitData, Status } from "@/types";
import dayjs from "dayjs";
import { Bar, BarChart, ResponsiveContainer, XAxis } from "recharts";

const chartData = (dates: HabitData["dates"]) => {
  const rate = Array.from({ length: 7 }, () => ({
    [Status.Skipped]: 0,
    [Status.Completed]: 0,
  }));

  Object.entries(dates).map(
    ([date, status]) => rate[dayjs(date).day()][status]++
  );

  return DAYS.map((date, index) => ({
    date,
    completed: rate[index][Status.Completed],
    skipped: rate[index][Status.Skipped],
  }));
};

export const description = "A stacked bar chart with a legend";

const chartConfig = (color: string) => {
  const isLightColor = lightOrDark(color) === "light";

  return {
    activities: {
      label: "Activities",
    },
    completed: {
      label: "Completed",
      color: convertHex(
        LightenDarkenColor(color, isLightColor ? 50 : 10),
        isLightColor ? 0.8 : 0.6
      ),
    },
    skipped: {
      label: "Skipped",
      color: convertHex(
        LightenDarkenColor(color, isLightColor ? -50 : 40),
        isLightColor ? 0.8 : 0.6
      ),
    },
  } satisfies ChartConfig;
};

export function WeekChart() {
  const {
    habitData: { color, dates },
  } = useHabit();

  return (
    <>
      <ChartContainer config={chartConfig(color)}>
        <BarChart accessibilityLayer data={chartData(dates)}>
          <XAxis
            dataKey="date"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value: string) => value.substring(0, 3)}
          />
          <Bar
            dataKey="completed"
            stackId="a"
            fill="var(--color-completed)"
            radius={[0, 0, 4, 4]}
          />
          <Bar
            dataKey="skipped"
            stackId="a"
            fill="var(--color-skipped)"
            radius={[4, 4, 0, 0]}
          />
          <ChartTooltip
            content={
              <ChartTooltipContent labelKey="activities" indicator="line" />
            }
            cursor={false}
            // defaultIndex={1}
          />
        </BarChart>
      </ChartContainer>
    </>
  );
}
