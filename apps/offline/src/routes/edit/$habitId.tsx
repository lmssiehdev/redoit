import { GoToMainPageButton } from "@/components/calendar/weekly/misc";
import { HabitForm } from "@/components/habit-form";
import { useHabitsStore } from "@/state";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

export const Route = createFileRoute("/edit/$habitId")({
	component: EditHabit,
});

function EditHabit() {
	const { habitId } = Route.useParams();
	const updateHabitData = useHabitsStore((state) => state.updateHabitData);
	const getHabitData = useHabitsStore((state) => state.getHabitData);
	const habitData = getHabitData(habitId);
	const navigate = useNavigate();
	if (!habitData) return <div>Habit Doesn't Exist!</div>;

	return (
		<div className="max-w-sm p-2 mx-auto">
			<div className="flex items-center gap-2 my-4">
				<GoToMainPageButton />
				<h1 className="text-xl ">Edit Habit</h1>
			</div>
			<HabitForm
				habitData={habitData}
				onSubmit={(payload) => {
					updateHabitData({ id: habitData.id, payload });
					navigate({
						to: "/",
					});
				}}
			/>
		</div>
	);
}
