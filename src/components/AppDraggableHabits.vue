<script lang="ts" setup>
import { useStore } from "@/stores/habits";
import { LightenColor } from "@/utils/colors";
import isMobile from "@/utils/isMobile";
import { CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { FireIcon, PencilIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";
import { Container, Draggable } from "vue-dndrop";
import EditHabitModal from "./UI/modals/EditHabitModal.vue";

interface dragResult {
  removedIndex: number;
  addedIndex: number;
  payload: any;
}

defineProps<{
  activeHabits: string[],
  isArchived: boolean,
  calendar: string[]
}>()

const state = useStore();
const habitId = ref<string>('');
const openEditHabitModal = ref<boolean>(false);

const showEditHabitModal = (id: string) => {
	habitId.value = id;
	openEditHabitModal.value = true;
};

function applyDrag(arr: any[], dragResult: dragResult) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];
  let itemToAdd = payload;

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
}

async function onDrop(dropResult: dragResult) {
  state.activeHabits = applyDrag(state.activeHabits, dropResult);
}

console.log('I ran')
</script>

<template>
	<Container
		@drop="onDrop"
		drag-handle-selector=".column-drag-handle"
		@drop-not-allowed="false"
		lock-axis="y"
	>
		<Draggable v-for="habit in activeHabits || []" :key="habit">
			<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
				<div
					class="flex items-center justify-between overflow-hidden column-drag-handle select-none"
					draggable="false"
				>
					<router-link
						:to="`/habit/${habit}`"
						class="flex items-center h-full whitespace-nowrap overflow-hidden px-2 py-3 border-l-4 drag"
						:style="[{ 'border-color': state.habits[habit].color }]"
						draggable="false"
					>
						{{ state.habits[habit].name }}
					</router-link>
					<button
						v-if="!isMobile"
						class="flex justify-center items-center mx-2 focus:outline-none"
						@click="showEditHabitModal(habit)"
					>
						<PencilIcon class="h-5 w-5" />
					</button>
				</div>
				<div
					class="flex justify-center children:flex-1 children:text-center"
				>
					<div
						v-for="(day, index) in calendar"
						@click="!isArchived && state.updateHabitStatus(day, habit)"
						:class="{'cursor-not-allowed': isArchived}"
						class="text-white cursor-pointer children:(flex items-center justify-center w-full h-full)"
					>
						<div v-if="!state.habits[habit]?.dates[day]" class="">
							<div class="invisible">.</div>
						</div>
						<div
							v-else-if="state.habits[habit]?.dates[day] == 1"
							:style="[{ backgroundColor: state.habits[habit]?.color }]"
						>
							<CheckIcon class="h-6 w-6" />
						</div>
						<div
							v-else-if="state.habits[habit]?.dates[day] == 2"
							:style="[
								{
									backgroundColor: LightenColor(
										state.habits[habit]?.color,
										0
									),
								},
							]"
							class="opacity-50"
						>
							<ChevronRightIcon class="h-6 w-6" />
						</div>
					</div>
				</div>
				<div
					class="flex gap-1 items-center justify-center font-bold text-sm"
					v-if="!isMobile"
				>
				<FireIcon class="w-4 h-4" />
				<span>{{ state.currentStreak(habit) }}</span>
				</div>
			</div>
		</Draggable>
</Container>

	<EditHabitModal :is-open="openEditHabitModal" @close="openEditHabitModal = false" :habit-id="habitId" />
</template>
