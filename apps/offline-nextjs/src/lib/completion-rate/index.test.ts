import { completionRate } from "@/lib/completion-rate";
import { describe, expect, it } from "vitest";

// ! TODO: redo the whole test;
describe("completion rate", () => {
	it("test", () => {
		const dates = [
			"2024-11-01",
			"2024-11-06",
			"2024-11-05",
			"2024-11-04",
			"2024-10-31",
			"2024-10-30",
			"2024-10-29",
			"2024-10-28",
		];
		const frequency = [false, true, true, true, true, true, false];
		expect(completionRate(dates, frequency)).toBe("100%");
	});
	it("should return 0% for no dates", () => {
		expect(completionRate([])).toBe("0%");
	});

	// it("should handle when all dates are inactive", () => {
	// 	const today = dayjs().startOf("day");
	// 	const dates = [
	// 		today,
	// 		today.subtract(1, "day"),
	// 		today.subtract(3, "day"),
	// 		today.subtract(4, "day"),
	// 	];
	// 	expect(
	// 		completionRate(dates, [true, true, true, true, true, true, true], true),
	// 	).toBe("80%");
	// });
});
