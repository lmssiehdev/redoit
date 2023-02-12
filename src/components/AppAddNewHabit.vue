<script lang="ts" setup>
import { CheckIcon, ChevronRightIcon } from "@heroicons/vue/24/outline";
import { ref, reactive, watch } from "vue";
import info from "@/assets/info";
import { useStore } from "@/stores/habits";
import ColorPicker from "@radial-color-picker/vue-color-picker";

const props = defineProps({
	habitId: {
		type: String,
		required: false,
	},
});

const emits = defineEmits(["close"]);

const state = useStore();

const habitNameErr = ref("");

let newHabit = reactive({
	name: "",
	color: "#6eff2a",
	createdAt: null,
	selected: true,
	dates: {},
	archived: false,
	activeDays: [true, true, true, true, true, true, true],
});

const addHabit = () => {
	if (newHabit.name.length == 0) {
		habitNameErr.value = "please enter a name";
		return;
	}
	habitNameErr.value = "";
	if (typeof newHabit.color == "number") newHabit.color = "#000";
	state.addHabit(newHabit);
	emits("close");

	newHabit = {
		name: "",
		color: "#6eff2a",
		createdAt: null,
		selected: true,
		archived: false,
		dates: {},
		activeDays: [true, true, true, true, true, true, true],
	};
};

let r = null;
if (props.habitId) {
	const habit = state.habits[props.habitId];
	r = reactive({
		name: habit.name,
		color: habit.color,
		activeDays: habit.activeDays,
	});
}
const editHabit = () => {
	if (state.habits[props.habitId].name.length == 0) return;
	console.log(r);
	if (typeof r.color != "number" && r.color.includes("#")) {
		state.updateHabit(props.habitId, r.name, r.color);
		emits("close");
	}
};

const colors = ["#9ccc65", "#29b6f6", "#ba68c8", "#e57373", "#ffa726"];
const currentColor = ref(state.habits[props.habitId]?.color);
const isCustomColor = ref(!colors.includes(currentColor.value));
const changeColor = (color) => {
	if (r?.color) r.color = color;
	newHabit.color = color;
	currentColor.value = color;
};

const color = reactive({
	hue: 12,
	saturation: 30,
	luminosity: 50,
	alpha: 1,
});

const showColorPicker = ref(false);

function hslToHex(h, s, l) {
	let r, g, b;

	h = h / 360;
	s = s / 100;
	l = l / 100;

	if (s === 0) {
		r = g = b = l;
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

		r = _hue2rgb(p, q, h + 1 / 3);
		g = _hue2rgb(p, q, h);
		b = _hue2rgb(p, q, h - 1 / 3);
	}

	const hex = (
		(1 << 24) +
		(Math.round(r * 255) << 16) +
		(Math.round(g * 255) << 8) +
		Math.round(b * 255)
	)
		.toString(16)
		.slice(1);

	return "#" + hex;
}

function _hue2rgb(p, q, t) {
	if (t < 0) t += 1;
	if (t > 1) t -= 1;
	if (t < 1 / 6) return p + (q - p) * 6 * t;
	if (t < 1 / 2) return q;
	if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;

	return p;
}

const onInput = function (hue = 10) {
	const getColor = hslToHex(hue, color["saturation"], color["luminosity"]);
	if (getColor.includes("#")) {
		lastColor.value = getColor;
		changeColor(getColor);
	}
};

const lastColor = ref("#a6595c");
watch(currentColor, () => {
	console.log("snee");

	if (typeof currentColor.value == "number") {
		currentColor.value = lastColor;
	}
});
</script>

<template>
	<div
		class="absolute top-0 left-0 w-full h-full bg-dark-500 bg-opacity-50"
	></div>
	<div
		class="addNewHabit bg-white bottom-0 text-black z-20 fixed w-full rounded-t-5xl p-5"
	>
		<h3 class="text-center text-2xl font-bold">
			{{ r ? "Edit Habit" : "Create New Habit!" }}
		</h3>

		<div>
			<h4 class="font-bold py-1 border-b-1 border-gray-200">NAME</h4>
			<div class="py-3">
				<input
					v-if="r"
					v-model="r.name"
					type="text"
					placeholder="Habit"
					class="px-4 py-3 border-1 border-gray-400 rounded-xl w-full font-bold"
				/>
				<input
					v-else
					v-model="newHabit.name"
					type="text"
					placeholder="Habit"
					class="px-4 py-3 border-1 border-gray-400 rounded-xl w-full font-bold"
				/>
				<div
					class="text-red-600 font-bold"
					v-if="habitNameErr && !newHabit.name"
				>
					{{ habitNameErr }}
				</div>
			</div>
		</div>
		<div>
			<h4 class="font-bold py-3 border-b-1 border-gray-200">COLOR</h4>
			<div class="flex items-center justify-around py-3">
				<div
					v-for="color in colors"
					:key="color"
					@click="
						changeColor(color);
						showColorPicker = false;
						isCustomColor = false;
					"
					class="min-h-10 min-w-10 rounded-full flex items-center justify-center cursor-pointer"
					:style="[{ 'background-color': color }]"
				>
					<CheckIcon v-if="currentColor == color" class="h-8 w-8 text-white" />
				</div>

				<div
					class="min-h-10 min-w-10 rounded-full flex items-center justify-center cursor-pointer"
					@click="
						isCustomColor = true;
						changeColor(color.hue);
						showColorPicker = !showColorPicker;
					"
					style="
						background: linear-gradient(
							to bottom right,
							#40e0d0,
							#f1be44,
							#ff0080
						);
					"
				>
					<CheckIcon v-if="isCustomColor" class="h-8 w-8 text-white" />
				</div>
			</div>
			<div v-if="showColorPicker" class="my-1">
				<color-picker
					class="m-auto w-[200px]"
					variant="persistent"
					v-bind="color"
					@input="onInput"
				>
				</color-picker>
			</div>
		</div>
		<div>
			<h4 class="font-bold py-1 border-b-1 border-gray-200">FREQUENCY</h4>
			<div class="text-black">
				<div class="flex items-center my-3">
					<div
						v-for="i in 7"
						class="flex-1 flex flex-col items-center justify-center"
					>
						<input v-if="r" type="checkbox" v-model="r.activeDays[i - 1]" />
						<input
							v-else
							type="checkbox"
							v-model="newHabit.activeDays[i - 1]"
						/>
						<label class="p-2 cursor-pointer">
							{{ info.days[i].substr(0, 2) }}
						</label>
					</div>
				</div>
			</div>
		</div>
		<div class="flex mt-7">
			<button
				@click="$emit('close')"
				type="button"
				class="py-3 text-xl font-bold text-gray-700 bg-gray-200 border border-transparent rounded-xl hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 mr-2 w-full"
			>
				Close
			</button>
			<button
				v-if="r"
				@click="editHabit"
				type="button"
				class="py-3 text-xl font-bold bg-green-600 text-green-100 border border-transparent rounded-xl hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 w-full ml-2"
			>
				Save
			</button>
			<button
				v-else
				@click="addHabit"
				type="button"
				class="py-3 text-xl font-bold bg-green-600 text-green-100 border border-transparent rounded-xl hover:bg-green-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 w-full ml-2"
			>
				Create
			</button>
		</div>
	</div>
</template>

<style scoped>
.addNewHabit {
	font-family: "Titillium Web", sans-serif !important;
}

.rcp {
	height: 200px;
	width: 200px;
}
</style>
