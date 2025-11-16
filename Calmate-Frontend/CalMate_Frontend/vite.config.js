import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  }, 
  define: {
    global: 'globalThis', // Polyfill node-style global for browser-only libs
  },
  // server: {
  //   proxy: {
  //     '/api': {
  //       target: 'http://localhost:8055', // ?ㅽ봽留?諛깆뿏??
  //       changeOrigin: true,
  //       rewrite: p => p.replace(/^\/api/, ''),
  //     },
  //     '/act': {
  //       target: 'http://localhost:8055', // (?듭뀡) actuator(愿由ы룷?? ?꾨줉??
  //       changeOrigin: true,
  //       rewrite: p => p.replace(/^\/act/, ''),
  //     }
  //   }
  // }
})
