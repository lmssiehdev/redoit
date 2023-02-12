<script lang="ts" setup>
import { days } from "@/assets/info";
import AppHabitColorPicker from "@/components/AppHabitColorPicker.vue";
import { useStore } from "@/stores/habits";
import { habit as habitType } from "@/types/habits";
import { ArchiveBoxIcon, CheckIcon } from "@heroicons/vue/24/outline";
import { XMarkIcon } from "@heroicons/vue/24/solid";
import { computed, nextTick, onMounted, ref, watch } from "vue";
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
	buttonText: {
		type: String,
		required: true,
	},
});

const emits = defineEmits(["close", "add", "archive", "delete"]);

const state = useStore();
const router = useRouter();
const habitNameErr = ref("");

const showAdvanced = ref(false);

const newHabit = {	name: "",
			color: "#9ccc65",
			createdAt: null,
			dates: {},
			archived: false,
			activeDays: [true, true, true, true, true, true, true],
	  };
const habit = ref({} as habitType);


const isOpenComputed = computed(() => props.isOpen)

watch(isOpenComputed, () =>{
  console.log('i ran')
	if (props.habitId) {
		habit.value = { ...state.habits[props.habitId] };
	} else {

		habit.value = {...newHabit}
	}
}, {
  immediate: true
})

const c = computed(() =>
	props.habitId ? state.habits[props.habitId]?.color : "#9ccc65"
);

function updateColor(payload: string) {
	habit.value.color = payload;
}

const add = () => {

	habitNameErr.value = "";
	const { name, color, activeDays } = habit.value;
	console.log({name, color, activeDays})
	state.addHabit({ name, color, activeDays });
	emits("close");
};

function editHabit() {
	const id = props.habitId
  if(!props.habitId) {
    throw new Error("habit id doesn't exist");
  }
	const { name, color, activeDays } = habit.value;
	state.updateHabit(id, name, color, activeDays);
	emits("close");
}

const archiveHabit = (habitId: string) => {
  	state.archiveHabit(habitId);
};

const deleteHabit = (habitId: string) => {
	router.push("/");
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
const handleDoneClick = () => {
	if (habit.value.name.length == 0) {
		habitNameErr.value = "please enter a name";
		return;
	}

	if(props.habitId) {
     editHabit();
  } else {
    add();
  }
}

// focus input on open
const input = ref(null);
onMounted(() => {
	nextTick(() => {
		input.value.focus()
	});
})


console.log(habit.value)
</script>

<template>
		<div class="h-full flex flex-col">
    <div class="flex-1">
			<div v-if="headingText" class="flex justify-between items-center pb-5">
		    <h3 class="text-center text-2xl font-bold">
		  	  {{ headingText }}
		    </h3>
        <XMarkIcon tabindex="0" @click="$emit('close')" class="cursor-pointer hover:text-white/50 w-7 h-7" />
		  </div>
		  <div>
				<h4 class="font-bold py-1 border-b-1 border-gray-200">NAME</h4>
				<div class="py-3">
					<div class="flex">
						<div class="w-[5px] py-1 mr-1 rounded-l"
								:style="{backgroundColor: habit.color}">
								<span class="invisible">.</span>
							</div>
						<input
							v-model="habit.name"
							ref="input"
							type="text"
							placeholder="Habit"
							class="px-3 py-2 border-1 text-black border-l-0 border-gray-400 rounded w-full font-bold"
						/>
					</div>
						<div
							class="text-red-600 dark:(text-red-400) py-2"
							v-if="habitNameErr && !habit.name"
						>
							{{ habitNameErr }}
						</div>

				</div>
			</div>
			<div>
				<h4 class="font-bold py-3 border-b-1 border-gray-200">COLOR</h4>
				<AppHabitColorPicker :initialColor="c" @needPremium="$emit('needPremium', 'colorPicker')" @updateColor="updateColor" />
			</div>
			<h4 class="font-bold my-4 cursor-pointer flex items-center text-gray-200" @click="showAdvanced = !showAdvanced">
				<span class="text-sm mr-2">{{ showAdvanced ? '▼' : '▶'}} </span>
				<span class="text-base"> advanced </span>
			 </h4>
			<div v-if="showAdvanced" class="my-4">
			<div class="pb-4 flex gap-2" v-if="habitId">
						<button
							class="cursor-pointer text-red-400 hover:(text-red-200 border-b-red-200) border-b-1 border-b-red-400 py-1-medium border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-3 00 flex items-center"
							@click="
								deleteHabit(habitId);
								$emit('close');
							"
						>
							<XMarkIcon class="w-4 h-4 mr-1" />
							<div>delete habit</div>
						</button>
						<button
							class="cursor-pointer text-gray-300 hover:(text-gray-50 border-b-gray-50) border-b-gray-300 py-1 font-medium border border-transparent focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-3 00 flex items-center"
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
			<div>
				<h4 class="font-bold p-1 border-b-1 border-gray-200">FREQUENCY</h4>
				<div>
					<div class="flex items-center my-3">
						<label
							v-for="i in 7"
							:key="i"
							class="cursor-pointer flex-1 flex flex-col items-center justify-center gap-2 bg-white text-sky-700 first:(rounded-l) last:(rounded-r)"
							:class="{
									'bg-sky-700 !text-white': habit.activeDays[i - 1]
								}"
							>

							<input
								:id="i.toString()"
								type="checkbox"
								class="hidden"
							 v-model="habit.activeDays[i - 1]"
							/>
							<span :for="i.toString()"
								class="flex-1 flex items-center justify-center gap-2 py-2 focus:outline-none">
								<CheckIcon v-if="habit.activeDays[i - 1]" class="h-3 w-3" />
								<span>{{ days[i].substr(0, 2) }}</span>
							</span>
						</label>
					</div>
				</div>
				</div>
			</div>
      </div>
	    <div class="mt-auto flex items-center gap-2">
			<button
				@click="handleDoneClick"
				type="button"
				class="py-3 font-bold text-gray-700 bg-gray-200 border border-transparent rounded-xl hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 w-full"
			>
				{{ buttonText }}
			</button>
			<button
				@click="$emit('close')"
				type="button"
				class="py-3 font-bold bg-dark-300 text-white dark:(bg-dark-500 hover:bg-dark-900 text-white border-light-50) border border-transparent rounded-xl hover:bg-dark-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-dark-400 w-full"
			>
				Close
			</button>
		</div>
   	</div>
</template>

<style>
.bg-rainbow {
	background: linear-gradient(to bottom right, #40e0d0, #f1be44, #ff0080);
}
</style>
