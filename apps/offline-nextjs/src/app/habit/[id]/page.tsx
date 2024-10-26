"use client";

import { HabitProvider, useHabit } from "@/app/habit/[id]/_provider";
import { HabitStats, MonthlyView } from "@/components/calendar/monthly/view";
import { GoToMainPageButton } from "@/components/calendar/weekly/misc";
import { HabitColor } from "@/components/calendar/weekly/view";
import { buttonVariants } from "@/components/ui/button";
import { Archive, PencilSimple } from "@phosphor-icons/react";
import Link from "next/link";
import { use } from "react";

type Params = Promise<{ id: string }>;

export default function HabitView(props: { params: Params } ) {
	const params = use(props.params);
	const {id: habitId} = params;
	if (typeof window === "undefined") {
		return (
			<div suppressHydrationWarning>
				<div>{null}</div>
			</div>
		);
	}
	return (
		<div className="mx-auto grid md:grid-cols-2  gap-10">
			<HabitProvider habitId={habitId as string}>
				<div className="max-w-sm w-full mx-auto md:mx-0 md:justify-self-end">
					<HabitInfo />
					<MonthlyView />
				</div>
				<div className="max-w-sm w-full mx-auto md:mx-0">
					<HabitStats />
				</div>
			</HabitProvider>
		</div>
	);
}

function HabitInfo() {
	const {
		habitData: { name, color, isArchived, id: habitId },
	} = useHabit();

	return (
		<div className="flex items-center gap-2">
			<GoToMainPageButton />
			<div className="flex-1 flex items-center justify-between py-2">
				<div className="flex items-center">
					{isArchived && <Archive className="size-5 mr-2" />}
					<HabitColor color={color} className="mr-2" />
					<div className="flex items-center gap-2">{name}</div>
				</div>
				<Link
					href={`/edit/${habitId}`}
					className={buttonVariants({ variant: "ghost", size: "xs" })}
				>
					<PencilSimple className="size-5" />
				</Link>
			</div>
		</div>
	);
}
