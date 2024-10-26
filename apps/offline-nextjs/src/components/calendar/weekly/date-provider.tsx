import { normalizeDate } from "@/lib/day";
import dayjs, { type Dayjs } from "dayjs";
import { createContext, useContext, useMemo } from "react";
import { useImmerReducer } from "use-immer";

type Action =
	| { type: "PREV_DAY" }
	| { type: "NEXT_DAY" }
	| { type: "SET_DATE_ARRAY"; value: string[] };

const initialState = {
	date: dayjs(),
	dateArray: [] as string[],
};

function dateReducer(state: typeof initialState, action: Action) {
	switch (action.type) {
		case "SET_DATE_ARRAY": {
			state.dateArray = action.value;
			break;
		}
		case "PREV_DAY": {
			state.date = state.date.subtract(1, "day");
			break;
		}
		case "NEXT_DAY": {
			const isFutureDate = dayjs().isAfter(state.date, "day");
			if (!isFutureDate) return state;
			state.date = state.date.add(1, "day");
			break;
		}
	}
}

export function useDateNavigator() {
	const [state, dispatch] = useImmerReducer(dateReducer, initialState);

	useMemo(() => {
		const tempArray: string[] = [];
		for (let i = 0; i < 7; i++) {
			tempArray.push(normalizeDate(state.date.subtract(i, "day")));
		}
		dispatch({
			type: "SET_DATE_ARRAY",
			value: tempArray.reverse(),
		});
	}, [state.date, dispatch]);

	return {
		dateArray: state.dateArray,
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

const DateContext = createContext<ContextValue>({} as ContextValue);

export function useWeeklyDate() {
	const context = useContext(DateContext);
	if (!context) throw new Error("useDate must be used within an DateContext.");
	return context;
}

export function WeeklyDateProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	const { NEXT_DAY, PREV_DAY, currDate, dateArray } = useDateNavigator();

	const value = useMemo(
		() => ({ NEXT_DAY, PREV_DAY, currDate, dateArray }) as ContextValue,
		[dateArray, currDate, NEXT_DAY, PREV_DAY],
	);

	return <DateContext.Provider value={value}>{children}</DateContext.Provider>;
}
