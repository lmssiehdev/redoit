import dayjs, { type Dayjs } from "dayjs";

import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localizedFormat from "dayjs/plugin/localizedFormat";
import quarterOfYear from "dayjs/plugin/quarterOfYear";

dayjs.extend(localizedFormat);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(quarterOfYear);

export { dayjs, type Dayjs };

type DateInput = string | number | Date | Dayjs | null | undefined;

/**
 * Normalizes a given date input into a standardized "YYYY-MM-DD" string format.
 */
export function normalizeDate(date: DateInput) {
	return dayjs(date).format("YYYY-MM-DD");
}

export const startOfDay = (date: Date | Dayjs) => dayjs(date).startOf("day").toDate();

export const sortDates = (dates: Date[]) =>
	dates.sort((a, b) => startOfDay(a).getTime() - startOfDay(b).getTime());

export const differenceInDays = (later: Date, earlier: Date) => {
	const date = dayjs(later);
	return date.diff(earlier, "day");
};
