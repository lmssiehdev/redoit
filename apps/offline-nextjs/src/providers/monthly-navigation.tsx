import { dayjs } from "@/lib/day";
import { createContext, useCallback, useContext } from "react";
import { useImmerReducer } from "use-immer";

type State = {
	date: dayjs.Dayjs;
};

type Action = { type: "NEXT_MONTH" } | { type: "PREV_MONTH" };

const initialState: State = {
	date: dayjs(),
};

function monthReducer(state: State, action: Action): State {
	switch (action.type) {
		case "PREV_MONTH": {
			state.date = state.date.subtract(1, "month");
			break;
		}
		case "NEXT_MONTH": {
			const isAfter = dayjs().isAfter(state.date, "month");
			if (!isAfter) return state;
			state.date = state.date.add(1, "month");
			break;
		}
	}
	return state;
}

export function useMonth() {
	const [state, dispatch] = useImmerReducer(monthReducer, initialState);

	const goToPrevMonth = useCallback(
		() => dispatch({ type: "PREV_MONTH" }),
		[dispatch],
	);
	const goToNextMonth = useCallback(
		() => dispatch({ type: "NEXT_MONTH" }),
		[dispatch],
	);

	return {
		currentYear: state.date.year(),
		currentMonth: state.date.month(),
		daysInMonth: state.date.daysInMonth(),
		startOffset: state.date.startOf("month").day(),
		isCurrentMonth: dayjs().isSame(state.date, "month"),
		goToPrevMonth,
		goToNextMonth,
	};
}

type ContextValue = ReturnType<typeof useMonth>;

const DateContext = createContext<ContextValue | null>(null);

export function useMonthContext() {
	const context = useContext(DateContext);
	if (!context) {
		throw new Error("useMonthContext must be used within a MonthDateProvider.");
	}
	return context;
}

export function MonthDateProvider({ children }: { children: React.ReactNode }) {
	const value = useMonth();
	return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
