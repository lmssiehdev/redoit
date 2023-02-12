<script lang="ts" setup>
import { useStore } from '@/stores/habits';
import { useRouter } from 'vue-router';

const props = defineProps({
    habitId: {
        type: String,
        required: true,
    },
});

const state = useStore()
const router = useRouter()

const emits = defineEmits(["close"]);

const deleteHabit = (id: string) => {
    router.push('/web');
    state.deleteHabit(id)
    emits("close");
    // confirmationModel.value = false
    console.log('deleted the habit')
}

const archiveHabit = (id: string) => {
    if (user.user.isPremium) {
        state.archiveHabit(id)
        emits("close");
    } else {
        console.log('please buy premium')
        emits("close");
        // buyPremiumModal.value = true;
    }
}
</script>

<template>
    <div class="absolute top-0 left-0 w-full h-full bg-dark-500 bg-opacity-50"></div>
    <div class=" addNewHabit bg-white bottom-0 text-black z-20 fixed w-full  rounded-t-5xl p-5  ">

        <h3 class="text-center text-2xl font-bold">Options</h3>

        <div class=" mt-7">
            <button @click="archiveHabit(habitId)" type="button"
                class=" py-3 text-xl font-bold bg-blue-300 text-blue-900 border border-transparent rounded-xl  hover:bg-blue-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-400 w-full ">
                {{ state.habits[habitId].archived == true ? 'Unarchive' : 'Archive' }}
                Habit
            </button>
            <button @click="deleteHabit(habitId)" type="button"
                class=" py-3 text-xl font-bold bg-red-300 text-red-900 border border-transparent rounded-xl  hover:bg-red-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-400 w-full my-2">Delete
                Habit</button>
            <button @click="$emit('close')" type="button"
                class="py-3 text-xl font-bold text-gray-700 bg-gray-200 border border-transparent rounded-xl  hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500 w-full ">Close</button>
        </div>

    </div>



</template>

<style scoped>
.addNewHabit {
    font-family: 'Titillium Web', sans-serif !important;
}
</style>