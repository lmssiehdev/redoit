<script lang="ts" setup></script>

<template>
	<AppModal
		:isOpen="isOpen"
		headingText="Premium Plan"
		@close="$emit('closeModal')"
	>
		<div class="text-black">
			<h1 class="text-gray-400 font-semibold text-size-[1.2em] my-4">
				You can...
			</h1>
			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">Add unlimited habits</div>
			</div>

			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">Archive habits</div>
			</div>
			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">Devices synchronisation</div>
			</div>
			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">See yearly report</div>
			</div>

			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">No ads</div>
			</div>
			<div class="flex items-center my-2">
				<CheckCircleIcon class="h-7 w-7 mr-3 text-green-400" />
				<div class="text-size-[1] font-semibold">
					... and all the future updates
				</div>
			</div>
			<h1 class="text-gray-400 font-semibold text-size-[1.2em] my-4">
				Select plan
			</h1>
			<div class="flex items-center justify-around mx-3 my-2">
				<div
					@click="selectMonthly"
					class="p-2 flex flex-col items-center border-2 border-transparent rounded-lg w-full cursor-pointer hover:border-2 hover:border-green-500 hover:bg-green-100"
				>
					<span>Monthly</span>
					<span class="text-3xl font-semibold">$1.99</span>
					<span>/ Month</span>
				</div>
				<div
					@click="selectYearly"
					class="p-2 flex flex-col items-center rounded-lg border-2 border-transparent hover:border-green-500 hover:bg-green-100 cursor-pointer w-full"
				>
					<span>Yearly</span>
					<span class="text-3xl font-semibold">$12</span>
					<span>/ year</span>
				</div>
			</div>
		</div>

		<button
			type="button"
			class="px-4 py-2 text-sm font-medium text-green-900 bg-green-200 border border-transparent rounded-md hover:bg-green-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-green-500 ml-auto w-full"
		>
			<span class="flex items-center justify-center">
				<StarIcon class="h-5 w-5 mr-2" />
				<span class="text-lg">Go Premium</span>
				<span class="text-sm text-green-700">- 7 days free</span>
			</span>
		</button>
	</AppModal>
</template>
