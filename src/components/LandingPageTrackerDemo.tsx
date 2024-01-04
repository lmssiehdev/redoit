"use client";

import { DayWithToolTip } from "@/components/calendar/Monthly";
import VerticalCalendarWrapper from "@/components/calendar/Vertical";
import { useDate } from "@/context/DateProvider";
import { useCalculateStreak } from "@/hooks/useCalculateStreak";
import { LightningBoltIcon } from "@radix-ui/react-icons";
import { useImmerReducer } from "use-immer";

function reducer(
  state,
  action: { type: "UPDATE_DATE"; habitId: string; date: string },
) {
  switch (action.type) {
    case "UPDATE_DATE": {
      const status = state[action.habitId].completedDates[action.date];
      if (status === "checked") {
        state[action.habitId].completedDates[action.date] = "skipped";
      } else if (status === "skipped") {
        delete state[action.habitId].completedDates[action.date];
      } else {
        state[action.habitId].completedDates[action.date] = "checked";
      }
      break;
    }
    default: {
    }
  }
  return state;
}

export function LandingPageTrackerDemo() {
  const [state, dispatch] = useImmerReducer(reducer, {
    "habit/EI7Sz2bIdBZcDOVMw0CbA": {
      archived: false,
      color: "#9AC885",
      completed: false,
      frequency: [true, true, true, true, true, true, true],
      name: "yikes.",
      completedDates: {
        "2023-12-10": "checked",
        "2023-12-11": "checked",
        "2023-12-12": "checked",
        "2023-12-14": "checked",
        "2023-12-15": "checked",
        "2023-12-16": "checked",
        "2023-12-17": "checked",
        "2023-12-18": "skipped",
        "2023-12-19": "skipped",
        "2023-12-20": "checked",
        "2023-12-21": "checked",
        "2023-12-3": "checked",
        "2023-12-4": "checked",
        "2023-12-6": "skipped",
        "2023-12-7": "skipped",
        "2023-12-8": "checked",
        "2023-12-9": "checked",
      },
    },
    "habit/Ld2DArhty--QbiasCGNPg": {
      archived: false,
      color: "#9AC885",
      completed: false,
      frequency: [true, true, true, true, true, true, true],
      name: "yikes.",
      completedDates: {
        "2023-12-10": "checked",
        "2023-12-11": "checked",
        "2023-12-12": "checked",
        "2023-12-14": "checked",
        "2023-12-15": "checked",
        "2023-12-16": "checked",
        "2023-12-17": "checked",
        "2023-12-18": "skipped",
        "2023-12-19": "skipped",
        "2023-12-20": "checked",
        "2023-12-21": "checked",
        "2023-12-3": "checked",
        "2023-12-4": "checked",
        "2023-12-6": "skipped",
        "2023-12-7": "skipped",
        "2023-12-8": "checked",
        "2023-12-9": "checked",
      },
    },
  });
  const { calendarDates: dateArray } = useDate();
  return (
    <>
      <div className="my-2 flex items-center justify-between gap-2 md:grid md:grid-cols-[minmax(0px,200px),6fr,40px] ">
        <VerticalCalendarWrapper />
      </div>
      {/* is it possible to reuse Habit row with this? */}
      {Object.entries(state).map(([key, value]) => {
        return (
          <div
            key={key}
            className="my-2 grid grid-rows-2 gap-2 md:grid-cols-[minmax(0px,200px),6fr,40px] md:grid-rows-1"
          >
            <div className="group flex items-center justify-between">
              <div
                className="flex items-center gap-2 border-l-2 pl-2"
                style={{
                  borderColor: value?.color,
                }}
              >
                <span>{value?.name} </span>
              </div>
            </div>
            <div className="flex items-center justify-around gap-3">
              {dateArray.map((date) => {
                return (
                  <DayWithToolTip
                    date={date}
                    key={date}
                    markDate={(date) =>
                      dispatch({
                        type: "UPDATE_DATE",
                        date,
                        habitId: key,
                      })
                    }
                    completedDates={value.completedDates}
                    habitData={value}
                  />
                );
              })}
            </div>
            <span className="hidden items-center gap-1.5  text-sm sm:flex">
              <LightningBoltIcon />
              {/* Move me into my own  */}
              {useCalculateStreak(value.completedDates).currentStreak}
            </span>
          </div>
        );
      })}
    </>
  );
}
