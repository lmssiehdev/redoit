import dayjs, { type Dayjs } from "dayjs";
import { describe, expect, it } from "vitest";
import { calculateStreaks } from "./index";

describe("edge cases", () => {
	it("should return an empty array when no dates are provided", () => {
		const dates: Date[] = [];
		const result = calculateStreaks({ dates });
		expect(result.streaks).toEqual([]);
		expect(result.longestStreak).toEqual(0);
		expect(result.currentStreak).toEqual(0);
	});
	it("should work with sorted and continuous dates", () => {
		const dates = [
			new Date("2023-01-01"),
			new Date("2023-01-02"),
			new Date("2023-01-03"),
			new Date("2023-01-04"),
			new Date("2023-01-05"),
			new Date("2023-01-06"),
			new Date("2023-01-07"),
			new Date("2023-01-08"),
			new Date("2023-01-09"),
			new Date("2023-01-10"),
		];

		const result = calculateStreaks({ dates });
		expect(result.streaks).toEqual([10]);
		expect(result.longestStreak).toEqual(10);
		expect(result.currentStreak).toEqual(0);
	});
	it("should work with unsorted dates", () => {
		const dates = [
			new Date("2023-01-04"),
			new Date("2023-01-02"),
			new Date("2023-01-01"),
			new Date("2023-01-05"),
			new Date("2023-01-03"),
		];
		const result = calculateStreaks({ dates });
		expect(result.streaks).toEqual([5]);
	});

	it("should work with one date", () => {
		const dates = [new Date("2023-01-04")];
		const result = calculateStreaks({ dates });
		expect(result.streaks).toEqual([1]);
	});

	it("should work with gaps in between dates", () => {
		const dates = [
			new Date("2023-01-01"),
			new Date("2023-01-02"),
			new Date("2023-01-03"),
			// gap
			new Date("2023-01-05"),
			new Date("2023-01-06"),
			// gap
			new Date("2023-01-08"),
			new Date("2023-01-09"),
		];
		const result = calculateStreaks({ dates });
		expect(result.streaks).toEqual([3, 2, 2]);
	});

	it("should work with custom skip day", () => {
		// a month array where 2 mondays are missing
		const dates = generateDates({
			count: 30,
			daysToNotInclude: (date) => date.day() === 1,
		});

		const result = calculateStreaks({
			dates,
			enableLog: true,
			shouldSkipDay: ({ tomorrow }) => {
				// we do not lose a new streak on mondays
				return dayjs(tomorrow).day() === 1;
			},
		});
		expect(result.streaks).toEqual([26]);
	});

	// TODO: think of more edge cases
	it("should work with multiple skipped days", () => {
		const freq = [true, true, false, false, true, true, true];
		const generatedDates = [
			...generateDates({
				startDate: dayjs("2025-01-01"),
				count: 30,
				daysToNotInclude: (date) => !freq[date.day()],
			}),
			new Date("2025-04-01"),
			...generateDates({
				startDate: dayjs("2025-03-01"),
				count: 15,
				daysToNotInclude: () => false,
			}),
		];

		const result = calculateStreaks({
			dates: generatedDates,
			enableLog: true,
			shouldSkipDay: ({ tomorrow }) => {
				// we do not break streak on days that are in freq
				return !freq[tomorrow.day()];
			},
		});
		expect(result.longestStreak).toEqual(21);
		expect(result.currentStreak).toEqual(0);
		expect(result.streaks).toEqual([21, 15, 1]);
	});

	it("returns correct currentStreak with today", () => {
		const today = dayjs().startOf("day");
		const result = calculateStreaks({
			dates: [
				today.toDate(),
				new Date("08/18/2024"),
				new Date("08/17/2024"),
				new Date("08/16/2024"),
				new Date("08/15/2024"),
			],
		});
		expect(result.streaks).toEqual([4, 1]);
		expect(result.currentStreak).toEqual(1);
		expect(result.longestStreak).toEqual(4);
	});
});

/*
    helper function to generate random dates
*/
function generateDates({
	count,
	daysToNotInclude,
	startDate = dayjs().startOf("day"),
}: {
	count: number;
	daysToNotInclude: (date: Dayjs) => boolean;
	startDate?: Dayjs;
}): Date[] {
	const days = Math.min(count, 1000);
	const dates: Date[] = [];
	for (let i = 0; i < days; i++) {
		const date = startDate.add(i, "day");
		if (daysToNotInclude(date)) continue;
		dates.push(date.toDate());
	}
	return dates;

	function getRandomDateThisYear() {
		const startOfYear = dayjs().startOf("year");
		const endOfYear = dayjs().endOf("year");

		const randomTime =
			startOfYear.valueOf() +
			Math.random() * (endOfYear.valueOf() - startOfYear.valueOf());

		return dayjs(randomTime);
	}
}
