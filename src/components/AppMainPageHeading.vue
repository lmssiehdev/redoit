<script setup lang="ts">

import info from '@/assets/info';
import isMobile from '@/utils/isMobile';

defineProps({
    text: {
        type: String,
        required: true
    }
})

const now = new Date()
const today = info.days[now.getDay() + 1]
const todaysDate = now.getDate();

</script>


<template>
    <div>
        <h1 class="text-5xl font-bold">{{ text }}</h1>

        <div v-if="isMobile" class="mt-3">{{ today }}, {{ todaysDate }}</div>
    </div>
</template>