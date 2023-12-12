export namespace Habit {
  export type Status = "checked" | "skipped";

  export interface Definition {
    id: string;
    name: string;
    frequency: boolean[];
    completedDates: {
      [date: string]: Status;
    };
    color: string;
    archived: boolean;
  }
}

export const HABIT_TEMPLATE = {
  id: "DEFAULT_HABIT_ID",
  name: "DEFAULT_HABIT_NAME",
  frequency: new Array(7).fill(true),
  completedDates: {},
  color: "#EF726E",
  archived: false,
} as Habit.Definition;
