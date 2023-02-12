<script lang="ts" setup>
import Dropdown from "@/components/UI/Dropdown.vue";
import { useStore } from "@/stores/habits";
import { CheckIcon } from "@heroicons/vue/24/outline";
import { FireIcon } from "@heroicons/vue/24/solid";
import { computed } from "vue";

const state = useStore();

const totalCompletedHabits = computed(() => {
	if (!state.habits) return;
	let count = 0;
	Object.keys(state.habits).forEach((habit) => {
		count += Object.values(state.habits[habit].dates).filter((v) => v).length;
	});
	return count;
});
</script>

<template>
	<div
		class="max-w-[1400px] flex justify-between items-center py-5 px-2 mb-4 border-light-400 border-b-2 m-auto"
	>
		<div>
			<router-link to="/" class="flex">
				<div class="flex items-center">
					<h1 class="font-bold text-xl">REDOIT!</h1>
					<CheckIcon class="w-6 h-6 mx-1 cursor-pointer" />
				</div>
				<div class="flex items-end">
					<span class="text-xs text-gray-300">[Beta]</span>
				</div>
			</router-link>
		</div>
		<div class="flex items-center gap-2">
			<div class="flex justify-between items-center">
				<div class="flex items-center">
					{{ totalCompletedHabits }}
					<FireIcon class="w-5 h-5 mx-1 cursor-pointer" />
				</div>
				<div class="flex items-center justify-between cursor-pointer p-1">
					<Dropdown username="user" />
				</div>
			</div>
		</div>
	</div>
</template>
