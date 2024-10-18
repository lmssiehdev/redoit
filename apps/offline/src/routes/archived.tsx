import { VerticalView } from "@/components/calendar/weekly/view";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/archived")({
	component: ArchivedComponent,
});

export function ArchivedComponent() {
	return (
		<div className="max-w-screen-sm mx-auto">
			<VerticalView />
		</div>
	);
}
