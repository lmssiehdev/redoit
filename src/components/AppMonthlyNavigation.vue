<script lang="ts" setup>
import info from "@/assets/info";
import {
	ChevronRightIcon,
	ChevronLeftIcon,
	RefreshIcon,
} from "@heroicons/vue/24/solid";

const { months } = info;

const props = defineProps({
	date: { type: Object, required: true },
});

defineEmits(["previous", "next"]);
</script>

<template>
	<div>
		<div class="flex items-center justify-between select-none">
		<button
			type="button"
			class="cursor-pointer flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-500"
			@click="$emit('previous')"
			>
			<ChevronLeftIcon class="h-6 w-6" />
		</button>
		<div class="text-lg font-bold">
			{{ months[date.month + 1]?.substr(0, 3) }} <span class="text-sm">{{ date.year }}</span>
		</div>
		<button
			type="button"
			class="cursor-pointer flex justify-center items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-light-500"
			@click="$emit('next')"
		>
			<ChevronRightIcon class="h-6 w-6" />
		</button>
		</div>
	</div>
</template>
