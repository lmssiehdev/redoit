import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { ColorPicker } from "@/components/colorPicker";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DAYS } from "@/constants";
import { useMemo } from "react";

function frequencyBooleanToString(payload?: boolean[]) {
	if (!payload) return Array.from({ length: 7 }, (_, i) => String(i));
	const frequency: string[] = [];
	payload.forEach((isActive, i) => isActive && frequency.push(String(i)));
	return frequency;
}

function frequencyStringToBoolean(payload: string[]) {
	const frequency = Array.from({ length: 7 }, () => false);
	for (const idx of payload) {
		frequency[Number(idx)] = true;
	}
	return frequency;
}

const formSchema = z.object({
	name: z.string().min(1, {
		message: "Please provide a valid name.",
	}),
	color: z.string(),
	archived: z.boolean(),
	frequency: z.string().array(),
});

export function HabitForm({
	onSubmit,
	habitData,
}: {
	habitData?: Partial<HabitData>;
	onSubmit: (
		payload: Pick<HabitData, "name" | "color" | "isArchived" | "frequency">,
	) => void;
}) {
	const isEditing = useMemo(() => habitData?.name !== undefined, [habitData]);
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: habitData?.name ?? "",
			color: habitData?.color ?? "#81968d",
			archived: habitData?.isArchived ?? false,
			frequency: frequencyBooleanToString(habitData?.frequency),
		},
	});

	function handleFormSubmit(values: z.infer<typeof formSchema>) {
		const { name, color, archived, frequency } = values;

		onSubmit({
			name,
			color,
			isArchived: archived,
			frequency: frequencyStringToBoolean(frequency),
		});
		form.setValue("name", "");
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleFormSubmit)}>
				<div className="flex gap-2 self-end">
					<FormField
						control={form.control}
						name="color"
						render={({ field }) => (
							<FormItem>
								{/* @HACK: to fix styling */}
								<FormLabel className="invisible">.</FormLabel>
								<FormControl>
									<ColorPicker value={field.value} onChange={field.onChange} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input placeholder="name" {...field} />
								</FormControl>

								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<FormField
					control={form.control}
					name="frequency"
					render={({ field }) => (
						<FormItem className="my-4">
							<FormLabel>Frequency</FormLabel>
							<FormControl>
								<ToggleGroup
									type="multiple"
									onValueChange={field.onChange}
									className="gap-0"
									value={field.value}
								>
									{DAYS.map((day, index) => (
										<ToggleGroupItem
											key={day}
											value={index.toString()}
											aria-label={`Toggle ${day}`}
											className="hover:bg-purple-30 h-6 w-6 flex-1 rounded-none border-x border-y-0 border-solid  border-x-purple-200 bg-purple-50 p-1 text-center text-purple-300 first:border-0 last:border-0 data-[state=on]:bg-purple-100 data-[state=on]:text-purple-400"
										>
											{day.substring(0, 3)}
											{/* {JSON.stringify(index.toString())} */}
										</ToggleGroupItem>
									))}
								</ToggleGroup>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				{isEditing && (
					<FormField
						control={form.control}
						name="archived"
						render={({ field }) => (
							<FormItem className="my-4">
								<FormLabel>Archived</FormLabel>
								<FormControl>
									<div>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				)}
				<Button
					type="submit"
					// variant="jounral"
					// className={cn(
					//   {
					//     "bg-green-200 text-green-700 hover:bg-green-200/50": true,
					//   },
					//   "w-fit"
					// )}
				>
					{isEditing ? "Update" : "Add"}
				</Button>
			</form>
		</Form>
	);
}
