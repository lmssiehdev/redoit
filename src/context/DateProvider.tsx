"use client";

import { useDateNavigator } from "@/hooks/useDayNavigation";
import { Dayjs } from "dayjs";
import { createContext, useContext, useMemo } from "react";

type ContextValue = {
  goToPrevDay: () => void;
  goToNextDay: () => void;
  currDate: Dayjs;
  calendarDates: string[];
};
const DateContext = createContext<ContextValue>({} as ContextValue);

export function useDate() {
  const context = useContext(DateContext);
  if (!context) throw new Error("useUser must be used within an DateContext.");
  return context;
}

export function DateProvider({ children }: { children: React.ReactNode }) {
  const { dateArray, currDate, goToNextDay, goToPrevDay } = useDateNavigator();

  const value = useMemo(
    () =>
      ({
        goToNextDay,
        goToPrevDay,
        currDate,
        calendarDates: dateArray,
      } as ContextValue),
    [dateArray]
  );

  return (
    <>
      <DateContext.Provider value={value}>{children}</DateContext.Provider>
    </>
  );
}
