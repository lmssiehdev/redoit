import { useHabitsStore } from "@/state";
import type { HabitData } from "@/types";
import { type ReactNode, createContext, useContext, useMemo } from "react";

type HabitContextValue = {
	habitData: HabitData;
};

const HabitContext = createContext<HabitContextValue | null>(null);

export function useHabit(): HabitContextValue {
	const context = useContext(HabitContext);

	if (!context) {
		throw new Error("useHabit must be used within a HabitProvider");
	}

	return context;
}

type HabitProviderProps = {
	children: ReactNode;
	habitId: string;
};

export function HabitProvider({
	children,
	habitId,
}: HabitProviderProps): JSX.Element {
	const habitData = useHabitsStore((state) => state.data[habitId]);

	const contextValue = useMemo(() => ({ habitData }), [habitData]);

	if (!habitData) {
		return <div>Habit Doesn't Exist!</div>;
	}

	return (
		<HabitContext.Provider value={contextValue}>
			{children}
		</HabitContext.Provider>
	);
}
