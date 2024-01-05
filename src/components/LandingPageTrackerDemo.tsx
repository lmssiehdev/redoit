"use client";

import { DayWithToolTip } from "@/components/calendar/Monthly";
import VerticalCalendarWrapper from "@/components/calendar/Vertical";
import CurrentStreak from "@/components/habits/CurrentStreak";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/context/AuthProvider";
import { useDate } from "@/context/DateProvider";
import { Habit } from "@/utils/habits";
import { cn } from "@/utils/misc";
import Link from "next/link";
import ReactRough, { Rectangle } from "rough-react-wrapper";
import { useImmerReducer } from "use-immer";

type State = Record<string, Habit.Definition>;
type Action = { type: "UPDATE_DATE"; habitId: string; date: string };

function reducer(state: State, action: Action) {
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

export function LandingPageTrackerDemo({
  initialState,
}: {
  initialState: Record<string, Habit.Definition>;
}) {
  const [state, dispatch] = useImmerReducer(reducer, initialState);
  const { calendarDates: dateArray } = useDate();
  return (
    <>
      {/* <div className="roughjs-wrapper">
        <ReactRough renderer={"svg"} width={40} height={40}>
          <Rectangle
            width={30}
            height={30}
            x={30}
            y={30}
            fill="purple"
            fillStyle={"cross-hatch"}
          />
        </ReactRough>
      </div> */}
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
            <CurrentStreak
              completedDates={
                value.completedDates as Habit.Definition["completedDates"]
              }
            />
          </div>
        );
      })}
    </>
  );
}

export function HomeCallToAction() {
  const { session } = useUser();

  if (!session?.user?.id)
    return (
      <Link
        href="/auth/signin"
        className={cn(
          buttonVariants({ variant: "jounral" }),
          "my-5 inline-block",
        )}
      >
        Get Started
      </Link>
    );

  return (
    <Link
      href="/web"
      className={cn(
        buttonVariants({ variant: "jounral" }),
        "my-5 inline-block",
      )}
    >
      Go To App
    </Link>
  );
}
