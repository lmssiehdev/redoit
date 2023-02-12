import { breakpointsTailwind, useBreakpoints } from "@vueuse/core";

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('sm');


export default isMobile
