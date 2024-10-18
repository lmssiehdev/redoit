type HabitStatus = "completed" | "skipped";
type HabitData = {
	id: string;
	name: string;
	color: string;
	createdAt: string;
	isArchived: boolean;
	frequency: boolean[];
	dates: Record<string, HabitStatus>;
};
