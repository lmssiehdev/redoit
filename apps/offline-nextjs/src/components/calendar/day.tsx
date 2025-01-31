"use client";
import { normalizeColor } from "@/components/calendar/monthly/overview";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Dayjs, dayjs, normalizeDate } from "@/lib/day";
import { cn } from "@/lib/utils";
import { useHabit } from "@/providers/habit-provider";
import { useSettingsStore } from "@/state/settings";
import { Status } from "@/types";

import {
	type GlobalOptions as ConfettiGlobalOptions,
	type Options as ConfettiOptions,
	default as confetti,
} from "canvas-confetti";
import type { MouseEvent } from "react";

interface DayWithToolTipProps {
	date: Dayjs | string;
	markDate: (date: string) => void;
	options?: ConfettiOptions &
		ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}

export function DayWithToolTip({
	date,
	markDate,
	options,
}: DayWithToolTipProps) {
	const {
		habitData: { isArchived, color, dates, frequency },
	} = useHabit();
	const formatedDate = normalizeDate(date);
	const isFuture = dayjs(date).isAfter(new Date());
	const isActive = frequency[dayjs(date).day()];
	const confettiEnabled = useSettingsStore((state) => state.confettiEnabled);

	const tooltipContent = isArchived ? (
		`${dayjs(formatedDate).format("ll")} • archived`
	) : (
		<p>
			{dayjs(formatedDate).format("ll")}
			{isActive ? (
				<>
					{dates[formatedDate] !== undefined
						? ` • ${
								dates[formatedDate] === Status.Skipped ? "skipped" : "completed"
							}`
						: ""}
				</>
			) : (
				" • not tracked"
			)}
		</p>
	);

	const { dayCompletedColor, daySkippedColor } = normalizeColor(color);
	const backgroundColor = !isActive
		? "rgba(0, 0, 0, 0.1)"
		: dates[formatedDate] !== undefined
			? dates[formatedDate] === Status.Completed
				? dayCompletedColor
				: daySkippedColor
			: "";

	function handleDayClick(event: MouseEvent<HTMLButtonElement>) {
		if (isFuture) return;
		if (dates[formatedDate] === undefined && confettiEnabled) {
			playConfetti(event, options);
		}
		markDate(formatedDate);
	}
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<button
						type="button"
						className={cn(
							"overflow-hidden border border-dashed border-black h-10 disabled:opacity-30 w-full flex justify-center",
						)}
						style={{
							backgroundColor,
						}}
						disabled={!isActive || isFuture || isArchived}
						onClick={handleDayClick}
					/>
				</TooltipTrigger>

				<TooltipContent>{tooltipContent}</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}

function playConfetti(
	event: React.MouseEvent<HTMLButtonElement>,
	options?: ConfettiOptions & ConfettiGlobalOptions,
) {
	const rect = event.currentTarget.getBoundingClientRect();
	const x = rect.left + rect.width / 2;
	const y = rect.top + rect.height / 2;
	confetti({
		...options,
		disableForReducedMotion: true,
		startVelocity: 30,
		particleCount: 40,
		origin: {
			x: x / window.innerWidth,
			y: y / window.innerHeight,
		},
	});
}
