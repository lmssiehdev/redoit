"use client";

import { HabitForm } from "@/components/habit-form";
import { GoToMainPageButton } from "@/components/misc";
import { useHabitsStore } from "@/state";
import { useRouter } from "next/navigation";
import { use } from "react";

type Params = Promise<{ id: string }>;

export default function EditHabit(props: { params: Params }) {
	const params = use(props.params);
	const { id: habitId } = params;
	const updateHabitData = useHabitsStore((state) => state.updateHabitData);
	const getHabitData = useHabitsStore((state) => state.getHabitData);
	const habitData = getHabitData(habitId);
	const router = useRouter();

	return (
		<div className="max-w-sm p-2 mx-auto">
			<div className="flex items-center gap-2 my-4">
				<GoToMainPageButton />
				<h1 className="text-xl ">Edit Habit</h1>
			</div>
			<HabitForm
				habitData={habitData}
				onSubmit={(payload) => {
					router.back();
					updateHabitData({ id: habitData.id, payload });
				}}
			/>
		</div>
	);
}
