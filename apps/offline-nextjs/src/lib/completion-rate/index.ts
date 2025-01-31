import { type ValidDate, differenceInDays } from "@/lib/date-streaks/helpers";
import { sortDates } from "@/lib/day";
import dayjs from "dayjs";

export function completionRate(
	dates: ValidDate[],
	frequency?: boolean[],
	debug?: boolean,
) {
	const sortedDates = sortDates(dates.map((d) => dayjs(d).toDate()));

	if (sortedDates.length === 0) return "0%";

	// let firstDate = sortedDates[0];

	// if ( frequency ) {
	//   const activeDates = sortedDates.filter(date => frequency[date.getDay()]);
	//   if (activeDates.length === 0) return "100%";

	//   firstDate = activeDates[0];
	// }

	let completedDays = sortedDates.length;

	for (let i = 0; i < sortedDates.length; i++) {
		const currentDate = dayjs(sortedDates[i]);
		const nextDate = sortedDates[i + 1] ? sortedDates[i + 1] : currentDate;
		const diff = differenceInDays(nextDate, currentDate);

		if (diff < 1) {
			continue;
		}

		// diff is more than a week, or no frequency was provided
		if (diff > 7 || !frequency) {
			completedDays--;
			if (debug) console.log("subtracted from here");
			continue;
		}

		const daysTillNextDate = Array.from({ length: diff }, (_, j) =>
			currentDate.add(j, "day"),
		);
		const inactiveDays = daysTillNextDate
			.map((date) => frequency?.[date.day()] ?? true)
			.filter((isActive) => !isActive).length;

		if (inactiveDays + 1 === diff) {
			continue;
		}
		if (debug) {
			console.log(
				inactiveDays + 1,
				diff,
				currentDate.format("ll"),
				dayjs(nextDate).format("ll"),
				"reached",
			);
		}
		completedDays--;
	}

	if (debug) console.log({ completedDays, total: sortedDates.length });
	return percentage(completedDays, sortedDates.length);
}

export function percentage(partialValue: number, totalValue: number) {
	return `${((100 * partialValue) / totalValue).toFixed()}%`;
}
