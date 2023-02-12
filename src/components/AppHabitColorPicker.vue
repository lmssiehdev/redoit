<script lang="ts" setup>
import { hslToHex } from "@/utils/colors";
import { CheckIcon } from "@heroicons/vue/24/outline";
import ColorPicker from "@radial-color-picker/vue-color-picker";
import { computed, reactive, ref, watch } from "vue";

const props = defineProps({
	initialColor: {
		type: String,
		required: true,
	},
});

const emit = defineEmits(["updateColor", "needPremium"]);

const onInput = function (hue = 10) {
	const getColor = hslToHex(hue, color["saturation"], color["luminosity"]);
	if (getColor.includes("#")) {
		lastColor.value = getColor;
		changeColor(getColor);
	}
};

const showColorPicker = ref(false);
const colors = ["#9ccc65", "#29b6f6", "#ba68c8", "#e57373", "#ffa726", "#607D8B"];

const currentColor = ref<string>(props.initialColor);
const isCustomColor = computed(() => !colors.includes(currentColor.value));
const changeColor = (color: any) => {
	// if (r?.color) r.color = color;
	// habit.value.color = color;
	currentColor.value = color;
  
	emit("updateColor", currentColor.value);
};

const color = reactive({
	hue: 12,
	saturation: 30,
	luminosity: 50,
	alpha: 1,
});

const lastColor = ref("#9ccc65");

const handleCustomColorClick = () => {
  changeColor(color);
  // isCustomColor.value = true;
	showColorPicker.value = !showColorPicker.value;
}

watch(currentColor, () => {
	if (typeof currentColor.value == "number") {
		currentColor.value = lastColor.value;
	}
});
</script>

<template>
	<div class="flex items-center justify-around gap-1 py-3">
		<div
			v-for="color in colors"
			:key="color"
			@click="
				changeColor(color);
				showColorPicker = false;
				isCustomColor = false;
			"
			class="min-h-10 min-w-10 rounded flex-1 flex items-center justify-center cursor-pointer"
			:style="[{ 'background-color': color }]"
		>
			<CheckIcon v-if="currentColor == color" class="h-8 w-8 text-white" />
		</div>
		<div
			class="bg-rainbow overflow-hidden min-h-10 min-w-10 rounded flex-1 flex items-center justify-center cursor-pointer"
			@click="
				handleCustomColorClick()
			"
		>
			<CheckIcon v-if="isCustomColor" class="h-8 w-8 text-white" />
		</div>
	</div>
	<div v-if="showColorPicker" class="my-1">
		<color-picker
			class="m-auto w-[200px] h-[200px]"
			variant="persistent"
			v-bind="color"
			@input="onInput"
		>
		</color-picker>
	</div>
</template>
