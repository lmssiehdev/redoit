<script lang="ts" setup>
import AppHabitList from "@/components/AppHabitList.vue";
import AppMainPageHeading from "@/components/AppMainPageHeading.vue";
import { useStore } from "@/stores/habits";
import isNativePlatform from '@/utils/isNativePlatform';
import NoHabitsFound from "@/views/mainPage/NoHabitsFound.vue";
import { reactive, ref } from "vue";

const state = useStore();

const now = new Date();
const dd = reactive({
	day: now.getDate(),
	month: now.getMonth(),
	year: now.getFullYear(),
});

const changeDate = (num: number) => {
	const date = new Date(`${dd.year}-${dd.month + 1}-${dd.day}`);
	const newDate = new Date(date.setDate(date.getDate() + num));

	if (new Date().getTime() <= new Date(newDate).getTime()) return;

	dd.day = newDate.getDate();
	dd.month = newDate.getMonth();
	dd.year = newDate.getFullYear();
};

// watch(uid, () => {
// 	const getActiveHabits = Object.keys(state.habits).filter(
// 		(s) => !state.habits[s].archived
// 	);
// 	if (!getActiveHabits || getActiveHabits.length > state.activeHabits.length) {
// 		console.log("active habits dont match  ");
// 		 state.activeHabits = getActiveHabits
// 	}
// },{
// 	immediate: true
// });

// const feed = (habitId: string, date: string) => {
// 	const today = isToday(new Date(date));
// 	if (!today) return;

// 	const isActive = state.habits[habitId].activeDays[new Date(date).getDay()];
// 	const isMarked = state.habits[habitId].dates[date];

// 	if (!isActive && today && !isMarked) {
// 		console.log(
// 			"sneed",
// 			state.habits[habitId]?.name,
// 			state.habits[habitId]?.dates[date]
// 		);
// 		state.updateHabitStatus(date, habitId);
// 	}
// };

const showNewHabit = ref(false);
// console.log("backup", { redoitBackup: true, ...habits.value });


</script>

<template>
	<div
			:class="{'sm:px-2 px-3': !isNativePlatform }"
			class="max-w-[1400px] w-full h-full m-auto"
		>
			<AppMainPageHeading class="py-7" text="My Habits" />
			<div v-if="!useStore().activeHabits.length">
				<NoHabitsFound />
			</div>
			<div class="mb-10" v-else>
				<AppHabitList v-if="true" :date="dd" @change-date="changeDate" />
			</div>
		<!-- <AppAddNewHabit v-if="showNewHabit" @close="showNewHabit = false" /> -->
	</div>
</template>

<style lang="scss">
.clip {
	clip-path: polygon(100% 100%, 0 0, 0 100%);
}

.on-hover {
	div {
		display: none;
	}
}
</style>
