import { DEFAULT_HABIT_COLOR } from "@/constants";
import { normalizeDate } from "@/lib/day";
import { generateId } from "@/lib/utils";
import { arrayMove } from "@dnd-kit/sortable";
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
		status?: HabitStatus;
	}) => void;
	archiveHabit: (id: string, archived?: boolean) => void;
	getHabitData: (id: string) => HabitData;
	reorderHabit: ({
		activeId,
		overId,
	}: { overId: string; activeId: string }) => void;
};

export const useHabitsStore = create<State & Actions>()(
	immer(
		persist(
			(set, get) => ({
				data: {},
				orderedData: [],
				addHabit: (payload) => {
					const id = generateId(10);
					const newHabit: HabitData = {
						id,
						createdAt: normalizeDate(new Date()),
						isArchived: false,
						dates: {},
						color: DEFAULT_HABIT_COLOR,
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

						if (!status) {
							habit.dates[date] = "completed";
							return;
						}

						switch (status) {
							case "completed": {
								habit.dates[date] = "skipped";
								break;
							}
							case "skipped": {
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
				getHabitData: (id) => get().data[id],
			}),
			{
				name: "habits",
			},
		),
	),
);
