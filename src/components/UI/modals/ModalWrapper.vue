<script lang="ts" setup>
import { isMobile } from "@/utils/breakpoints"
import { XIcon, XMarkIcon } from "@heroicons/vue/24/solid";
import { onMounted, ref, watch } from "vue";
import { onClickOutside } from '@vueuse/core';

const props = defineProps({
  headingText: {
    type: String,
    required: false
  },
  isOpen: {
    type: Boolean,
    required: true,
    default: false,
  },
  isFullScreen: {
    type: Boolean,
    required: false,
    default: false,
  }
})
const emits = defineEmits(["close", "done"])

// required to fix a bug related to Teleport
const isLoaded = ref(false);
onMounted(() => {
  isLoaded.value = true; 
})

const modalEle = ref(null);
onClickOutside(modalEle, () => {
  emits('close')
})

watch(() => props.isOpen, () => {
  if(props.isOpen) {
    document.body.style.overflow = 'hidden'; 
  } else {
    document.body.style.overflow = '';
  }
}, {
  immediate: true
});
</script>
<template>
  <Teleport v-if="isLoaded && isOpen" to=".modal">
	  <div class="fixed inset-0 z-10 bg-black bg-opacity-50"></div>
       <div
      ref="modalEle"
      :class="{
      'absolute top-[50%] left-[50%] w-[500px]  bg-white text-black dark:(bg-dark-500 text-white) -sm transform translate-x-[-50%] translate-y-[-50%] rounded-md': !isMobile,
      'h-full ': isFullScreen && isMobile,
      'absolute bottom-0 right-0 w-full overflow-y-auto': isMobile 
      }"
      class="z-20 px-5 py-5 bg-white text-black dark:(bg-dark-500 text-white) overflow-y-auto"
    >
        <slot/>
	  </div>
    
  </Teleport>
</template>

<style>
.titillium-web {
	font-family: "Titillium Web", sans-serif !important;
}
</style>
