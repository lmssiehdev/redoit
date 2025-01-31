import type { Status } from "@/types";
import { type InstaQLEntity, i, id, init } from "@instantdb/react";
import { z } from "zod";
import type { Habit } from "./habit";

const APP_ID = "80196a01-7753-43df-aab7-837000a2eab5";

const schema = i.schema({
	entities: {
		habits: i.entity({
			id: i.string(), // remove this key
			name: i.string(),
			color: i.string(),
			isArchived: i.boolean(),
			frequency: i.json<boolean[]>(),
			createdAt: i.number(),
			question: i.string(),
			notes: i.string(),
			reminder: i.string(),
			dates: i.json<Record<string, Status>>(),
			_dates: i.json<Habit["dates"]>(),
			order: i.number(),
		}),
	},
});

export type InsertHabitType = InstaQLEntity<typeof schema, "habits">;

export const db = init({ appId: APP_ID, schema });

export const mutators = {
	addHabit(payload: Pick<InsertHabitType, "name">) {
		db.transact(db.tx.habits[id()].update(payload));
	},
	updateHabit(
		id: string,
		payload: Pick<InsertHabitType, "name" | "color" | "isArchived">,
	) {
		const updateSchema = z.object({
			name: z.string(),
			color: z.string(),
			isArchived: z.boolean(),
		});

		const result = updateSchema.safeParse(payload);

		if (!result.success) {
			throw new Error(`Failed to update habit${result.error.message}`);
		}

		const data = result.data;
		db.transact(db.tx.habits[id].update(data));
	},
	deleteHabit(id: string) {
		db.transact(db.tx.habits[id].delete());
	},
	archiveHabit(id: string, status: boolean) {
		db.transact(db.tx.habits[id].update({ isArchived: status }));
	},
	markHabitDate(payload: { id: string; date: string; currentGoal: number }) {
		const { id, date, currentGoal } = z
			.object(
				{
					id: z.string(),
					date: z.string(),
					currentGoal: z.number().catch(0),
					isSkipped: z.boolean().catch(false),
				},
				{
					message: "mark_habit_failed",
				},
			)
			.parse(payload);
		db.transact(
			db.tx.habits[id].merge({
				dates: { [date]: { id, exactDate: date, currentGoal } },
			}),
		);
	},
} as const;
