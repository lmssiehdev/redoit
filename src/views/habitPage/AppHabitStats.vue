<script setup lang="ts">
import { useStore } from "@/stores/habits";
import {
	CalendarIcon,
	CheckIcon,
	FireIcon,
	BoltIcon,
} from "@heroicons/vue/24/outline";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { IoCalendarSharp, HiSolidFire, MdDoneallRound, MdPercentRound   } from 'oh-vue-icons/icons';
import { computed } from "vue";
import {
	convertHex,
	LightenDarkenColor,
	lightOrDark,
	percentage,
	dateDiffInDays,
} from "@/func";

addIcons(IoCalendarSharp, HiSolidFire, MdDoneallRound, MdPercentRound) 

const props = defineProps({
	habitId: {
		type: String,
		required: true,
	},
});

const state = useStore();
const { longestStreak, currentStreak, successfulDays } = useStore();

const habitColor = computed(() => state.habits[props.habitId].color);

const styles = computed(() => {
	let color = LightenDarkenColor(habitColor.value, 60);
	color = convertHex(color, 0.4);
	if (lightOrDark(habitColor.value) == "light") {
		color = LightenDarkenColor(habitColor.value, -50);
		color = convertHex(color, 0.8);
	}
	return [
		{
			color: habitColor.value,
		},
		{
			backgroundColor: color,
		},
	];
});

const calculatePercentage = computed(() => {
	const habitStartDate = state.minDate(state.habits[props.habitId].dates);
	if(!habitStartDate) throw new Error;
	const difference = dateDiffInDays(new Date(habitStartDate), new Date());
	const completedHabits = successfulDays(props.habitId);
	return percentage(completedHabits, difference);
});
</script>

<template>
  <div class="grid grid-cols-2 gap-2">
  <div
			:class="{
					'bg-opacity-20': lightOrDark(habitColor) == 'light',
				}"
			:style="styles"
  		class="rounded relative overflow-hidden flex items-center flex-1 p-2 text-sm">
			<div
				class="absolute -right-5 transform scale-250 -rotate-30 opacity-50 flex p-3 block rounded-full h-auto inline mr-4"
			>
				<oh-vue-icon name="hi-solid-fire" class="h-6 w-6" />
			</div>
			<div class="font-varela-round">
				<span class="font-bold"> Current Streak </span>
				<div>
					<span class="font-bold">{{ currentStreak(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>
   <div
			:class="{
					'bg-opacity-20': lightOrDark(habitColor) == 'light',
				}"
			:style="styles"
  		class="rounded relative overflow-hidden flex items-center flex-1 p-2 text-sm">
			<div
				class="absolute -right-5 transform scale-250 -rotate-30 opacity-50 flex p-3 block rounded-full h-auto inline mr-4"
			>
				<oh-vue-icon name="md-doneall-round" class="h-6 w-6" />
			</div>
			<div class="font-varela-round">
				<span class="font-bold"> Successful </span>
				<div>
					<span class="font-bold">{{ successfulDays(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>  <div
			:class="{
					'bg-opacity-20': lightOrDark(habitColor) == 'light',
				}"
			:style="styles"
  		class="rounded relative overflow-hidden flex items-center flex-1 p-2 text-sm">
			<div
				class="absolute -right-5 bottom-0 transform scale-250 -rotate-30 opacity-50 flex p-3 block rounded-full h-auto inline mr-4"
			>
				<oh-vue-icon name="io-calendar-sharp" class="h-6 w-6" />
			</div>
			<div class="font-varela-round">
				<span class="font-bold"> Longest streak </span>
				<div>
					<span class="font-bold">{{  longestStreak(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>   <div
			:class="{
					'bg-opacity-20': lightOrDark(habitColor) == 'light',
				}"
			:style="styles"
  		class="rounded relative overflow-hidden flex items-center flex-1 p-2 text-sm">
			<div
				class="absolute -right-5 transform scale-250 -rotate-30 opacity-50 flex p-3 block rounded-full h-auto inline mr-4"
			>
				<oh-vue-icon name="md-percent-round" class="h-6 w-6" />
			</div>
			<div class="font-varela-round">
				<span class="font-bold">  Completion rate </span>
				<div>
					<span class="font-bold">{{  calculatePercentage }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>
	</div>
	<div class="grid grid-cols-2" v-if="false">
		<div class="flex items-center flex-1 mt-3 p-1 text-sm">
			<div
				:style="styles"
				:class="{
					'bg-opacity-20': lightOrDark(habitColor) == 'light',
				}"
				class="flex p-3 block rounded-full h-auto inline mr-4"
			>
				<FireIcon class="h-6 w-6" />
			</div>
			<div>
				<span> Current Streak </span>
				<div>
					<span class="font-bold">{{ currentStreak(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>
		<div class="flex items-center flex-1 mt-3 p-1 text-sm">
			<div class="flex p-3 inline-block rounded-full mr-2" :style="styles">
				<CalendarIcon class="h-6 w-6" />
			</div>
			<div>
				<span> Best Streak </span>
				<div>
					<span class="font-bold">{{ longestStreak(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>
		<div class="flex items-center flex-1 mt-3 p-1 text-sm">
			<div
				:style="styles"
				class="flex p-3 block rounded-full h-auto inline mr-2"
			>
				<CheckIcon class="h-6 w-6" />
			</div>
			<div>
				<span> Successful </span>
				<div>
					<span class="font-bold">{{ successfulDays(habitId) }}</span>
					<span class="text-sm"> days</span>
				</div>
			</div>
		</div>
		<div class="flex items-center flex-1 mt-3 p-1 text-sm">
			<div :style="styles" class="flex p-3 inline-block rounded-full mr-2">
				<BoltIcon class="h-6 w-6" />
			</div>
			<div>
				<span> Completion rate </span>
				<div>
					<span class="font-bold">{{ calculatePercentage }}</span>
				</div>
			</div>
		</div>
	</div>
</template>
