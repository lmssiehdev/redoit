<script lang="ts" setup>
import AddNewHabitModal from "@/components/habits/AddNewHabitModal.vue";

import { ref } from "vue";
const isOpen = ref(true);

</script>

<template>
	<div class="my-5 text-lg text-center px-10">
		Looks like you aren't tracking any habits yet, so...
		<br />what do you want to start doing every day? :)
	</div>
	<div class="max-w-[300px] m-auto">
		<AddNewHabitModal />
	</div>
</template>
