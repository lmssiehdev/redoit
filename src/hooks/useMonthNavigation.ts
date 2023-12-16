import dayjs from "dayjs";
import { useImmerReducer } from "use-immer";

type action = { type: "goToNextMonth" } | { type: "goToPrevMonth" };

const initialState = {
  date: dayjs(),
};

function monthReducer(state: typeof initialState, action: action) {
  switch (action.type) {
    case "goToPrevMonth": {
      state.date = state.date.subtract(1, "month");
      break;
    }
    case "goToNextMonth": {
      const isAfter = dayjs().isAfter(state.date, "month");
      if (!isAfter) return state;
      state.date = state.date.add(1, "month");
      break;
    }
  }
}

export function useMonth() {
  const [state, dispatch] = useImmerReducer(monthReducer, initialState);

  return {
    currentYear: state.date.year(),
    currentMonth: state.date.month(),
    daysInMonth: state.date.daysInMonth(),
    startOffset: state.date.startOf("month").day(),
    isCurrentMonth: dayjs().isSame(state.date, "month"),
    goToPrevMonth: () => dispatch({ type: "goToPrevMonth" }),
    goToNextMonth: () => dispatch({ type: "goToNextMonth" }),
  };
}
