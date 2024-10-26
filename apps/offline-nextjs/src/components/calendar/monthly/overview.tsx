import { useHabit } from "@/app/habit/[id]/page";
import { summary } from "@/lib/date-streaks";
import { differenceInDays, sortDates } from "@/lib/day";
import { LightenDarkenColor, convertHex, lightOrDark } from "@/lib/utils";
import { Status } from "@/types";
import { CheckFat, Lightning, Percent } from "@phosphor-icons/react";
import { CalendarBlank } from "@phosphor-icons/react/dist/ssr";
import dayjs from "dayjs";
import { useMemo } from "react";

export function normalizeColor(color: string) {
	const isLightColor = lightOrDark(color) === "light";
	const opacity = isLightColor ? 0.8 : 0.4;
	return convertHex(
		LightenDarkenColor(color, isLightColor ? -50 : 60),
		opacity,
	);
}

export function Overview() {
	const {
		habitData: { dates, color, frequency },
	} = useHabit();

	const { currentStreak, longestStreak } = useMemo(
		() => summary(Object.keys(dates), frequency),
		[dates, frequency],
	);

	const stats = useMemo(() => {
		const successfulDays = Object.values(dates).filter(
			(v) => v === Status.Completed,
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
		const backgroundColor = normalizeColor(color);

		return { color, backgroundColor };
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

function percentage(partialValue: number, totalValue: number) {
	return `${((100 * partialValue) / totalValue).toFixed()}%`;
}
