<script lang="ts" setup>
import info from "@/assets/info";
import AppWeeklyNavigation from "@/components/AppWeeklyNavigation.vue";
import { updateDB } from "@/firebase/func";
import { applyDrag, LightenColor } from "@/func";
import { useStore } from "@/stores/habits";
import { calenderSize } from "@/utils/breakpoints";
import isMobile from "@/utils/isMobile";
import { CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import {
ChevronLeftIcon,
ChevronRightIcon as ChevronRightIconSolid,
FireIcon,
PencilIcon
} from "@heroicons/vue/24/solid";
import { computed, Ref, ref, watch } from "vue";
import { Container, Draggable } from "vue-dndrop";
import AddNewHabit from "./AddNewHabit.vue";
import AddNewHabitModal from "./habits/AddNewHabitModal.vue";

const props = defineProps({
	date: {
		type: Object,
		required: true,
	},
	isArchived: {
		type: Boolean,
		default: false,
	},
});

defineEmits(["previous", "next", "changeDate"]);

const state = useStore();
const num = computed(() => (isMobile.value ? 3 : 8));

const getWeek = computed(() => {
	let arr = [];

	const dd = new Date(
		`${props.date.year}-${props.date.month + 1}-${props.date.day}`
	);
	const nextDate = new Date(dd.setDate(dd.getDate() + 1));

	for (let i = 0; i < calenderSize.value; i++) {
		const newDate = new Date(nextDate.setDate(nextDate.getDate() - 1));
		arr.unshift(
			`${newDate.getFullYear()}-${newDate.getMonth() + 1}-${newDate.getDate()}`
		);
	}
	return arr;
});

const currentWeekDate = computed(() => {
	const first = new Date(getWeek.value[0]);
	const last = new Date(getWeek.value[getWeek.value.length - 1]);

	return `${first.getDate()} 
      -
      ${last.getDate()} ${info.months[first.getMonth() + 1]} `;
});

let debounce = null;
async function onDrop(dropResult) {
	state.activeHabits = applyDrag(state.activeHabits, dropResult);
	clearTimeout(debounce);
	debounce = setTimeout((_) => {
		updateDB({ activeHabits: state.activeHabits.join() });
	}, 1300);
}

const archivedHabits = () => {
	const arr = Object.keys(state.habits).filter((s) => state.habits[s].archived);
	return arr || [];
};

const habits = computed(() => {
	if (props.isArchived) {
		return archivedHabits();
	}
	return state.activeHabits;
});

const now = new Date();

let updatingDebound = null;
watch(habits, () => {
	const today = {
		day: now.getDay(),
		date: now.getDate(),
		month: now.getMonth(),
		year: now.getFullYear(),
	};
	const f = `${today.year}-${today.month + 1}-${today.date}`;

	Object.keys(state.habits).forEach((habit: string) => {
		if (
			!state.habits[habit].activeDays[today.day] &&
			!state.habits[habit].dates[f]
		) {
			clearTimeout(updatingDebound);
			updatingDebound = setTimeout(() => {
				state.updateHabitStatus(f, habit, 2);
			}, 2000);
		}
	});
});

const showNewModal = ref(true);
const openEditHabitModal = ref(false);
const habitId: Ref<string | null> = ref(null);

const showEditHabitModal = (id: string) => {
	openEditHabitModal.value = true;
	habitId.value = id;
	console.log("worked", id, openEditHabitModal);
};

const isOpen = ref(false);
const buyPremiumModal = ref(false);
const openModal = () => (isOpen.value = true);
const closeModal = () => {
	isOpen.value = false;
	//   habitNameErr.value = null;
	//   newHabit.value.name = ''
};
const openAddHabitModal = () => {
	if (!user.user.isPremium && Object.keys(state.activeHabits).length > 2) {
		closeModal();
		buyPremiumModal.value = true;
		console.log("please buy premium");
		return;
	}

	openModal();
};

function editHabit(payload) {
	console.log("clicked habit", payload);
	const { id, name, color, activeDays } = payload;
	state.updateHabit(id, name, color, activeDays);
	openEditHabitModal.value = false;
}

</script>

<template>
	<div class="pb-[10em]">
		<!-- <div class="bg-green-100 text-green-800 p-5 m-5 rounded-2xl flex">
              <div>
                  <div class="font-bold text-xl">You are almost there</div>
                  <div class="text-sm mt-1">1/3 day goals completed</div>
              </div>
              <div class="flex-1 flex items-center justify-center">32%</div>
          </div> -->
		<div class="w-full select-none">
			<AppWeeklyNavigation
				v-if="isMobile"
				:date="date"
				:week="getWeek"
				@previous="$emit('changeDate', -1)"
				@next="$emit('changeDate', 1)"
			/>
			<div class="rounded">
				<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
					<div class="flex items-center justify-end">
						<button
							type="button"
							v-if="!isMobile"
							class="p-1 cursor-pointer flex justify-center items-center hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
							@click="$emit('changeDate', -1)"
						>
							<ChevronLeftIcon class="h-8 w-8" />
						</button>
					</div>
					<div
						class="flex justify-center items-center children:flex-1 children:text-center children:py-2"
					>
						<div v-for="n in getWeek" class="text-sm">
							<!-- <div>{{ info.months[new Date(n).getMonth() + 1].substr(0, 3) }}</div> -->
							<div>{{ info.days[new Date(n).getDay() + 1].substr(0, 3) }}</div>
							<div>{{ new Date(n).getDate() }}</div>
						</div>
					</div>
					<div class="flex items-center justify-end" v-if="!isMobile">
						<button
							type="button"
							class="p-1 cursor-pointer flex justify-center items-center hover:bg-opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500"
							@click="$emit('changeDate', 1)"
						>
							<ChevronRightIconSolid class="h-8 w-8" />
						</button>
					</div>
				</div>
			</div>
			<div class="rounded overflow-hidden bg-gray-100/30 dark:(bg-dark-100/10)">
				<Container
					@drop="onDrop"
					drag-handle-selector=".column-drag-handle"
					@drop-not-allowed="false"
					lock-axis="y"
				>
					<Draggable v-for="habit in habits" :key="habit">
						<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
							<div
								class="flex items-center justify-between overflow-hidden column-drag-handle select-none"
								draggable="false"
							>
								<router-link
									:to="`/habitPage/${habit}`"
									class="flex items-center h-full whitespace-nowrap overflow-hidden px-2 border-l-4 drag"
									:style="[{ 'border-color': state.habits[habit].color }]"
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
								class="flex justify-center items-center children:flex-1 children:text-center"
							>
								<div
									v-for="(day, index) in getWeek"
									@click="state.updateHabitStatus(day, habit)"
									class="text-white children:(flex items-center justify-center py-2 w-full h-full)"
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
								class="flex items-center justify-center font-bold"
								v-if="!isMobile"
							>
								<FireIcon class="w-5 h-5 cursor-pointer" />
								<span>{{ state.currentStreak(habit) }}</span>
							</div>
						</div>
					</Draggable>
				</Container>
			</div>
			<div class="rounded">
				<div class="grid grid-cols-[2fr,2fr] sm:grid-cols-[1fr,2fr,40px]">
					<div>
						<AddNewHabitModal :isArchived="isArchived" />
					</div>
					<div
						class="flex justify-center items-center children:flex-1 children:text-center children:py-2"
					>
						<div v-for="n in getWeek" class="text-sm">
							<template v-if="isArchived">
								{{ state.totalArchivedHabitsCompletedInDay(n) }}</template
							>
							<template v-else>
								{{ state.totalHabitsCompletedInDay(n) }}</template
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<AddNewHabit
		:isOpen="isOpen"
		@close="isOpen = false"
		heading-text="Create Habit"
	/>

	<AddNewHabit
		:habitId="habitId"
		:isOpen="openEditHabitModal"
		@close="openEditHabitModal = false"
		heading-text="Edit Habit"
	/>
</template>
