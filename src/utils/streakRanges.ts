import { summary } from "@/utils/calculateStreak";
import dayjs from "dayjs";

export const startOfDay = (date: Date) => dayjs(date).startOf("day").toDate();

export const sortDates = (dates: Date[]) => {
  return dates
    .sort(function (a, b) {
      // @ts-expect-error
      return startOfDay(b) - startOfDay(a);
    })
    .reverse();
};

export function streakRanges(dates: Date[]) {
  if (dates.length === 0) {
    return [];
  }

  const { streaks = [] } = summary(dates);
  const allDates = [...sortDates(dates)];

  return streaks
    .reduce(
      (acc, streak) => {
        let start, end;
        let days = allDates.slice(0, streak);
        allDates.splice(0, streak);

        if (days && days.length > 1) {
          start = new Date(days[0]!);
          end = new Date(days[days.length - 1]!);
        } else {
          start = new Date(days[0]!);
          end = null;
        }

        return [
          ...acc,
          {
            start,
            end,
            duration: streak,
          },
        ];
      },
      [] as Array<{
        start: Date;
        end: Date | null;
        duration: number;
      }>
    )
    .reverse();
}

export default streakRanges;
