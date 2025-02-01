import { startOfDay } from "@/lib/day";
import dayjs, { type Dayjs } from "dayjs";

export type ValidDate = string | number | Date | Dayjs;

export function dateToHabitKey(date: string | Dayjs): string {
	return dayjs(date).format("YYYY-MM-DD");
}

export const sortDates = (dates: Dayjs[]) => {
	return dates
		.sort((a, b) => startOfDay(b).getTime() - startOfDay(a).getTime())
		.reverse();
};

export function getDatesInBetween(start: Dayjs, end: Dayjs): Dayjs[] {
	if (start.isAfter(end)) {
		throw new Error("Start date must be before or equal to end date");
	}

	const dates: Dayjs[] = [];
	const maxDays = 1000;

	let current = start.clone();
	while (!current.isAfter(end)) {
		dates.push(current);
		current = current.add(1, "day");

		if (dates.length >= maxDays) {
			throw new Error(`Maximum number of days (${maxDays}) exceeded`);
		}
	}

	return dates;
}

/**
 * Normalizes a date to a consistent string format.
 */
export function normalizeDate(date: Dayjs): string {
	return date.format("YYYY-MM-DD");
}

export const dateUtils = {
	startOfDay(date: ValidDate) {
		return dayjs(date).startOf("day").toDate();
	},
	sortDate(dates: Dayjs[]) {
		return dates
			.sort(
				(a, b) =>
					dateUtils.startOfDay(b).getTime() - dateUtils.startOfDay(a).getTime(),
			)
			.reverse();
	},
	differenceInDays(startDate: Dayjs, endDate: Dayjs) {
		if (startDate.isAfter(endDate, "day") && !startDate.isSame(endDate)) {
			throw new Error("Start date must be before or equal to end date");
		}
		return endDate.diff(startDate, "day");
	},
	getDateRange(startDate: Dayjs, endDate: Dayjs): Dayjs[] {
		const dates: Dayjs[] = [];
		let currentDate = startDate;

		if (startDate.isAfter(endDate)) {
			throw new Error("Start date must be before or equal to the end date.");
		}

		const diffInDays = endDate.diff(startDate, "day");

		if (diffInDays > 1000) {
			throw new Error(
				"The difference between the start and end dates exceeds 1000 days.",
			);
		}

		while (
			currentDate.isBefore(endDate) ||
			currentDate.isSame(endDate, "day")
		) {
			dates.push(currentDate);
			currentDate = currentDate.add(1, "day");
		}

		return dates;
	},
	isValid(date: Dayjs) {
		return date.isValid();
	},
};
