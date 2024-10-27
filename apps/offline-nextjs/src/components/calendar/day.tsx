import { useHabit } from "@/app/habit/[id]/_provider";
import { normalizeColor } from "@/components/calendar/monthly/overview";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Dayjs, dayjs, normalizeDate } from "@/lib/day";
import { cn } from "@/lib/utils";
import { useSettingsStore } from "@/state/settings";
import { Status } from "@/types";
import { Slot } from "@radix-ui/react-slot";

import {
	type GlobalOptions as ConfettiGlobalOptions,
	type Options as ConfettiOptions,
	default as confetti,
} from "canvas-confetti";

import { forwardRef } from "react";
export function DayWithToolTip({
	date,
	markDate,
	options,
}: {
	date: Dayjs | string;
	markDate: (date: string) => void;
	options?: ConfettiOptions &
		ConfettiGlobalOptions & { canvas?: HTMLCanvasElement };
}) {
	const {
		habitData: { isArchived, color, dates, frequency },
	} = useHabit();
	const formatedDate = normalizeDate(date);
	const isFuture = dayjs(date).isAfter(new Date());
	const isActive = frequency[dayjs(date).day()];
	const confettiEnabled = useSettingsStore((state) => state.confettiEnabled);

	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Day
						className="flex justify-center "
						color={color}
						disabled={!isActive || isFuture || isArchived}
						isActive={isActive}
						status={dates[formatedDate]}
						// disabled={isFuture}
						onClick={(event) => {
							if (isFuture) return;
							if (dates[formatedDate] === undefined && confettiEnabled)
								playConfetti(event);
							markDate(formatedDate);
						}}
					/>
				</TooltipTrigger>

				<TooltipContent>
					{isArchived ? (
						`${dayjs(formatedDate).format("ll")} • archived`
					) : (
						<p>
							{dayjs(formatedDate).format("ll")}
							{isActive ? (
								<>{dates[formatedDate] ? ` • ${dates[formatedDate]}` : ""}</>
							) : (
								" • not tracked"
							)}
						</p>
					)}
				</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
	function playConfetti(event: React.MouseEvent<HTMLButtonElement>) {
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
}

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	color: string;
	isActive: boolean;
	status?: Status;
	asChild?: boolean;
}

export const Day = forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, asChild = false, color, isActive, status, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
    const { dayCompletedColor, daySkippedColor } = normalizeColor(color);
		const backgroundColor = !isActive
			? "rgba(0, 0, 0, 0.1)"
			: status !== undefined
				? status === Status.Completed
        ? dayCompletedColor
        : daySkippedColor
				: "";
		return (
			<Comp
				className={cn(
					"overflow-hidden border border-dashed border-black h-10 disabled:opacity-30 w-full",
          className
				)}
				style={{
					backgroundColor,
				}}
				ref={ref}
				{...props}
			/>
		);
  }
);
Day.displayName = "Day";
