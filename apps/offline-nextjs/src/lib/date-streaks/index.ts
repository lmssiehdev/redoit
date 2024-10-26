import {
	type ValidDate,
	differenceInDays,
	filterInvalidDates,
	relativeDates,
	sortDates,
} from "@/lib/date-streaks/helpers";

export function summary(
	datesInput: ValidDate[],
	frequency?: boolean[],
	debug = false,
) {
	const validDates = filterInvalidDates(datesInput);
	const dates = sortDates(validDates);

	const result = {
		streaks: [1],
		longestStreak: 0,
		currentStreak: 0,
		isToday: false,
		isTomorrow: false,
		isYesterday: false,
		isInFuture: false,
	};

	for (let i = 0; i < dates.length; i++) {
		const currentDate = dates[i];
		const nextDate = dates[i + 1] ? dates[i + 1] : currentDate;

		const diff = differenceInDays(nextDate, currentDate);

		const { today, yesterday } = relativeDates();
		const isToday =
			result.isToday || differenceInDays(currentDate, today) === 0;
		const isYesterday =
			result.isYesterday || differenceInDays(currentDate, yesterday) === 0;
		const isInFuture =
			result.isInFuture || differenceInDays(today, currentDate) < 0;

		if (diff === 0) {
		} else {
			if (diff === 1) {
				++result.streaks[result.streaks.length - 1];
			} else {
				// diff is more than a week, so we can safely assume there
				// is no inactive dates that we should account for

				if (debug) {
					console.log({ diff });
				}
				if (diff > 7 || !frequency) {
					result.streaks.push(1);
				} else {
					const daysTillNextDate = Array.from({ length: diff }, (_, i) =>
						currentDate.add(i, "day"),
					);
					const inactiveDays = daysTillNextDate
						.map((date) => frequency[date.day()])
						.filter((isActive) => isActive === false).length;

					// @HACKY:
					if (inactiveDays + 1 === diff) {
						++result.streaks[result.streaks.length - 1];
					} else {
						result.streaks.push(1);
					}
				}
			}
		}

		result.longestStreak = Math.max(
			result.longestStreak,
			result.streaks[result.streaks.length - 1],
		);
		result.currentStreak =
			isToday || isYesterday || isInFuture
				? result.streaks[result.streaks.length - 1]
				: 0;
	}

	const { isInFuture, isToday, isTomorrow, ...rest } = result;
	return rest;
}
