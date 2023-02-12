<script lang="ts" setup>
import info from "@/assets/info";
import AppGoBackArrow from "@/components/AppGoBackArrow.vue";
import AppMonthlyCalendar from "@/components/AppMonthlyCalendar.vue";
import AppMonthlyNavigation from "@/components/AppMonthlyNavigation.vue";
import { useStore } from "@/stores/habits";
import isMobile from "@/utils/isMobile";
import { EllipsisVerticalIcon, PencilIcon, ArchiveBoxIcon } from "@heroicons/vue/24/solid";
import { computed, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppHabitStats from "./habitPage/AppHabitStats.vue";
import AppWeeklyChart from "./habitPage/AppWeeklyChart.vue";
import EditHabitModal from "@/components/UI/modals/EditHabitModal.vue";
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { MdKeyboardarrowdownRound } from 'oh-vue-icons/icons';

addIcons(MdKeyboardarrowdownRound);

const props = defineProps({
	habitId: {
		type: String,
		required: false,
		default: null,
	},
});
const state = useStore();
const route = useRoute();
const router = useRouter();
// const habitId = props.habitId || route.params.id;
const habitId = computed(() => route.params.id);
const { months, days } = info;

const now = new Date();
const date = reactive({
	day: now.getDate(),
	month: now.getMonth(),
	year: now.getFullYear(),
});

const changeMonth = (year: number, month: number = date.month) => {
	if (new Date().getTime() <= new Date(`${year}-${month + 1}`).getTime())
		return;

	console.log(new Date().getTime() <= new Date(`${year}-${month}`).getTime());
	if (month < 0) {
		date.month = 11;
		date.year = year - 1;
		return;
	} else if (month > 11) {
		date.year = year + 1;
		date.month = 0;
		return;
	}

	date.year = year;
	date.month = month;
};

const showEditHabit = ref(false);

const goBack = () => router?.go(-1);
const showEditHabitModal = () => {
	console.log('open habti modal')
	showEditHabit.value = true;
};

watch(isMobile, () => {
	showEditHabit.value = false;
});
</script>

<template>
	<div
		class="overflow-hidden max-w-[1400px] m-auto h-full md:flex children:(flex-1) md:px-4"
	>
		<div class="p-3 md:p-5">
			<AppGoBackArrow
				@click="goBack"
				text="Go back"
				class="m-auto max-w-[400px]"
			/>
			<div class="m-auto max-w-[400px]">
				<div class="flex my-5 px-3 border-l-3 pl-3 rounded-x-lg"
					:style="{borderColor: state.habits[habitId].color || ''}"
					>
					<div v-if="state?.habits[habitId]"
						class="py-1 rounded-x-lg flex-1 flex items-center font-bold text-xl">
						<ArchiveBoxIcon
							class="h-5 w-5 mr-2"
							v-if="state?.habits[habitId]?.archived"
						/>
						{{ state.habits[habitId].name }}
					</div>
					<div class="flex items-center justify-center" v-if="!isMobile">
						<PencilIcon
							class="h-5 w-5 cursor-pointer"
							@click="showEditHabitModal"
						/>
					</div>
				</div>
				<AppMonthlyNavigation
					:date="date"
					@next="changeMonth(date.year, date.month + 1)"
					@previous="changeMonth(date.year, date.month - 1)"
				/>
				<AppMonthlyCalendar :date="date" :habitId="habitId" />
			</div>
		</div>

		<div
			class="text-black dark:(bg-white text-black) md:max-w-[800px] max-w-[400px] m-auto sm:rounded rounded-t-4xl mb-4 mt-0 pb-30 md:pb-0"
		>
			<div class="p-3 md:p-5 max-w-[400px] m-auto pb-auto">
				<h2 class="text-xl font-bold py-4 font-titillium-web">Overview</h2>
				<AppHabitStats :habitId="habitId" />
        <div class="flex justify-between items-center py-4 cursor-not-allowed ">
				  <h2 class="text-xl font-bold font-titillium-web">History</h2>
          <div class="text-gray-400 flex items-center gap-1">
            <oh-vue-icon name="md-keyboardarrowdown-round"/>
            <span>all time</span>
          </div>
        </div>
				<AppWeeklyChart :habitId="habitId" class="pb-auto" />
			</div>
		</div>
	</div>

	<EditHabitModal :is-open="showEditHabit" @close="showEditHabit = false" :habit-id="habitId" />
</template>

<style>
.carousel__slide--active .carousel__item {
	-webkit-text-stroke: none;
	--tw-text-opacity: 1;
	color: rgba(52, 211, 153, var(--tw-text-opacity));
}

.scroll {
	scroll-snap-type: x mandatory;
}

.scroll div {
	scroll-snap-align: start;
}
</style>
