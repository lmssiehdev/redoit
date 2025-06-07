import { DEFAULT_HABIT_COLOR } from "@/constants";
import { normalizeDate } from "@/lib/day";
import { generateId } from "@/lib/utils";
import { type HabitData, Status } from "@/types";
import { arrayMove } from "@dnd-kit/sortable";
import posthog from "posthog-js";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

type State = {
	data: Record<string, HabitData>;
	orderedData: string[];
};

export type Actions = {
	addHabit: (payload: Pick<HabitData, "name" | "color">) => void;
	updateHabitData: ({
		id,
		payload,
	}: {
		id: string;
		payload: Pick<HabitData, "name" | "color" | "isArchived">;
	}) => void;
	deleteHabit: (id: string) => void;
	markHabit: (payload: {
		id: string;
		date: string;
		status?: Status;
	}) => void;
	archiveHabit: (id: string, archived?: boolean) => void;
	reorderHabit: ({
		activeId,
		overId,
	}: { overId: string; activeId: string }) => void;
};

export const useHabitsStore = create<State & Actions>()(
	immer(
		persist(
			(set) => ({
				data: {},
				orderedData: [] as string[],
				addHabit: (payload) => {
					const id = generateId(10);
					const newHabit: HabitData = {
						id,
						createdAt: normalizeDate(new Date()),
						isArchived: false,
						dates: {},
						// @ts-expect-error typescript being annoying
						color: DEFAULT_HABIT_COLOR,
						// @ts-expect-error typescript being annoying
						name: "DEFAULT_NAME",
						frequency: Array.from({ length: 7 }, () => true),
						...payload,
					};
					return set((state) => {
						state.data[id] = newHabit;
						state.orderedData.push(newHabit.id);
					});
				},
				updateHabitData: ({ id, payload }) => {
					set((state) => {
						const habit = state.data[id];
						Object.assign(habit, payload);
					});
				},
				archiveHabit: (id, archived) => {
					set((state) => {
						if (archived !== undefined) {
							state.data[id].isArchived = archived;
							return;
						}
						state.data[id].isArchived = !state.data[id].isArchived;
					});
				},
				deleteHabit: (id) => {
					posthog.capture("delete_habit");
					return set((state) => {
						delete state.data[id];
						state.orderedData = state.orderedData.filter(
							(habitId) => habitId !== id,
						);
					});
				},
				markHabit: ({ id, date }) => {
					set((state) => {
						const habit = state.data[id];
						const status = habit.dates[date];

						if (status === undefined) {
							habit.dates[date] = Status.Completed;
							return;
						}

						switch (status) {
							case Status.Completed: {
								habit.dates[date] = Status.Skipped;
								break;
							}
							case Status.Skipped: {
								delete habit.dates[date];
								break;
							}
						}
					});
				},
				reorderHabit: ({ activeId, overId }) =>
					set((state) => {
						const oldIndex = state.orderedData.indexOf(activeId);
						const newIndex = state.orderedData.indexOf(overId);
						state.orderedData = arrayMove(
							state.orderedData,
							oldIndex,
							newIndex,
						);
					}),
			}),
			{
				name: "habits",
			},
		),
	),
);
