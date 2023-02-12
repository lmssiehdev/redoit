<script lang="ts" setup>
import info from "@/assets/info";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/vue/24/solid";
import { computed } from "vue";

const { months } = info;

const props = defineProps({
	date: { type: Object, required: true },
	week: { type: Array, required: true },
});

defineEmits(["previous", "next"]);

const currentWeekDate = computed(() => {
	const first = new Date(props.week[0]);
	const last = new Date(props.week[props.week.length - 1]);

	return `${first.getDate()}
    -
    ${last.getDate()} ${info.months[first.getMonth() + 1]} `;
});
</script>

<template>
	<div class="flex items-center justify-center">
		<button
			type="button"
			class="p-1  cursor-pointer flex justify-center items-center mr-3  focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-500"
			@click="$emit('previous')"
		>
			<ChevronLeftIcon class="h-6 w-6" />
		</button>

		<div class=" text-center flex-1">
			{{ currentWeekDate }}
		</div>

		<button
			type="button"
			class="p-1 cursor-pointer flex justify-center items-center mr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-500"
			@click="$emit('next')"
		>
			<ChevronRightIcon class="h-6 w-6" />
		</button>
	</div>
</template>
