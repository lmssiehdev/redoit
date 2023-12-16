import { differenceInDays, summary } from "@/utils/calculateStreak";
import dayjs from "dayjs";
import { useMemo } from "react";

export function useCalculateStreak(
  dates: Record<string, "checked" | "skipped">
) {
  const streaks = useMemo(
    () =>
      summary(
        Object.keys(dates).map((date) => dayjs(date).startOf("day").toDate()),
        (first, last) => {
          const diff = differenceInDays(last, first);
          const formatedDate = dayjs(last).format("YYYY-M-D");

          const result = {
            shouldIncrement: diff === 1 && dates[formatedDate] === "checked",
            shouldSkip: diff !== 1 && diff !== 0,
          };
          return result;
        }
      ),
    [dates]
  );
  return streaks;
}
