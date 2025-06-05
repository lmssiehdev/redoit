import dayjs from "dayjs";
import { sortDates, calculateStreaks as summary } from "@/lib/streaks/index";

type StreakRange = {
	start: Date;
	end: Date | null;
	duration: number;
};

export function streakRanges(dates: (string | Date)[]) {
	if (dates.length === 0) {
		return [];
	}

	const { streaks } = summary({ dates: dates.map((date) => dayjs(date).toDate()) });
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
			// biome-ignore lint/performance/noAccumulatingSpread: should be okay
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
