import { GoToMainPageButton } from "@/components/calendar/weekly/misc";
import { HabitForm } from "@/components/habit-form";
import { useHabitsStore } from "@/state";
import { useNavigate } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/add")({
	component: AddHabit,
});

function AddHabit() {
	const addHabit = useHabitsStore((state) => state.addHabit);
	const navigate = useNavigate();

	return (
		<div className="max-w-sm p-2 mx-auto">
			<div className="flex items-center gap-2 my-4">
				<GoToMainPageButton />
				<h1 className="text-xl ">Add Habit</h1>
			</div>
			<HabitForm
				onSubmit={(payload) => {
					addHabit(payload);
					navigate({
						to: "/",
					});
				}}
			/>
		</div>
	);
}
