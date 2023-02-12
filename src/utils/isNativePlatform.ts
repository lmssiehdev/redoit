import { computed } from 'vue';
import {Capacitor} from '@capacitor/core';

const computedIsNativePlatform = computed(() => Capacitor.isNativePlatform());


export default computedIsNativePlatform.value