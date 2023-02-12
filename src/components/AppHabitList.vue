<script lang="ts" setup>
import info from "@/assets/info";
import AppWeeklyNavigation from "@/components/AppWeeklyNavigation.vue";
import { useStore } from "@/stores/habits";
import { type debounce } from "@/types/index";
import { calenderSize } from "@/utils/breakpoints";
import isMobile from "@/utils/isMobile";
import {
ChevronLeftIcon,
ChevronRightIcon as ChevronRightIconSolid
} from "@heroicons/vue/24/solid";
import { computed, watch } from "vue";
import AppDraggableHabits from "./AppDraggableHabits.vue";
import AddNewHabitModal from "./habits/AddNewHabitModal.vue";

const props = defineProps({
	date: {
		type: Object,
		required: true,
	},
	isArchived: {
		type: Boolean,
		default: false,
	},
});

defineEmits(["previous", "next", "changeDate"]);

const state = useStore();
const num = computed(() => (isMobile.value ? 3 : 8));

const getWeek = computed(() => {
	let arr = [];

	const dd = new Date(
		`${props.date.year}-${props.date.month + 1}-${props.date.day}`
	);
	const nextDate = new Date(dd.setDate(dd.getDate() + 1));

	for (let i = 0; i < calenderSize.value; i++) {
		const newDate = new Date(nextDate.setDate(nextDate.getDate() - 1));
		arr.unshift(
			`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
		);
	}
	return arr;
});

const archivedHabits = () => {
	const arr = Object.keys(state.habits).filter((s) => state.habits[s].archived);
	return arr || [];
};

const habits = computed(() => {
	if (props.isArchived) {
		return archivedHabits();
	}
	return state.activeHabits;
});

const now = new Date();

let updatingDebound: debounce;
watch(habits, () => {
	const today = {
		day: now.getDay(),
		date: now.getDate(),
		month: now.getMonth(),
		year: now.getFullYear(),
	};
	const f = `${today.year}-${today.month + 1}-${today.date}`;

	Object.keys(state.habits).forEach((habit: string) => {
		if (
			!state.habits[habit].activeDays[today.day] &&
			!state.habits[habit].dates[f]
		) {
			clearTimeout(updatingDebound);
			updatingDebound = setTimeout(() => {
				state.updateHabitStatus(f, habit, 2);
				console.log('updated')
			}, 2000);
		}
	});
});
</script>

<template>
	<div class="pb-[10em]">
		<!-- <div class="bg-green-100 text-green-800 p-5 m-5 rounded-2xl flex">
            <div>
                <div class="font-bold text-xl">You are almost there</div>
                <div class="text-sm mt-1">1/3 day goals completed</div>
            </div>
            <div class="flex-1 flex items-center justify-center">32%</div>
        </div> -->
		<div class="w-full select-none">
			<AppWeeklyNavigation
				v-if="isMobile"
				:date="date"
				:week="getWeek"
				@previous="$emit('changeDate', -1)"
				@next="$emit('changeDate', 1)"
				class=" mb-3"
			/>
			<div class="rounded">
				<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
					<div class="flex items-center justify-end">
						<button
							type="button"
							v-if="!isMobile"
							class="p-1 cursor-pointer flex justify-center items-center hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
							@click="$emit('changeDate', -1)"
						>
							<ChevronLeftIcon class="h-8 w-8" />
						</button>
					</div>
					<div
						class="flex justify-center items-center children:flex-1 children:text-center children:py-2"
					>
						<div v-for="n in getWeek" class="text-sm">
							<!-- <div>{{ info.months[new Date(n).getMonth() + 1].substr(0, 3) }}</div> -->
							<div>{{ info.days[new Date(n).getDay() + 1].substr(0, 3) }}</div>
							<div>{{ new Date(n).getDate() }}</div>
						</div>
					</div>
					<div class="flex items-center justify-end" v-if="!isMobile">
						<button
							type="button"
							class="p-1 cursor-pointer flex justify-center items-center hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
							@click="$emit('changeDate', 1)"
						>
							<ChevronRightIconSolid class="h-8 w-8" />
						</button>
					</div>
				</div>
			</div>
			<div class="rounded overflow-hidden bg-gray-100/30 dark:(bg-dark-100/10)">
				<AppDraggableHabits
					:active-habits="habits"
					:calendar="getWeek" :is-archived="isArchived"  />
			</div>
			<div class="rounded">
				<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
					<div>
						<AddNewHabitModal :isArchived="isArchived" />
					</div>
					<div
						class="flex justify-center items-center children:flex-1 children:text-center children:py-2"
					>
						<div v-for="n in getWeek" :key="n" class="text-sm">
							<template v-if="isArchived">
								{{ state.totalArchivedHabitsCompletedInDay(n) }}</template
							>
							<template v-else>
								{{ state.totalHabitsCompletedInDay(n) }}</template
							>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
</template>
