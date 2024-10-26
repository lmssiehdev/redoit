import dayjs from "dayjs";
import { type ValidDate, sortDates } from "./helpers";
import { summary } from "./index";

type StreakRange = {
	start: Date;
	end: Date | null;
	duration: number;
};

export function streakRanges(dates: ValidDate[]) {
	if (dates.length === 0) {
		return [];
	}

	const { streaks = [] } = summary(dates);
	const allDates = [...sortDates(dates.map((date) => dayjs(date)))];

	const result = streaks.reduce((acc, streak) => {
		let start: Date;
		let end: Date | null;
		const days = allDates.slice(0, streak);
		allDates.splice(0, streak);

		if (days && days.length > 1) {
			start = days[0].toDate();
			end = days[days.length - 1].toDate();
		} else {
			start = days[0].toDate();
			end = null;
		}

		return [
			...acc,
			{
				start,
				end,
				duration: streak,
			},
		] satisfies StreakRange[];
	}, [] as StreakRange[]);
	return result.reverse();
}

export default streakRanges;
