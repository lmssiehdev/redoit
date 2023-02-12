<script lang="ts" setup>
import AppHabitList from "@/components/AppHabitList.vue";
import AppMainPageHeading from "@/components/AppMainPageHeading.vue";
import { useStore } from "@/stores/habits.ts";
import { reactive } from "vue";

const state = useStore();

const now = new Date();

const dd = reactive({
	day: now.getDate(),
	month: now.getMonth(),
	year: now.getFullYear(),
});

// const breakpoints = useBreakpoints(breakpointsTailwind);
// const sm = breakpoints.smaller('sm')
// const md = breakpoints.between('sm', 'md')
// const lg = breakpoints.between('md', 'lg')
// const xl = breakpoints.greater('xl')

// const calenderSize = computed(() => {
//   const size = ref(8)

//   if (sm.value) {
//     size.value = 4
//   } else if (md.value) {
//     size.value = 5
//   } else if (lg.value) {
//     size.value = 6
//   } else if (xl.value) {
//     size.value = 8
//   }

//   return size.value
// })
const changeDate = (num: number) => {
	const date = new Date(`${dd.year}-${dd.month + 1}-${dd.day}`);
	const newDate = new Date(date.setDate(date.getDate() + num));

	if (new Date().getTime() <= new Date(newDate).getTime()) return;

	dd.day = newDate.getDate();
	dd.month = newDate.getMonth();
	dd.year = newDate.getFullYear();
};
</script>

<template>
	<div class="max-w-[1400px] m-auto sm:px-2 px-3">
			<AppMainPageHeading text="Archive" class="py-7" />
			<div v-if="!state.archivedHabitsGetter.length">
				<p class="max-w-[500px] m-auto text-center">
					No habits have been Archived.<br />
					<!-- Archive is the perfect place to store your paused habits or habits you've successfully formed and whose data
          you want to store for posterity :) -->
				</p>
			</div>
			<div v-else>
				<!-- <DailyHabitView /> -->

				<AppHabitList :isArchived="true" :date="dd" @changeDate="changeDate" />
			</div>
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
