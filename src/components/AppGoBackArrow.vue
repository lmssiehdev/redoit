<script lang="ts" setup>
import { ArrowLeftIcon } from "@heroicons/vue/24/outline";

defineProps({
	text: {
		type: String,
		default: "Go back",
	},
});
</script>

<template>
	<div class="flex items-center cursor-pointer">
		<a class="flex items-center inline">
			<ArrowLeftIcon class="h-5 w-5 mr-4" />
			<span>{{ text }}</span>
		</a>
	</div>
</template>
