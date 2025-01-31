import { normalizeDate } from "@/lib/day";
import dayjs, { type Dayjs } from "dayjs";
import { createContext, useContext, useMemo } from "react";
import { useImmerReducer } from "use-immer";

type Action = { type: "PREV_DAY" } | { type: "NEXT_DAY" };

const initialState = {
	date: dayjs(),
};

function dateReducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "PREV_DAY": {
			state.date = state.date.subtract(1, "day");
			return state;
		}
		case "NEXT_DAY": {
			const isFutureDate = dayjs().isAfter(state.date, "day");
			if (!isFutureDate) {
				return state;
			}
			state.date = state.date.add(1, "day");
			return state;
		}
		default:
			throw new Error(`Unhandled action type: ${(action as Action).type}`);
	}
}

export function useDateNavigator() {
	const [state, dispatch] = useImmerReducer(dateReducer, initialState);

	const dateArray = useMemo(() => {
		const tempArray: string[] = [];
		for (let i = 0; i < 7; i++) {
			tempArray.push(normalizeDate(state.date.subtract(i, "day")));
		}
		return tempArray.reverse();
	}, [state.date]);

	return {
		dateArray,
		currDate: state.date,
		NEXT_DAY: () => dispatch({ type: "NEXT_DAY" }),
		PREV_DAY: () => dispatch({ type: "PREV_DAY" }),
	};
}

type ContextValue = {
	PREV_DAY: () => void;
	NEXT_DAY: () => void;
	currDate: Dayjs;
	dateArray: string[];
};

const DateContext = createContext<ContextValue | null>(null);

export function useWeeklyDate() {
	const context = useContext(DateContext);
	if (!context)
		throw new Error("useWeeklyDate must be used within a WeeklyDateProvider.");
	return context;
}

export function WeeklyDateProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { NEXT_DAY, PREV_DAY, currDate, dateArray } = useDateNavigator();

	const value = useMemo(
		() => ({ NEXT_DAY, PREV_DAY, currDate, dateArray }),
		[dateArray, currDate, NEXT_DAY, PREV_DAY],
	);

	return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
