import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";
import { computed, ref } from "vue";

const breakpoints = useBreakpoints(breakpointsTailwind);
const sm = breakpoints.smaller("sm");
const md = breakpoints.between("sm", "md");
const lg = breakpoints.between("md", "lg");
const xl = breakpoints.greater("xl");

const screenSizes = {
  sm, md, lg, xl
}

const isMobile = breakpoints.smaller("sm");

const calenderSize = computed(() => {
  const size = ref(8);

  if (sm.value) {
    size.value = 3;
  } else if (md.value) {
    size.value = 5;
  } else if (lg.value) {
    size.value = 6;
  } else if (xl.value) {
    size.value = 10;
  }

  return size.value;
});

export { screenSizes, calenderSize, isMobile }
