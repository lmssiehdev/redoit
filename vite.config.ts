import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')

import WindiCSS from 'vite-plugin-windicss'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  },
  plugins: [WindiCSS(), vue(),
  VitePWA({
    mode: "development",
    base: "/",
    srcDir: "src",
    filename: "sw.ts",
    includeAssets: ["./src/assets/icons/favicon.ico","./src/assets/icons/icon-144.png","./src/assets/icons/icon-192.png","./src/assets/icons/icon-512.png",],
    strategies: "injectManifest",
    manifest: {
      name: "Test Project",
      short_name: "Test",
      theme_color: "#ffffff",
      start_url: "/",
      display: "standalone",
      background_color: "#ffffff",
      prefer_related_applications: true,
      icons: [
        {
          src: "./src/assets/icons/icon-144.png",
          sizes: "144x144",
          type: "image/png",
        },
        {
          src: "./src/assets/icons/icon-192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: "./src/assets/icons/icon-512.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "any maskable",
        },
      ],
    },
  }),
  ],
  server: {
    host: true
  },
})

