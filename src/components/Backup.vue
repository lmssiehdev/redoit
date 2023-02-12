<script lang="ts" setup>
import { updateDB } from "@/firebase/func";
import { useStore } from "@/stores/habits.ts";
import { download, importBackup } from "@/utils/backup";
import { ref } from "vue";

const state = useStore();
const habitImportConfirmation = ref(false);
const habitClearningConfirmation = ref(false);

const backUp = () => {
	console.log(state.habits);
	download(JSON.stringify(state.habits), "habits.json", "text/plain");
};

const importHabits = (e) => {
	const promise = importBackup(e);
	if (!promise) return;
	console.log("importing...");
	promise.then((h) => {
		console.log(h);
		const habits = h;
		const activeHabits = Object.keys(habits).filter(
			(id) => !habits[id].archived
		);
		useStore().habits = habits;
		useStore().activeHabits = activeHabits;

		updateDB({
			habits: habits,
			activeHabits: activeHabits,
		}).then(() => (habitImportConfirmation.value = false));
	});
};

const clearHabits = () => {
	useStore().habits = {};
	useStore().activeHabits = [];

	console.log("clearing...");
	updateDB({
		habits: {},
		activeHabits: "",
	}).then(() => (habitClearningConfirmation.value = false));
};
</script>

<template>
	<div class="flex flex-wrap justify-around children:(w-[500px])">
		<div class="flex flex-col">
			<h5 class="text-center font-bold text-lg my-2">Backup zone</h5>
			<p class="flex-1 my-3">
				Here you can manually export your current data. You can use this as
				backup or to transfer your data to another browser or account.
			</p>

			<button
				@click="backUp"
				class="bg-green-200 hover:bg-green-100 text-green-800 text-lg font-bold py-2 px-3 rounded-md m-auto w-[200px]"
			>
				Backup Habits
			</button>
		</div>
		<div>
			<h5 class="text-center font-bold text-lg my-2 flex flex-col">
				Danger zone
			</h5>
			<p class="flex-1 my-3">
				Here you can import a previously exported JSON file or you can clear all
				data to start over again. An import overwrites all existing records and
				a database wipe removes the complete database. Make sure to always
				backup your data first to prevent data loss!
			</p>
			<div class="flex flex-wrap justify-around">
				<div>
					<div class="mb-2">
						<button
							v-if="!habitImportConfirmation"
							@click="
								habitImportConfirmation = true;
								habitClearningConfirmation = false;
							"
							class="bg-red-200 hover:bg-red-100 text-red-800 text-lg font-bold py-2 px-3 rounded-md m-auto w-[200px]"
						>
							Import Habits
						</button>
						<div
							v-else
							class="bg-red-600 text-white p-2 rounded-md flex items-center justify-center flex-wrap text-center"
						>
							<div>Really Overwrite Data?</div>
							<input
								class="hidden"
								type="file"
								accept=".json"
								@change="importHabits"
								ref="uploadInput"
							/>

							<div>
								<button
									class="bg-red-900 hover:bg-red-900/70 rounded-md px-2 py-1 mx-1"
									@click="$refs['uploadInput'].click()"
								>
									Yes
								</button>
								<button
									class="bg-red-900 hover:bg-red-900/70 rounded-md px-2 py-1 mx-1"
									@click="habitImportConfirmation = false"
								>
									No
								</button>
							</div>
						</div>
					</div>
				</div>
				<div class="mb-2">
					<button
						v-if="!habitClearningConfirmation"
						@click="
							habitClearningConfirmation = true;
							habitImportConfirmation = false;
						"
						class="bg-red-200 hover:bg-red-100 text-red-800 text-lg font-bold py-2 px-3 rounded-md m-auto w-[200px]"
					>
						Clear Habits
					</button>
					<div
						v-else
						class="bg-red-600 text-white p-2 rounded-md flex items-center justify-center flex-wrap text-center"
					>
						<div>Really Overwrite Data?</div>
						<div>
							<button
								class="bg-red-900 hover:bg-red-900/70 rounded-md px-2 py-1 mx-1"
								@click="clearHabits"
							>
								Yes
							</button>
							<button
								class="bg-red-900 hover:bg-red-900/70 rounded-md px-2 py-1 mx-1"
								@click="habitClearningConfirmation = false"
							>
								No
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
