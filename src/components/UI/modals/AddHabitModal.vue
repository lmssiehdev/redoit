<script setup lang="ts">
import CustomModal from "@/components/UI/modals/CustomModal.vue";
import ModalWrapper from "@/components/UI/modals/ModalWrapper.vue";

  defineProps({
    isOpen: {
      type: Boolean,
      required: true,
    },
    headingText: {
      type: String,
      required: false,
      default: 'Create Habit'
    },
    buttonText: {
      type: String,
      required: false,
      default: 'Create'
    }
  });
 
  const emits = defineEmits(['close', 'done'])
</script>

<template>
    <ModalWrapper
      :isOpen="isOpen"
      :is-full-screen="true"
      @close="$emit('close')"
      >
        <CustomModal 
          @close="$emit('close')"
          @add="$emit('close')"
         :heading-text="headingText"
         :button-text="buttonText"
        />
    </ModalWrapper>
</template>
