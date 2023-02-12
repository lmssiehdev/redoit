<script lang="ts" setup>
import { days } from "@/assets/info";
import AppSettingsOption from "@/components/settings/AppSettingsOption.vue";
import { useStore } from "@/stores/habits";
import { habit as habitType } from "@/types/habits";
import { ArchiveBoxIcon, CheckIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { reactive, computed, ref, watch, unref, onBeforeMount, onUnmounted } from "vue";
import AppHabitColorPicker from "@/components/AppHabitColorPicker.vue";
import { useRouter } from "vue-router";

const props = defineProps({
	habitId: {
		type: String,
		required: false,
	},
	isOpen: {
		type: Boolean,
		required: true,
	},
	headingText: {
		type: String,
		required: true,
	},
});

const emits = defineEmits(["close", "add", "archive", "delete"]);

const state = useStore();
const router = useRouter();
const habitNameErr = ref("");

const newHabit = {	name: "",
			color: "#6eff2a",
			createdAt: null,
			dates: {},
			archived: false,
			activeDays: [true, true, true, true, true, true, true],
	  };
const habit = ref({} as habitType);


const isOpenComputed = computed(() => props.isOpen)
watch(isOpenComputed, () =>{
	if (props.habitId) {
		habit.value = { ...state.habits[props.habitId] };
	} else {
	
		habit.value = {...newHabit}
	}
})

const c = computed(() =>
	props.habitId ? state.habits[props.habitId]?.color : "#40e0d0"
);

function updateColor(payload: string) {
	habit.value.color = payload;
}

const add = (payload: habitType) => {
	if (habit.value.name.length == 0) {
		habitNameErr.value = "please enter a name";
		return;
	}
	habitNameErr.value = "";
	const { name, color, activeDays } = payload;
	state.addHabit({ name, color, activeDays });
	emits("close");
};

function editHabit(payload) {
	console.log("clicked habit", payload);
	const { id, name, color, activeDays } = payload;
	state.updateHabit(id, name, color, activeDays);
	emits("close");
}

const archiveHabit = (habitId: string) => {
	// if (user.user.isPremium) {
	state.archiveHabit(habitId);
	// } else {
	emits("close");
	// buyPremiumModal.value = true;
	// }
};

const deleteHabit = (habitId: string) => {
	router.push("/web");
	state.deleteHabit(habitId);
	emits("close");
	// confirmationModel.value = false;
	console.log("deleted the habit");
};

const confirm = (e) => {
	console.log(e)
	console.log('called')
	props.habitId ? editHabit({ id: props.habitId, ...habit.value }) : add(habit.value)
}
</script>

<template>
	<AppSettingsOption
		:isOpen="isOpen"
		:headingText="headingText"
		@close="$emit('close')"
		class="bg-woodsmoke-100"
		@add="confirm"
	>
		<div>
			<div>
				<h4 class="font-bold py-1 border-b-1 border-gray-200">NAME</h4>
				<div class="py-3">
					<div>
						<input
							v-model="habit.name"
							type="text"
							placeholder="Habit"
							class="px-4 py-3 border-1 text-black border-gray-400 rounded-xl w-full font-bold"
						/>
						<div
							class="text-red-600 dark:(text-red-400) py-1"
							v-if="habitNameErr && !habit.name"
						>
							{{ habitNameErr }}
						</div>
					</div>
					<div class="py-1 flex gap-2" v-if="habitId">
						<button
							class="cursor-pointer bg-red-100 text-red-500 px-2 py-1 mt-2 text-sm font-medium border border-transparent rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-300 flex items-center"
							@click="
								deleteHabit(habitId);
								$emit('close');
							"
						>
							<XMarkIcon class="w-4 h-4 mr-1" />
							<div>delete habit</div>
						</button>
						<button
							class="cursor-pointer bg-blue-100 text-blue-500 px-2 py-1 mt-2 text-sm font-medium border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-300 flex items-center"
							@click="
								archiveHabit(habitId);
								$emit('close');
							"
						>
							<ArchiveBoxIcon class="w-4 h-4 mr-1" />
							<div>
								{{
									state.habits[habitId].archived == true
										? "unarchive"
										: "archive"
								}}
								habit
							</div>
						</button>
					</div>
				</div>
			</div>
			<div>
				<h4 class="font-bold py-3 border-b-1 border-gray-200">COLOR</h4>
				<AppHabitColorPicker :initialColor="c" @updateColor="updateColor" />
			</div>
			<div>
				<h4 class="font-bold py-1 border-b-1 border-gray-200">FREQUENCY</h4>
				<div>
					<div class="flex items-center my-3">
						<div
							v-for="i in 7"
							class="flex-1 flex flex-col items-center justify-center"
						>
							<input
								:id="i.toString()"
								type="checkbox"
								v-model="habit.activeDays[i - 1]"
							/>
							<label :for="i.toString()" class="p-2 cursor-pointer">
								{{ days[i].substr(0, 2) }}
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</AppSettingsOption>
</template>

<style>
.bg-rainbow {
	background: linear-gradient(to bottom right, #40e0d0, #f1be44, #ff0080);
}
</style>
