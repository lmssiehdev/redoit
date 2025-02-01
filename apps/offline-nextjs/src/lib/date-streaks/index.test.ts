import { summary as summaryRewrite } from "@/lib/date-streaks";
import { subDays } from "@/lib/date-streaks/helpers";
import streakRanges from "@/lib/date-streaks/streakRanges";
import { startOfDay } from "@/lib/day";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

describe("Summary", () => {
	it("handles empty input", () => {
		const result = summaryRewrite([]);
		expect(result.longestStreak).toBe(0);
	});

	it("handles continus streak properly", () => {
		const longStreak = summaryRewrite([
			new Date("08/19/2024"),
			new Date("08/18/2024"),
			new Date("08/17/2024"),
			new Date("08/16/2024"),
			new Date("08/15/2024"),
			new Date("08/14/2024"),
			new Date("08/13/2024"),
			new Date("08/12/2024"),
			new Date("08/11/2024"),
			new Date("08/10/2024"),
			new Date("08/09/2024"),
		]);
		expect(longStreak.longestStreak).to.equal(11);
	});

	it("handles streak breaks properly", () => {
		const result = summaryRewrite([
			new Date("08/15/2024"),
			new Date("08/14/2024"),
			new Date("08/11/2024"),
			new Date("08/10/2024"),
			new Date("08/09/2024"),
		]);
		expect(result.streaks).toStrictEqual([3, 2]);
		expect(result.longestStreak).toBe(3);
	});

	it("should report correct streak summary with unordered dates", () => {
		const result = summaryRewrite([
			new Date("08/19/2024"),
			new Date("08/10/2024"),
			new Date("08/17/2024"),
			new Date("08/18/2024"),
			new Date("08/15/2024"),
			new Date("08/14/2024"),
			new Date("08/16/2024"),
			new Date("08/12/2024"),
			new Date("08/13/2024"),
			new Date("08/11/2024"),
			new Date("08/09/2024"),
		]);

		expect(result.currentStreak).toEqual(0);
		expect(result.longestStreak).to.equal(11);
	});

	it("should not break streak if the previous day is inactive", () => {
		const inactiveDayIdx = dayjs(new Date("08/14/2018")).day();
		const frequency = Array.from({ length: 7 }, () => true);
		frequency[inactiveDayIdx] = false;
		const result = summaryRewrite(
			[
				new Date("08/19/2024"),
				new Date("08/18/2024"),
				new Date("08/17/2024"),
				new Date("08/16/2024"),
				new Date("08/15/2024"),
				new Date("08/13/2024"),
				new Date("08/12/2024"),
				new Date("08/11/2024"),
				new Date("08/10/2024"),
				new Date("08/09/2024"),
			],
			frequency,
		);
		expect(result.streaks).to.toStrictEqual([10]);
		expect(result.longestStreak).to.equal(10);
	});

	it("handles multiple inactive days properly", () => {
		const frequency = Array.from({ length: 7 }, () => true);
		frequency[dayjs(new Date("08/14/2018")).day()] = false;
		frequency[dayjs(new Date("08/17/2018")).day()] = false;
		frequency[dayjs(new Date("08/15/2018")).day()] = false;
		const result = summaryRewrite(
			[
				new Date("08/19/2018"),
				new Date("08/18/2018"),
				new Date("08/16/2018"),
				new Date("08/13/2018"),
				new Date("08/12/2018"),
				new Date("08/11/2018"),
				new Date("08/10/2018"),
				new Date("08/09/2018"),
			],
			frequency,
		);
		expect(result.streaks).toStrictEqual([8]);
		expect(result.longestStreak).toEqual(8);
	});

	it("should handle breaking the streak correctly with frequency array", () => {
		const inactiveDayIdx = dayjs(new Date("08/14/2018")).day();
		const frequency = Array.from({ length: 7 }, () => true);
		frequency[inactiveDayIdx] = false;
		const result = summaryRewrite(
			[
				new Date("08/19/2024"),
				new Date("08/18/2024"),
				new Date("08/17/2024"),
				new Date("08/16/2024"),
				new Date("08/15/2024"),
				new Date("08/13/2024"),
				new Date("08/12/2024"),
				new Date("08/10/2024"),
				new Date("08/09/2024"),
			],
			frequency,
		);
		expect(result.streaks).to.toStrictEqual([2, 7]);
		expect(result.longestStreak).to.equal(7);
	});

	it("should handle breaking the streak correctly with frequency array", () => {
		const inactiveDayIdx = dayjs(new Date("08/14/2018")).day();
		const frequency = Array.from({ length: 7 }, () => true);
		frequency[inactiveDayIdx] = false;
		const result = summaryRewrite(
			[
				new Date("08/19/2024"),
				new Date("08/18/2024"),
				new Date("08/17/2024"),
				new Date("08/16/2024"),
				new Date("08/15/2024"),
				new Date("08/13/2024"),
				new Date("08/12/2024"),
				new Date("08/10/2024"),
				new Date("08/09/2024"),
			],
			frequency,
		);
		expect(result.streaks).toStrictEqual([2, 7]);
		expect(result.longestStreak).toEqual(7);
	});

	it("returns the correct currentStreak", () => {
		const today = startOfDay(new Date());
		const result = summaryRewrite([
			today,
			subDays(today, 1),
			subDays(today, 2),
			subDays(today, 3),
			subDays(today, 4),
		]);
		expect(result.currentStreak).toEqual(5);
		expect(result.longestStreak).toEqual(5);
	});

	it("returns correct currentStreak with today", () => {
		const today = startOfDay(new Date());
		const result = summaryRewrite([
			today,
			new Date("08/18/2024"),
			new Date("08/17/2024"),
			new Date("08/16/2024"),
			new Date("08/15/2024"),
		]);
		expect(result.currentStreak).to.equal(1);
		expect(result.longestStreak).to.equal(4);
	});

	it("returns correct currentStreak with yesterday", () => {
		const today = startOfDay(new Date());
		const yesterday = subDays(today, 1);
		const result = summaryRewrite([
			yesterday,
			new Date("08/18/2024"),
			new Date("08/17/2024"),
			new Date("08/16/2024"),
			new Date("08/15/2024"),
		]);
		expect(result.currentStreak).toEqual(1);
		expect(result.streaks).toStrictEqual([4, 1]);
	});

	it("should handle only one active day", () => {
		const frequency = Array.from({ length: 7 }, () => false);
		frequency[3] = true;
		const result = summaryRewrite(
			[
				"2024-10-03",
				"2024-10-17",
				"2024-10-10",
				"2024-09-26",
				"2024-09-19",
				"2024-09-12",
			],
			frequency,
			true,
		);
		expect(result.streaks).toStrictEqual([6]);
		expect(result.longestStreak).toEqual(6);
	});
});

describe("Streak Ranges", () => {
	it("should report ranges of streaks", () => {
		const result = streakRanges([
			new Date("01/01/2018"),
			new Date("01/02/2018"),
			new Date("01/04/2018"),
		]);

		expect(result[0].start.getTime()).to.equal(
			new Date("01/04/2018").getTime(),
		);
		expect(result[0].end).to.equal(null);
		expect(result[0].duration).to.equal(1);
		expect(result[1].start.getTime()).to.equal(
			new Date("01/01/2018").getTime(),
		);
		expect(result[1].end?.getTime()).to.equal(new Date("01/02/2018").getTime());
		expect(result[1].duration).to.equal(2);
	});
});
