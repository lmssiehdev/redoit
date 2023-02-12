<script lang="ts" setup>
import { isMobile } from "@/utils/breakpoints";
import EditHabitModal from "@/components/UI/modals/EditHabitModal.vue"
import AddHabitModal from "@/components/UI/modals/AddHabitModal.vue"
import {
ArchiveBoxIcon,
Cog6ToothIcon,
HomeIcon,
PlusIcon,
} from "@heroicons/vue/24/outline";
import { PencilIcon } from "@heroicons/vue/24/solid";
import { computed, ref } from "@vue/reactivity";
import { useRoute } from "vue-router";
import { useStore } from "@/stores/habits";

const state = useStore();
const router = useRoute();

const routerName = computed(() => router.path);
const habitId = computed(() => router.params.id);

const addHabitModalOpen = ref(false);
const editHabitModalOpen = ref(false);

const handleOpen = () => {
	if(habitId) {
		editHabitModalOpen.value = true;
		return;
	}
	addHabitModalOpen.value = true;
}

const handleClose = () => {
	addHabitModalOpen.value = false;
	editHabitModalOpen.value = false;
}
</script>

<template>
<div>
	<AddHabitModal :is-open="addHabitModalOpen" @close="handleClose" />
	<EditHabitModal :habitId="habitId" :is-open="editHabitModalOpen" @close="handleClose" />
	<div
		v-if="isMobile"
		class="fixed bottom-0 z-10 w-full bg-transparent text-center"
	>
		<div class="bg-white text-black dark:(bg-dark-800 text-white)">
			<div
				class="flex justify-center items-center text-center bg-transparentshadow-md m-auto max-w-[500px] py-1"
			>
				<div class="flex-1" :class="{ 'text-green-600': routerName == '/' }">
					<router-link
						to="/"
						class="flex flex-col justify-center items-center hover:text-green-600"
					>
						<HomeIcon class="h-6 w-6 cursor-pointer" />
						<span class="text-sm pt-1"> Home </span>
					</router-link>
				</div>
				<div class="flex-1">
					<router-link
						to="/archive"
						:class="{ 'text-green-600': routerName == '/archive' }"
						class="flex flex-col justify-center items-center hover:text-green-600"
					>
						<ArchiveBoxIcon
							class="h-6 w-6 cursor-pointer"
						/>
						<span class="text-sm pt-1"> Archive </span>
					</router-link>
				</div>

				<div class="flex-1">
					<router-link
						to="/settings"
						:class="{ 'text-green-600': routerName == '/settings' }"
						class="flex flex-col justify-center items-center hover:text-green-600"
					>
						<Cog6ToothIcon
							class="h-6 w-6 cursor-pointer"
						/>
						<span class="text-sm pt-1"> Settings </span>
					</router-link>
				</div>
				<div class="flex-1 relative">
					<div class="invisible py-4">.</div>
					<div
						@click="handleOpen"
						class="flex-grow inline-block text-center flex justify-center absolute left-0 right-0 top-[-30%]"
					>
						<div
							class="w-15 h-15 flex justify-center items-center bg-green-600 text-white rounded-full"
							:style="{backgroundColor: state.habits[habitId]?.color || ''}"
						>
							<PencilIcon v-if="habitId" class="h-6 w-6 cursor-pointer" />
							<PlusIcon v-else class="h-6 w-6 cursor-pointer" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
