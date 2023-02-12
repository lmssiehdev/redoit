<script setup lang="ts">
import { computed } from "vue";
import info from "@/assets/info";
import { isToday, isWeekend } from "@/func.ts";
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
	date: {
		type: Object,
		required: true,
	},
	week: {
		type: Array,
		required: true,
	},
});

const emits = defineEmits(["changeDate"]);
</script>

<template>
	<div class="grid grid-cols-[1fr_3fr_40px] select-none">
		<div class="flex items-center justify-start md:min-w-[12.5em] min-w-[9em]">
			<div></div>
			<div class="flex items-center h-full ml-auto">
				<ChevronLeftIcon
					class="h-10 w-10 cursor-pointer"
					@click="$emit('changeDate', -1)"
				/>
			</div>
		</div>

		<div class="flex justify-around">
			<div
				v-for="day in week"
				class="text-center w-[100%] bg-white bg-opacity-20 rounded-sm font-semibold"
				:class="{
					'!bg-green-100 !text-green-900': isToday(new Date(day)),
					'bg-white bg-opacity-30': isWeekend(day),
				}"
			>
				<div>{{ info.months[new Date(day).getMonth() + 1].substr(0, 3) }}</div>
				<div>{{ new Date(day).getDate() }}</div>
				<div>{{ info.days[new Date(day).getDay() + 1].substr(0, 3) }}</div>
			</div>
		</div>
		<div class="flex items-center justify-center">
			<ChevronRightIcon
				class="h-10 w-10 cursor-pointer"
				@click="$emit('changeDate', 1)"
			/>
		</div>
	</div>
</template>

<style></style>
