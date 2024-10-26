import summary from "@/lib/date-streaks";
import { addDays, startOfDay, subDays } from "@/lib/date-streaks/helpers";
import dayjs from "dayjs";
import { describe, expect, it } from "vitest";

describe("Date Streaks", () => {
	describe("Summary", () => {
		it("should report a summary of streaks", () => {
			const today = startOfDay(new Date());
			const result = summary([
				new Date(today),
				new Date("01/01/2018"),
				new Date("01/02/2018"),
				new Date("01/03/2018"),
			]);

			expect(result.currentStreak).to.equal(1);
			expect(result.longestStreak).to.equal(3);
			expect(result.streaks[0]).to.equal(3);
			expect(result.streaks[1]).to.equal(1);
			expect(result.todayInStreak).to.equal(true);
			expect(result.withinCurrentStreak).to.equal(true);
		});

		it("should report withinCurrentStreak when yesterday is true", () => {
			const today = startOfDay(new Date());
			const yesterday = subDays(today, 1);
			const result = summary([yesterday]);
			expect(result.currentStreak).to.equal(1);
			expect(result.longestStreak).to.equal(1);
			expect(result.todayInStreak).to.equal(false);
			expect(result.withinCurrentStreak).to.equal(true);
		});

		it("should report withinCurrentStreak when tomorrow is true", () => {
			const today = startOfDay(new Date());
			const tomorrow = addDays(today, 1);
			const yesterday = subDays(today, 1);
			const result = summary([yesterday, today, tomorrow]);
			expect(result.currentStreak).to.equal(3);
			expect(result.longestStreak).to.equal(3);
			expect(result.todayInStreak).to.equal(true);
			expect(result.withinCurrentStreak).to.equal(true);
		});

		it("should report withinCurrentStreak when future unconnected dates are reported", () => {
			const today = startOfDay(new Date());
			const futureDate = addDays(today, 3);
			const yesterday = subDays(today, 1);
			const result = summary([yesterday, today, futureDate]);
			expect(result.currentStreak).to.equal(1);
			expect(result.longestStreak).to.equal(2);
			expect(result.todayInStreak).to.equal(true);
			expect(result.withinCurrentStreak).to.equal(true);
		});

		it("should report todayInStreak false", () => {
			const today = startOfDay(new Date());
			const futureDate = addDays(today, 3);
			const yesterday = subDays(today, 1);
			const result = summary([yesterday, futureDate]);
			expect(result.currentStreak).to.equal(1);
			expect(result.longestStreak).to.equal(1);
			expect(result.todayInStreak).to.equal(false);
			expect(result.withinCurrentStreak).to.equal(true);
		});

		it("should report withinCurrentStreak false", () => {
			const today = startOfDay(new Date());
			const dateInPast = subDays(today, 3);
			const result = summary([dateInPast]);
			expect(result.currentStreak).to.equal(0);
			expect(result.longestStreak).to.equal(1);
			expect(result.todayInStreak).to.equal(false);
			expect(result.withinCurrentStreak).to.equal(false);
		});

		it("should report a streak of zero", () => {
			const result = summary([]);
			expect(result.currentStreak).to.equal(0);
			expect(result.longestStreak).to.equal(0);
			expect(result.streaks[0]).to.equal(1);
			expect(result.todayInStreak).to.equal(false);
			expect(result.withinCurrentStreak).to.equal(false);
		});

		it("should report a streak longer than 10 days", () => {
			const longStreak = summary([
				new Date("08/19/2018"),
				new Date("08/18/2018"),
				new Date("08/17/2018"),
				new Date("08/16/2018"),
				new Date("08/15/2018"),
				new Date("08/14/2018"),
				new Date("08/13/2018"),
				new Date("08/12/2018"),
				new Date("08/11/2018"),
				new Date("08/10/2018"),
				new Date("08/09/2018"),
			]);
			expect(longStreak.longestStreak).to.equal(11);
		});

		it("should report correct streak summary with unordered dates", () => {
			const longStreak = summary([
				new Date("08/19/2018"),
				new Date("08/10/2018"),
				new Date("08/17/2018"),
				new Date("08/18/2018"),
				new Date("08/15/2018"),
				new Date("08/14/2018"),
				new Date("08/16/2018"),
				new Date("08/12/2018"),
				new Date("08/13/2018"),
				new Date("08/11/2018"),
				new Date("08/09/2018"),
			]);

			expect(longStreak.longestStreak).to.equal(11);
		});

		it("should accept an array as input", () => {
			const longStreak = summary([
				new Date("08/19/2018"),
				new Date("08/10/2018"),
				new Date("08/17/2018"),
				new Date("08/18/2018"),
				new Date("08/15/2018"),
				new Date("08/14/2018"),
				new Date("08/16/2018"),
				new Date("08/12/2018"),
				new Date("08/13/2018"),
				new Date("08/11/2018"),
				new Date("08/09/2018"),
			]);

			expect(longStreak.longestStreak).to.equal(11);
		});

		it("should not break streak if the previous day is inactive", () => {
			let frequencey = Array.from({ length: 7 }, () => true);
			const inactiveDayIdx = dayjs(new Date("08/14/2018")).day();
			frequencey[inactiveDayIdx] = false;
			const longStreak = summary(
				[
					new Date("08/19/2018"),
					new Date("08/18/2018"),
					new Date("08/17/2018"),
					new Date("08/16/2018"),
					new Date("08/15/2018"),
					new Date("08/13/2018"),
					new Date("08/12/2018"),
					new Date("08/11/2018"),
					new Date("08/10/2018"),
					new Date("08/09/2018"),
				],
				frequencey,
			);
			expect(longStreak.longestStreak).to.equal(10);
			frequencey = Array.from({ length: 7 }, () => true);
			frequencey[dayjs(new Date("08/14/2018")).day()] = false;
			frequencey[dayjs(new Date("08/17/2018")).day()] = false;
			frequencey[dayjs(new Date("08/15/2018")).day()] = false;
			const longStreak2 = summary(
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
				frequencey,
				true,
			);
			expect(longStreak2.longestStreak).to.equal(8);
		});
	});
});

// describe("Streak Ranges", () => {
// 	it("should report ranges of streaks", () => {
// 		const result = streakRanges({
// 			dates: [
// 				new Date("01/01/2018"),
// 				new Date("01/02/2018"),
// 				new Date("01/04/2018"),
// 			],
// 			streaks: [2, 1],
// 		});

// 		expect(result[0].start.getTime()).to.equal(
// 			new Date("01/04/2018").getTime(),
// 		);
// 		expect(result[0].end).to.equal(null);
// 		expect(result[0].duration).to.equal(1);
// 		expect(result[1].start.getTime()).to.equal(
// 			new Date("01/01/2018").getTime(),
// 		);
// 		expect(result[1].end.getTime()).to.equal(
// 			new Date("01/02/2018").getTime(),
// 		);
// 		expect(result[1].duration).to.equal(2);
// 	});
// });
