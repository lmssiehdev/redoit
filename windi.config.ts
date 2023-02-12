import { defineConfig, transform } from "windicss/helpers";

export default defineConfig({
  extract: {
    // include: ["**/*.{jsx,tsx,css}"],
    exclude: ["node_modules", ".git"],
  },
  plugins: [
    require("windicss/plugin/aspect-ratio"),
    require('@windicss/plugin-animations')({
      settings: {
        animatedSpeed: 1000,
        heartBeatSpeed: 1000,
        hingeSpeed: 2000,
        bounceInSpeed: 750,
        bounceOutSpeed: 750,
        animationDelaySpeed: 1000,
      },
    }),
  ],
  theme: {
    extend: {
      colors: {
        woodsmoke: { DEFAULT: '#131314', '50': '#BFBFC2', '100': '#B5B5B9', '200': '#A0A0A5', '300': '#8B8B91', '400': '#76767D', '500': '#636368', '600': '#4F4F53', '700': '#3B3B3E', '800': '#272729', '900': '#131314' },
      }
    }
  }
});