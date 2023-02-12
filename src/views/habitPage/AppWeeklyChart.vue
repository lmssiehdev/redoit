<script lang="ts" setup>
import { useStore } from '@/stores/habits';
import { percentage } from '@/func';
import info from '@/assets/info';
import { computed, reactive, watch, ref } from 'vue';
import { CheckIcon } from "@heroicons/vue/24/solid"
import { OhVueIcon, addIcons } from 'oh-vue-icons';
import { HiSolidCheck, MdDoneRound, OiCheck, OiChevronRight  } from "oh-vue-icons/icons";

addIcons(MdDoneRound, HiSolidCheck, OiCheck, OiChevronRight );

const props = defineProps({
    habitId: {
        type: String,
        required: true,
    },
})

const state = useStore();
const { days } = info;
const habitColor = computed(() => state.habits[props.habitId].color);

let data = ref({ 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });
const dates = reactive(state.habits[props.habitId].dates);
const max = computed(() => Math.max(...Object.values(data.value)));

watch(dates, () => {
    console.log('dates update')
    calculateDates()
})

function calculateDates() {
    data.value = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
    Object.keys(dates).forEach(date => {
        const day = new Date(date).getDay();
        if (data.value[day]) {
            data.value[day]++
            return
        }
        data.value[day] = 1
    })
    console.log(data.value)
}
calculateDates();

const tooltipData = ref({
    index: new Date().getDay(),
    data: [data.value[new Date().getDay()]]
});
console.log(tooltipData.value)
const onMouseMove = (params) => {
    if(!params) return;
   const { index } = params;
   console.log(params) 
   tooltipData.value = params || null;
}


console.log(data)
const labels = {
     xLabels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
</script>



<template>
    <div class="max-w-[600px] m-auto text-base  ">
        <div v-if="false">
        <div class="flex-1 font-mono">
            <div >
                <div class="flex min-h-[200px]">

                    <div v-for="d in data" class="flex flex-col flex-1 items-center">
                        <div class=" mt-auto none text-sm font-bold">
                            <span class="visible" :class="{'invisible': !d}">{{ d }}</span>
                        </div>
                        <div class="flex-1 flex w-[1em] bg-gray-500   bg-opacity-10 rounded-xl">
                        <div class="bar items-end mt-auto w-full rounded-xl"
                            :style="[{ 'height': percentage(d, max) }, { 'backgroundColor': habitColor }]"
                        ></div>
                    </div>
                        <!-- <div class=" w-full w-[.9em]  bg-gray-500  rounded-xl"
                            :style="[{ 'height': percentage(d, max) }, { 'backgroundColor': habitColor }]">
                        </div> -->
                    </div>
                </div>

            </div>
        </div>
        <div class="flex font-bold">
            <div class="flex-1 text-center py-2" v-for="day in days" :key="day">{{ day.substr(0, 2) }}</div>
        </div>
    </div>
        <div
            class="chart w-full"
        >
    <div :class="{'is-active': tooltipData}">
      <div class="mb-5 flex items-center children:flex-1" v-if="true">
        <h3 class="font-bold text-xl">{{info.days?.[tooltipData?.index+1]}}</h3>
          
          <div class="habit-stat font-bold text-gray-500 flex justify-end items-center gap-1">
			<oh-vue-icon name="oi-check" class="h-5 w-5 sm:(h-6 w-6)" />
            {{tooltipData?.data[0]}}
            <h4 class="font-bold text-gray-500">Completed</h4>
          </div> 
          <div v-if="false" class="font-bold text-gray-500 flex justify-end items-center gap-1">
		    <oh-vue-icon name="oi-chevron-right" class="h-5 w-5 sm:(h-6 w-6)" />
            {{tooltipData?.data[0]}}
            <h4 class="font-bold text-gray-500">Skipped</h4>
          </div>

      </div>
    </div>
    <TrendChart
   :interactive="true"
   @mouse-move="onMouseMove"
  :datasets="[
    {
      data: Object.values(data),
      smooth: true,
      showPoints: true,
      fill: true,
      className: 'curve1'
    }
  ]"
  :labels="labels"
  :min="0"
  >
</TrendChart>
        </div>
   </div>

</template>


<style lang="scss">
.chart {
  width: 100%;
  .vtc {
    height: 250px;
    font-size: 12px;
    @media (min-width: 699px) {
      height: 320px;
    }
  }
  .labels {
    stroke: rgba(0, 0, 0, 0.05);
  }
  .active-line {
    stroke: rgba(0, 0, 0, 0.2);
  }
  .point {
    stroke-width: 3;
    transition: stroke-width 0.2s;
  }
  .point.is-active {
    stroke-width: 5;
  }
  .curve1 {
    .stroke {
      stroke: v-bind(habitColor);
      stroke-width: 3;
    }
    .fill {
      fill:  v-bind(habitColor);
      opacity: 0.05;
    }
    .point {
      fill:   v-bind(habitColor);
      stroke:  v-bind(habitColor);
    }
  }
  .curve2 {
    .stroke {
      stroke: #fbe1b6;
      stroke-width: 2;
    }
    .point {
      fill: #fbe1b6;
      stroke: #fbe1b6;
    }
  }
  .curve3 {
    .stroke {
      stroke: #7fdfd4;
      stroke-width: 2;
    }
    .point {
      fill: #7fdfd4;
      stroke: #7fdfd4;
    }
  }
  .tooltip {
    &:not(.is-active) {
      display: none;
    }
    padding: 10px;
    background: #fff;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    pointer-events: none;
    &-data {
      display: flex;
      &-item {
        display: flex;
        align-items: center;
        &:not(:first-child) {
          margin-left: 20px;
        }
        &:before {
          content: "";
          display: block;
          width: 15px;
          height: 15px;
          margin-right: 5px;
        }
        &--1:before {
          background: #fbac91;
        }
        &--2:before {
          background: #fbe1b6;
        }
        &--3:before {
          background: #7fdfd4;
        }
      }
    }
  }
}
</style>
