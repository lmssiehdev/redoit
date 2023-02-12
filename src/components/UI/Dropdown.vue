<script setup lang="ts">
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import {
ArchiveBoxIcon, Cog6ToothIcon,
HomeIcon
} from "@heroicons/vue/24/outline";
import { ChevronDownIcon, UserCircleIcon } from "@heroicons/vue/24/solid";


defineProps({
	username: {
		type: String,
		required: true,
	},
});

</script>

<template>
	<div>
		<Menu as="div" class="relative inline-block text-left z-10">
			<div>
				<MenuButton
					class="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black dark:(bg-dark-300) rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
				>
					<UserCircleIcon class="w-5 h-5 mr-2" aria-hidden="true" />
					{{ username }}
					<ChevronDownIcon class="w-5 h-5 ml-2 -mr-1" aria-hidden="true" />
				</MenuButton>
			</div>

			<transition
				enter-active-class="transition duration-100 ease-out"
				enter-from-class="transform scale-95 opacity-0"
				enter-to-class="transform scale-100 opacity-100"
				leave-active-class="transition duration-75 ease-in"
				leave-from-class="transform scale-100 opacity-100"
				leave-to-class="transform scale-95 opacity-0"
			>
				<MenuItems
					class="absolute right-0 w-56 mt-2 origin-top-right bg-white dark:(bg-dark-300 text-white) divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					<div class="px-1 py-1">
						<!-- <MenuItem v-slot="{ active }">
            <button :class="[
              active ? 'bg-green-500 text-white' : '',
              'group flex rounded-md items-center w-full px-2 py-2 text-sm',
            ]">
              <UserCircleIcon :active="active" class="w-5 h-5 mr-2" aria-hidden="true" />Profile
            </button>
            </MenuItem> -->
						<MenuItem v-slot="{ active }">
							<router-link to="/">
								<button
									:class="[
										active ? 'bg-green-500 text-white' : '',
										'group flex rounded-md items-center w-full px-2 py-2 text-sm',
									]"
								>
									<HomeIcon
										:active="active"
										class="w-5 h-5 mr-2"
										aria-hidden="true"
									/>Board
								</button>
							</router-link>
						</MenuItem>
						<MenuItem v-slot="{ active }">
							<router-link to="/archive">
								<button
									:class="[
										active ? 'bg-green-500 text-white' : '',
										'group flex rounded-md items-center w-full px-2 py-2 text-sm',
									]"
									@click=""
								>
									<ArchiveBoxIcon
										:active="active"
										class="w-5 h-5 mr-2"
										aria-hidden="true"
									/>Archive
								</button>
							</router-link>
						</MenuItem>
						<!-- <MenuItem v-slot="{ active }">
							<button
								:class="[
									active ? 'bg-green-500 text-white' : '',
									'group flex rounded-md items-center w-full px-2 py-2 text-sm',
								]"
								@click="ee"
							>
								<MoonIcon v-if="isDark" class="h-5 w-5 mr-2" />
								<SunIcon v-else class="h-5 w-5 mr-2" />
								{{ isDark }}
								{{ !isDark ? "switch to dark mode" : "switch to light mode" }}
							</button>
						</MenuItem> -->
					</div>
				</MenuItems>
			</transition>
		</Menu>
	</div>
</template>
