import { useHabit } from "@/app/habit/[id]/_provider";
import { DayWithToolTip } from "@/components/calendar/day";
import { WeekChart } from "@/components/calendar/monthly/charts";
import { Overview } from "@/components/calendar/monthly/overview";
import { Button } from "@/components/ui/button";
import { DAYS, MONTHS } from "@/constants";
import { type Dayjs, dayjs, normalizeDate } from "@/lib/day";
import { useMonthContext } from "@/providers/monthly-navigation";
import { MonthDateProvider } from "@/providers/monthly-navigation";
import { useHabitsStore } from "@/state";
import { CaretLeft, CaretRight, ChartBar } from "@phosphor-icons/react";
import { Fragment } from "react";

function MonthlyNavigation() {
	const {
		currentMonth,
		currentYear,
		goToNextMonth,
		goToPrevMonth,
		isCurrentMonth,
	} = useMonthContext();

	return (
		<div className="flex justify-between">
			<div>{`${MONTHS[currentMonth]} ${currentYear}`}</div>
			<div className="flex gap-1	">
				<Button size="xs" variant="outline" onClick={goToPrevMonth}>
					<CaretLeft className="size-5" />
				</Button>
				<Button
					size="xs"
					variant="outline"
					onClick={goToNextMonth}
					disabled={isCurrentMonth}
				>
					<CaretRight className="size-5" />
				</Button>
			</div>
		</div>
	);
}

function MonthlyCalendar() {
	const { daysInMonth, startOffset, currentMonth, currentYear } =
		useMonthContext();
	const markHabit = useHabitsStore((state) => state.markHabit);
	const { habitData } = useHabit();

	return (
		<>
			<div className="grid grid-cols-7 gap-1">
				{DAYS.map((day) => (
					<div key={day} className="text-center">
						{day.substring(0, 2)}
					</div>
				))}
				{Array.from({ length: startOffset }, (_, i) => (
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					<div key={`${i}`} />
				))}
				{Array.from({ length: daysInMonth }, (_, i) => {
					const date: Dayjs = dayjs(
						`${currentMonth + 1}-${i + 1}-${currentYear}`,
					);
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<Fragment key={i}>
							<DayWithToolTip
								date={date}
								markDate={() => {
									markHabit({ id: habitData.id, date: normalizeDate(date) });
								}}
							/>
						</Fragment>
					);
				})}
			</div>
		</>
	);
}

export function MonthlyView() {
	return (
		<MonthDateProvider>
			<div className="my-2">
				<div className="pb-4">
					<MonthlyNavigation />
				</div>
				<MonthlyCalendar />
			</div>
		</MonthDateProvider>
	);
}

export function HabitStats() {
	const {
		habitData: { dates },
	} = useHabit();

	if (Object.keys(dates).length === 0) {
		return (
			<div className="text-center flex flex-col items-center mt-10">
				<ChartBar className="size-8 mb-2" />
				<h2>No Stats Available</h2>
				<p>Start tracking your habits to see your progress!</p>
			</div>
		);
	}

	return (
		<>
			<div className="my-4">
				<h3 className="font-bold text-center mb-4 font-mathlete text-3xl tracking-widest">
					OVERVIEW
				</h3>
				<Overview />
			</div>
			<div className="my-4">
				<h3 className="font-bold text-center mb-4 font-mathlete text-3xl tracking-widest">
					WEEKLY ACTIVITY
				</h3>
				<WeekChart />
			</div>
			{/* <div className="my-4">
				<h3 className="font-bold text-center mb-4 font-mathlete text-3xl tracking-widest">
					Streaks
				</h3>
				<Streaks />
			</div> */}
		</>
	);
}
