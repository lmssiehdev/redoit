import { completionRate } from "@/lib/completion-rate";
import { subDays } from "@/lib/date-streaks/helpers";
import { startOfDay } from "@/lib/day";
import { describe, expect, it } from "vitest";

describe("completion rate", () => {
  it ("test", () => {
    const dates = [
      "2024-11-01",
      "2024-11-06",
      "2024-11-05",
      "2024-11-04",
      "2024-10-31",
      "2024-10-30",
      "2024-10-29",
      "2024-10-28"
    ]
    const frequency = [false, true, true, true, true, true, false];
    expect(completionRate(dates, frequency)).toBe("100%")
  })
  it("should return 0% for no dates", () => {
    expect(completionRate([])).toBe("0%");
  });
  
  // it("should completion rate correctly", () => {
  //   const today = startOfDay(new Date());
  //   const twoWeeks = Array.from({ length: 7 * 2 }, (_, i ) =>  subDays(today, i + 1)).concat([today]);
  
  //   expect(completionRate(twoWeeks)).toBe("100%")
  // });
  
  // it("should ignore inactive dates", () => {
  //   const today = startOfDay(new Date());
  //   const twoWeeks = Array.from({ length: 7 * 2 }, (_, i ) =>  subDays(today, i + 1)).concat([today]);
  //   const frequency = [false, true, true, true, true, true, false];
  
  //   expect(completionRate(twoWeeks)).toBe("100%")
  //   expect(completionRate(twoWeeks, frequency)).toBe("100%")
  // })
  
  it("should handle when all dates are inactive", () => {
    const today = startOfDay(new Date());
    const dates = [
      today,
      subDays(today, 1),
      subDays(today, 3),
      subDays(today, 4),      
    ];
    // expect(completionRate(dates, [false, false, false, false, false, false, false])).toBe("100%")
    expect(completionRate(dates, [true, true, true, true, true, true, true], true)).toBe("80%")
  })
  
  // it("should handle a single gap in dates", () => {
  //   const today = startOfDay(new Date());
  //   const dates = [
  //     today,
  //     subDays(today, 2),
  //     subDays(today, 3),
  //   ];
  //   expect(completionRate(dates)).toBe("75%")
  // })
  
  // it("should handle a gap in dates", () => {
  //   const today = startOfDay(new Date());
  //   const dates = [
  //     today,
  //     subDays(today, 1),
  //     subDays(today, 2),
  //     subDays(today, 3),
  //     subDays(today, 10),
  //     subDays(today, 11),
  //     subDays(today, 12),
  //   ];
  //   const frequency = [false, false, false, false, true, true, false];
  
  //   expect(completionRate(dates)).toBe("54%")
  //   expect(completionRate(dates, frequency)).toBe("54%")
  // })
  
})
