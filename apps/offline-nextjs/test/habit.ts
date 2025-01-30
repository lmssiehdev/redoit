import { Habit } from "./../schema/habit";
import { create } from "node:domain";
import { z } from "zod";
import { HabitType } from "../schema/habit";
export type Habit = {
  id: string;
  name: string;
  color: string;
  archived: boolean;
  /**
   * a boolean array of days of the week
   * false means the habit isn't tracked on that day
   * we shouldn't use that to break the streak
   */
  frequency: boolean[];
  createdAt: string;
  question: string;
  notes?: string;
  reminder: string;
  dates: {
    [key: string]: {
      isSkipped: boolean;
      exactDate: string;
      maxGoal: number;
      currentGoal: number;
    };
  };
};



const CONSTANTS = {
  defaultColor: "#000000",
};

export const DEFAULT_HABIT = {
  name: "New Habit",
  color: CONSTANTS.defaultColor,
  archived: false,
  frequency: createFrequencyArray(),
  createdAt: new Date().toISOString(),
};

export function createFrequencyArray(fill = true): boolean[] {
  return Array.from({ length: 7 }, () => fill);
}

export const CreateHabitWithDefaultValus = z.object({
  name: z.string().min(1),
  color: z.string().min(3).catch(CONSTANTS.defaultColor),
  archived: z.boolean().catch(false),
  frequency: z.array(z.boolean()).length(7).catch(createFrequencyArray()),
  // question: z.string().min(1).catch(""),
  // notes: z.string().min(1).optional().catch(""),
  // unit: z.string().min(1).optional().catch(""),
  // target: z.number().min(1).optional().catch(0),
});
