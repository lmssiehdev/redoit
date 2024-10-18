import { HabitStats, MonthlyView } from "@/components/calendar/monthly/view";
import { GoToMainPageButton } from "@/components/calendar/weekly/misc";
import { HabitColor } from "@/components/calendar/weekly/view";
import { buttonVariants } from "@/components/ui/button";
import { useHabitsStore } from "@/state";
import { Archive, PencilSimple } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { createContext, useContext } from "react";

export const Route = createFileRoute("/habit/$habitId")({
	component: HabitView,
});

type ContextValue = {
	habitData: HabitData;
};

const HabitContext = createContext({} as ContextValue);

export function HabitProvider({
	children,
	habitId,
}: {
	children: React.ReactNode;
	habitId: string;
}) {
	const data = useHabitsStore((state) => state.data);
	const habitData = data[habitId];

	if (!habitData) return <div>Habit Doesn't Exist!</div>;

	return (
		<HabitContext.Provider value={{ habitData }}>
			{children}
		</HabitContext.Provider>
	);
}

export function useHabit() {
	const context = useContext(HabitContext);
	if (context === undefined) {
		throw new Error("useHabit must be used within a HabitProvider");
	}
	return context;
}

function HabitView() {
	const { habitId } = Route.useParams();

	return (
		<div className="mx-auto grid grid-cols-2 gap-10">
			<HabitProvider habitId={habitId}>
				<div className="max-w-sm w-full justify-self-end">
					<HabitInfo />
					<MonthlyView />
				</div>
				<div className="max-w-sm w-full">
					<HabitStats />
				</div>
			</HabitProvider>
		</div>
	);
}

function HabitInfo() {
	const {
		habitData: { name, color, isArchived, id: habitId },
	} = useHabit();

	return (
		<div className="flex items-center gap-2">
			<GoToMainPageButton />
			<div className="flex-1 flex items-center justify-between py-2">
				<div className="flex items-center">
					{isArchived && <Archive className="size-5 mr-2" />}
					<HabitColor color={color} className="mr-2" />
					<div className="flex items-center gap-2">{name}</div>
				</div>
				<Link
					to="/edit/$habitId"
					params={{ habitId }}
					className={buttonVariants({ variant: "ghost", size: "xs" })}
				>
					<PencilSimple className="size-5" />
				</Link>
			</div>
		</div>
	);
}
