<script lang="ts" setup>
import { useStore } from "@/stores/habits";
import HabitsView from "./habits/HabitsView.vue";
import { ChevronRightIcon } from "@heroicons/vue/24/solid";
import { usePointerSwipe } from "@vueuse/core";
import type { SwipeDirection } from "@vueuse/core";
import { computed, ref } from "vue";

const state = useStore();

const target = ref<Element | null>(null);
const container = ref<HTMLElement | null>(null);
const containerWidth = computed(() => container.value?.offsetWidth);
const translate = ref("0");
const opacity = ref(1);
const reset = () => {
	translate.value = "0%";
	opacity.value = 1;
};
const { distanceX, isSwiping } = usePointerSwipe(target, {
	onSwipe(e: PointerEvent) {
		if (containerWidth.value) {
			if (distanceX.value < 0) {
				const distance = Math.abs(distanceX.value);
				translate.value = `${(1.25 - distance / containerWidth.value) * 100}%`;
				opacity.value = 1.25 - distance / containerWidth.value;
			} else {
				translate.value = "0";
				opacity.value = 1;
			}
		}
	},
	onSwipeEnd(e: PointerEvent, direction: SwipeDirection) {
		if (
			distanceX.value < 0 &&
			containerWidth.value &&
			Math.abs(distanceX.value) / containerWidth.value >= 0.5
		) {
			translate.value = "100%";
			opacity.value = 0;
		} else {
			translate.value = "0";
			opacity.value = 1;
		}
	},
});
</script>

<template>
	<div>habits very kewl habitss</div>
	<div>
		<div
			class="flex item-center justify-between bg-purple-700 text-purple-100 overflow-hidden"
			ref="container"
		>
			<div
				class="w-[3em] bg-indigo-700 text-indigo-100 py-5 top-0 right-0"
				style=""
			>
				edit
			</div>
			<div
				class="w-[100%] py-5 px-4 flex-1 absolute"
				ref="target"
				:style="{ transform: `translate(${translate})`, opacity }"
			>
				Something
				<ChevronRightIcon class="h-5 w-5" />
			</div>
			<div
				class="w-[3em] bg-green-700 text-green-100 py-5 absolute top-0 left-0"
				style="transform: translateX(-100%)"
			>
				mark
			</div>
		</div>
		<div v-for="habit in state.habits">
			<div
				:style="{ backgroundColor: habit.color }"
				class="py-5 px-4 flex item-center justify-between"
			>
				<div class="cursor-pointer">
					{{ habit.name }}
				</div>
				<ChevronRightIcon class="h-5 w-5" />
			</div>
		</div>
	</div>
</template>
