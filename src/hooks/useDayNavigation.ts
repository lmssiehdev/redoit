import dayjs from "dayjs";
import { useMemo } from "react";
import { useImmerReducer } from "use-immer";

type Action =
  | { type: "goToPrevDay" }
  | { type: "goToNextDay" }
  | { type: "setDateArray"; value: string[] };

const initialState = {
  date: dayjs(),
  dateArray: [] as string[],
};

function dateReducer(state: typeof initialState, action: Action) {
  switch (action.type) {
    case "setDateArray": {
      state.dateArray = action.value;
      break;
    }
    case "goToPrevDay": {
      state.date = state.date.subtract(1, "day");
      break;
    }
    case "goToNextDay": {
      const isAfter = dayjs().isAfter(state.date, "day");
      if (!isAfter) return state;
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
      const fomatedDate = state.date.subtract(i, "day").format("YYYY-M-D");
      tempArray.push(fomatedDate);
    }
    dispatch({
      type: "setDateArray",
      value: tempArray.reverse(),
    });
  }, [state.date, dispatch]);

  return {
    dateArray: state.dateArray,
    goToNextDay: () => dispatch({ type: "goToNextDay" }),
    goToPrevDay: () => dispatch({ type: "goToPrevDay" }),
  };
}
