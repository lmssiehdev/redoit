<script setup lang="ts">
import AppMobileNavigation from "@/components/AppMobileNavigation.vue";
import Navbar from "@/components/Navbar.vue";
import { isMobile } from "@/utils/breakpoints";
import { App as CapacitorApp } from '@capacitor/app';

CapacitorApp.addListener('backButton', ({canGoBack}) => {
  if(!canGoBack){
    CapacitorApp.exitApp();
  } else {
    window.history.back();
  }
});

function isInstalled() {
	// For iOS
	if (window.navigator.standalone) return true;

	// For Android
	if (window.matchMedia("(display-mode: standalone)").matches) return true;

	// If neither is true, it's not installed
	return false;
}

</script>

<template>
	<div class="flex flex-col min-h-[100vh]">
	<AppMobileNavigation />
		<div class="text-black flex flex-col dark:(bg-dark-700 text-white) flex-1">
			 <Navbar v-if="!isMobile" class="w-full" />
			<div class="flex-1">
	      <router-view />
			</div>
		</div>
			<div class="modal">
		</div>
	</div>
</template>

<style>
*,
*::after,
*::before {
	box-sizing: border-box;
	font-family: inherit;
}

#app {
	font-family: "Nunito", sans-serif;
	font-size: clamp(0.8rem, 1.1vw + 0.3rem, 1rem);
	/* font-family: 'Varela Round', sans-serif; */
	
	min-height: 100vh;
	position: relative;
}

.font-titillium-web {
	font-family: "Titillium Web", sans-serif !important;
}

.font-varela-round {
  font-family: "Varela Round", sans-serif !important;
}
</style>
