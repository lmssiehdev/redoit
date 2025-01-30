"use client";

import { GoToMainPageButton } from "@/components/misc";
import { HabitForm } from "@/components/habit-form";
import { useHabitsStore } from "@/state";
import { useRouter } from "next/navigation";

export default function AddHabit() {
	const addHabit = useHabitsStore((state) => state.addHabit);
	const { back } = useRouter();

	return (
		<div className="max-w-sm p-2 mx-auto">
			<div className="flex items-center gap-2 my-4">
				<GoToMainPageButton />
				<h1 className="text-xl ">Add Habit</h1>
			</div>
			<HabitForm
				onSubmit={(payload) => {
					addHabit(payload);
					back();
				}}
			/>
		</div>
	);
}
