"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useSettingsStore } from "@/state/settings";

export default function Settings() {
	const { toggleConfetti, confettiEnabled } = useSettingsStore(
		(state) => state,
	);

	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="w-full max-w-screen-sm mx-auto flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
				<div className="mx-auto grid w-full max-w-6xl gap-2 pb-10">
					<h1 className="text-3xl font-semibold">Settings</h1>
				</div>
				<div className="flex flex-col gap-2">
					<Card className="bg-white/40 rounded-none shadow-none">
						<CardHeader>
							<CardTitle>Customization</CardTitle>
							<CardDescription>{}</CardDescription>
						</CardHeader>
						<CardContent>
							<form className="flex flex-col gap-4">
								{/* <div className="flex items-center space-x-2">
                  <label
                    htmlFor="countSkippedDays"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-auto"
                  >
                    Count Skipped Days in Streak
                  </label>
                  <Switch id="countSkippedDays" defaultChecked />
                </div> */}
								<div className="flex items-center space-x-2">
									<label
										htmlFor="showConfetti"
										className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mr-auto"
									>
										Show confetti
									</label>
									<Switch
										id="showConfetti"
										checked={confettiEnabled}
										onCheckedChange={toggleConfetti}
									/>
								</div>
							</form>
						</CardContent>
						{/* <CardFooter className="border-t px-6 py-4">
              <Button>Save</Button>
            </CardFooter> */}
					</Card>
				</div>
			</main>
		</div>
	);
}
