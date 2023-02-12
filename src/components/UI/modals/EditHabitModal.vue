<script setup lang="ts">
import CustomModal from "@/components/UI/modals/CustomModal.vue";
import ModalWrapper from "@/components/UI/modals/ModalWrapper.vue";

  defineProps({
    habitId: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      required: true,
    },
    headingText: {
      type: String,
      required: false,
      default: 'Edit Habit'
    },
    buttonText: {
      type: String,
      required: false,
      default: 'Update'
    }
  });
  
  const emits = defineEmits(['close']);


</script>

<template>

    <ModalWrapper
      :is-Open="isOpen"
      :is-full-screen="true"
      @close="$emit('close')"
      >
      <CustomModal 
        :habitId="habitId"
        :button-text="buttonText"
        :heading-text="headingText"
        @close="$emit('close')" />
    </ModalWrapper>

</template>
