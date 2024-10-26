export enum Status {
	Completed = 0,
	Skipped = 1,
}
export type HabitData = {
	id: string;
	name: string;
	color: string;
	createdAt: string;
	isArchived: boolean;
	frequency: boolean[];
	dates: Record<string, Status>;
};
