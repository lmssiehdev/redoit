"use client";

import { VerticalView } from "@/components/calendar/weekly/view";

export default function Home() {
	if (typeof window === "undefined") {
		return (
			<div suppressHydrationWarning>
				<div>{null}</div>
			</div>
		);
	}
	return (
		<div className="max-w-screen-sm mx-auto">
			<VerticalView />
		</div>
	);
}
