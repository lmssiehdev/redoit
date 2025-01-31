import { useHabit } from "@/app/habit/[id]/_provider";
import { percentage } from "@/lib/completion-rate";
import { completionRate as completionRateRewrite } from "@/lib/completion-rate";
import { summary } from "@/lib/date-streaks";
import { differenceInDays, sortDates } from "@/lib/day";
import { LightenDarkenColor, convertHex, lightOrDark } from "@/lib/utils";
import { useSettingsStore } from "@/state/settings";
import { Status } from "@/types";
import { CheckFat, Lightning, Percent } from "@phosphor-icons/react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { useMemo } from "react";

export function normalizeColor(color: string) {
	const isLightColor = lightOrDark(color) === "light";
	const opacity = isLightColor ? 0.8 : 0.4;

	const daySkippedColor = convertHex(
		LightenDarkenColor(color, isLightColor ? -50 : 60),
		opacity,
	);
	const dayCompletedColor = convertHex(color, isLightColor ? 0.8 : 0.6);

	const chartSkippedColor = convertHex(
		LightenDarkenColor(color, isLightColor ? -50 : 40),
		isLightColor ? 0.8 : 0.6,
	);
	return {
		daySkippedColor,
		dayCompletedColor,
		chartCompletedColor: dayCompletedColor,
		chartSkippedColor,
	};
}

export function Overview() {
	const {
		habitData: { dates, color, frequency },
	} = useHabit();

	const countSkippedDaysInStreak = useSettingsStore(
		(state) => state.countSkippedDaysInStreak,
	);

	const { currentStreak, longestStreak } = useMemo(
		() => summary(Object.keys(dates), frequency),
		[dates, frequency],
	);

	const stats = useMemo(() => {
		const successfulDays = Object.values(dates).filter(
			(v) => countSkippedDaysInStreak || v === Status.Completed,
		).length;

		const completionRate = () => {
			const sortedDates = sortDates(
				Object.keys(dates).map((d) => dayjs(d).toDate()),
			);

			const firstDate = sortedDates[0];

			const totalDays = Math.max(
				differenceInDays(new Date(), firstDate) + 1,
				1,
			);

			return percentage(successfulDays, totalDays);
		};

		console.log(
			Object.entries(dates)
				.filter(
					([key, value]) =>
						countSkippedDaysInStreak || value === Status.Completed,
				)
				.map(([key]) => key),
			frequency,
		);

		console.log({
			old: completionRate(),
			new: completionRateRewrite(
				Object.entries(dates)
					.filter(
						([key, value]) =>
							countSkippedDaysInStreak || value === Status.Completed,
					)
					.map(([key]) => key),
				frequency,
			),
		});
		return [
			{
				name: "Current Streak",
				value: currentStreak,
				Icon: Lightning,
			},
			{
				name: "Longest Streak",
				value: longestStreak,
				Icon: CalendarBlank,
			},
			{
				name: "Successful",
				value: successfulDays,
				Icon: CheckFat,
			},
			{
				name: "Completion Rate",
				value: completionRate(),
				Icon: Percent,
			},
		];
	}, [dates, currentStreak, longestStreak]);

	const styles = useMemo(() => {
		const { daySkippedColor } = normalizeColor(color);

		return { color, backgroundColor: daySkippedColor };
	}, [color]);

	return (
		<>
			<div className="mb-10 grid grid-cols-2 gap-2">
				{stats.map((data) => {
					const { name, value, Icon } = data;
					return (
						<div
							key={name}
							className="relative flex flex-1 items-center overflow-hidden rounded p-2 text-sm"
							style={{
								...styles,
							}}
						>
							<div className="absolute -right-5 mr-4 flex h-auto rounded-full p-3 ">
								<Icon
									size={38}
									weight="bold"
									className="rotate-[-30deg] scale-[2] opacity-30"
								/>
							</div>
							<div className="font-varela-round">
								<span className="font-bold">{name}</span>
								<div>
									<span className="font-bold">{value}</span>
									<span className="text-sm"> </span>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</>
	);
}
