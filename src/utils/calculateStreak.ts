import dayjs, { Dayjs } from "dayjs";

export type ValidDate = string | number | Date | Dayjs;

export const startOfDay = (date: ValidDate) =>
  dayjs(date).startOf("day").toDate();
export const subDays = (date: ValidDate, value: number) =>
  dayjs(date).subtract(value, "day").toDate();
export const addDays = (date: ValidDate, value: number) =>
  dayjs(date).add(value, "day").toDate();

export const endOfWeek = (date: ValidDate) => dayjs(date).endOf("week");
export const isValid = (date: ValidDate) => dayjs(date).isValid();

export const relativeDates = () => ({
  today: startOfDay(new Date()),
  yesterday: startOfDay(subDays(new Date(), 1)),
  tomorrow: startOfDay(addDays(new Date(), 1)),
});

export const sortDates = (dates: Date[]) => {
  return dates
    .sort(function (a, b) {
      //! unsafe
      // @ts-expect-error
      return startOfDay(b) - startOfDay(a);
    })
    .reverse();
};

export const differenceInDays = (later: Date, earlier: Date) => {
  const date = dayjs(later);
  return date.diff(earlier, "day");
};

export function summary(
  dateParams: Date[] = [],
  callback?: (...args: any[]) => {
    shouldIncrement: boolean;
    shouldSkip: boolean;
  }
) {
  const { today, yesterday } = relativeDates();
  const sortedDates = sortDates(dateParams);

  const result = sortedDates.reduce(
    (prev, curr, index) => {
      const firstDate = new Date(curr);
      const nextDate = dateParams[index + 1]
        ? new Date(dateParams[index + 1]!)
        : firstDate;

      const isToday = differenceInDays(firstDate, today) === 0;
      const isYesterday = differenceInDays(firstDate, yesterday) === 0;
      const isInFuture = differenceInDays(today, firstDate) < 0;

      const diff = differenceInDays(nextDate, firstDate);

      const currentStreak =
        isToday || isYesterday || isInFuture
          ? prev.streaks[prev.streaks.length - 1]!
          : 0;

      if (typeof callback !== "function") {
        if (diff === 0) {
          // if (isToday) {
          //   prev.todayInStreak = true;
          // }
        } else {
          diff === 1
            ? ++prev.streaks[prev.streaks.length - 1]
            : prev.streaks.push(1);
        }
      } else {
        const { shouldIncrement, shouldSkip } = callback(firstDate, nextDate);

        if (shouldIncrement) ++prev.streaks[prev.streaks.length - 1];
        if (shouldSkip) prev.streaks.push(1);
      }

      return {
        ...prev,
        currentStreak,
        longestStreak: Math.max(...prev.streaks),
        isInFuture,
        isYesterday,
        isToday,
      };
    },
    {
      currentStreak: 0,
      longestStreak: 0,
      streaks: [1],
      isInFuture: false,
      isYesterday: false,
      isToday: false,
      // withinCurrentStreak: false,
      // todayInStreak: false,
    }
  );

  const { isToday, isYesterday, isInFuture, ...rest } = result;

  return rest;
}
