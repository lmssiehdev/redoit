import { dayjs } from "@/lib/day";
import { createContext, useCallback, useContext } from "react";
import { useImmerReducer } from "use-immer";

type Action = { type: "NEXT_MONTH" } | { type: "PREV_MONTH" };

const initialState = {
	date: dayjs(),
};

function monthReducer(state: typeof initialState, action: Action) {
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
}

function useMonth() {
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

const DateContext = createContext<ContextValue>({} as ContextValue);

export function useMonthContext() {
	const context = useContext(DateContext);
	if (!context)
		throw new Error("useContextMonth must be used within an DateContext.");
	return context;
}

export function MonthDateProvider({ children }: { children: React.ReactNode }) {
	const value = useMonth();

	console.log({ value });

	return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
