import {
  HomeCallToAction,
  LandingPageTrackerDemo,
} from "@/components/LandingPageTrackerDemo";

import { DateProvider } from "@/context/DateProvider";
import { HABIT_TEMPLATE, Habit } from "@/utils/habits";
import dayjs from "dayjs";

export const generateRandomDates = (length = 10) =>
  Array(length)
    .fill(true)
    .reduce((prev, _, i) => {
      let status;
      const random = Math.random();
      if (random < 0.2) return prev;
      if (random < 0.4) status = "skipped";
      else status = "checked";
      const dateKey = dayjs().subtract(i, "day").format("YYYY-M-D");
      prev[dateKey] = status;
      return prev;
    }, {}) as Habit.Definition["completedDates"];

export default function Page() {
  const demoHabits = [
    {
      id: "habit/#1",
      color: "#f9ac78",
      name: "Learn spanish",
    },
    {
      id: "habit/#2",
      color: "#9AC885",
      name: "Read 15 pages",
    },
    {
      id: "habit/#3",
      color: "#debd8f",
      name: "Do 25 pushups",
    },
  ].reduce(
    (prev, curr) => {
      const { id } = curr;
      prev[id] = {
        ...HABIT_TEMPLATE,
        ...curr,
        completedDates: generateRandomDates(10),
      };
      return prev;
    },
    {} as Record<string, Habit.Definition>,
  );

  return (
    <>
      <div className="text-center text-3xl md:text-5xl">
        <h1 className=" font-walsheim">
          Your radically <br />
          easy-to-use habit
          <br /> tracker
        </h1>
        <HomeCallToAction />
      </div>
      <div className="">
        <div className="mx-auto w-full max-w-screen-sm ">
          <DateProvider>
            <LandingPageTrackerDemo initialState={demoHabits} />
          </DateProvider>
        </div>
        <p className="text-center text-sm text-gray-600">
          Like what you see? Sign up now and start tracking
        </p>
      </div>
    </>
  );
}

function Footer() {
  return (
    <footer className="flex items-center">
      <a className="ml-auto" href="https://tally.so/r/wvMWaA" target="_blank">
        send feedback
      </a>
    </footer>
  );
}
