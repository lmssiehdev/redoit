<script lang="ts" setup>
import { useStore } from "@/stores/habits.ts";
import {
	getDaysInMonth,
	dayOfWeekOffset,
	formatDate,
	LightenDarkenColor,
	isToday,
	isFuture,
} from "@/func";
import {
	CheckIcon,
	ChevronRightIcon,
	FastForwardIcon,
} from "@heroicons/vue/24/outline";
import { computed } from "vue";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { HiSolidCheck, MdDoneRound, OiCheck, OiChevronRight  } from "oh-vue-icons/icons";

addIcons(MdDoneRound, HiSolidCheck, OiCheck, OiChevronRight );

import info from "@/assets/info";
const { months, days } = info;

const props = defineProps({
	date: {
		type: Object,
		required: true,
	},
	habitId: {
		type: String,
		required: true,
	},
});

const state = useStore();
const habitStatus = (date: string) => state.habits[props.habitId].dates[date];
const habitColor = computed(() => state.habits[props.habitId].color);

const updateHabitStatus = (day: number, habitId: string) => {
	state.updateHabitStatus(
		formatDate(props.date.year, props.date.month + 1, day),
		habitId
	);
};

const styles = (day: number, date = props.date) => ({
	"bg-gray-300/40 text-dark dark:(!bg-white text-black)": isToday(
		new Date(`${date.month + 1}-${day}-${date.year}`)
	),
	"bg-dark-100 opacity-30 cursor-not-allowed": isFuture(
		new Date(`${date.month + 1}-${day}-${date.year}`)
	),
});
</script>

<template>
	<div
		div="calendar"
		class="py-4 text-sm md:text-base aspect-square sneed grid grid-cols-7 gap-1 auto-rows-auto text-center select-none"
	>
		<div
			v-for="day in days"
			:key="day"
			class="flex items-center justify-center cursor-pointer"
		>
			{{ day.substr(0, 2) }}
		</div>
		<div
			v-for="offSetDay in dayOfWeekOffset(date.year, date.month)"
			:key="offSetDay"
			class="flex items-center justify-center cursor-pointer"
		></div>
		<div
			v-for="day in getDaysInMonth(date.year, date.month)"
			:key="day"
			@click="updateHabitStatus(day, habitId)"
			class="flex items-center justify-center cursor-pointer w-full h-full font-bold"
		>
			<div
				v-if="habitStatus(`${date.year}-${date.month + 1}-${day}`) == 1"
				class="w-full h-full flex justify-center items-center"
				:style="[`background :` + habitColor]"
			>
				<oh-vue-icon name="oi-check" class="h-5 w-5 sm:(h-6 w-6) text-white" />
			</div>
			<div
				v-else-if="habitStatus(`${date.year}-${date.month + 1}-${day}`) == 2"
				class="w-full h-full flex justify-center items-center opacity-50"
				:style="[`background :` + habitColor]"
			>
				<oh-vue-icon name="oi-chevron-right" class="h-5 w-5 sm:(h-6 w-6) text-white" />
			</div>
			<div
				v-else
				class="text-size-[clamp(30px, 1vw,100px)]  bg-gray-100/50 text-dark-500 dark:(bg-gray-700/10 text-white) w-full h-full flex justify-center items-center"
				:class="styles(day)"
			>
				{{ day }}
			</div>
		</div>
	</div>
</template>

<style scoped>
.sneed div {
	aspect-ratio: 1/1;
}
</style>
