<script lang="ts" setup>
import AddHabitModal from "@/components/UI/modals/AddHabitModal.vue";
import isMobile from "@/utils/isMobile";
import { PlusIcon } from "@heroicons/vue/24/solid";
import { ref } from "vue";

defineProps({
	isArchived: {
		type: Boolean,
		required: false,
		default: false,
	},
});

const addHabitModalOpen = ref(false);
const handleOpenModal = () => {

  addHabitModalOpen.value = true;

}
</script>

<template>
	<div v-if="!isMobile && !isArchived">
		<button
			type="button"
			@click="handleOpenModal"
			class="flex items-center justify-center bg-red-700 w-full text-green-50 dark:(bg-dark-300 w-full text-white hover:bg-opacity-30) font-bold rounded-lg my-1 py-2  hover:shadow-lg"
		>
			<PlusIcon class="h-5 w-5 mr-3" />Add New Habit
		</button>
	</div>

	<AddHabitModal :is-open="addHabitModalOpen" @close="addHabitModalOpen = false"  />
  
</template>
