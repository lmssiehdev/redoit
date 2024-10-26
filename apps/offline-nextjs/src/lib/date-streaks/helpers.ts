import dayjs, { type Dayjs } from "dayjs";

export type ValidDate = string | number | Date | Dayjs;

export const startOfDay = (date: ValidDate) =>
	dayjs(date).startOf("day").toDate();
export const subDays = (date: ValidDate, value: number) =>
	dayjs(date).subtract(value, "day").toDate();
export const addDays = (date: ValidDate, value: number) =>
	dayjs(date).add(value, "day").toDate();
export const isValid = (date: ValidDate) => dayjs(date).isValid();
export const endOfWeek = (date: ValidDate) => dayjs(date).endOf("week");

export const relativeDates = () => ({
	today: startOfDay(new Date()),
	yesterday: startOfDay(subDays(new Date(), 1)),
	tomorrow: startOfDay(addDays(new Date(), 1)),
});

export const filterInvalidDates = (dates: ValidDate[]): Dayjs[] =>
	dates
		.map((date) => dayjs(date))
		.filter((date) => (!isValid(date) ? false : date));

export const sortDates = (dates: Dayjs[]) => {
	return dates
		.sort((a, b) => startOfDay(b).getTime() - startOfDay(a).getTime())
		.reverse();
};

export function differenceInDays(endDate: ValidDate, startDate: ValidDate) {
	return dayjs(endDate).diff(dayjs(startDate), "day");
}
