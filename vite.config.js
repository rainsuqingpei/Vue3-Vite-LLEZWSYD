import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      "@": path.join(__dirname, "./src/"),
    },
  },
  server: {
    host: true,
    hmr: true,
    https: false,
    port: 3333,
    proxy: {
      '/zwzzj': {
        target: 'http://47.122.44.51:8034/zwzzj',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/zwzzj/, ''),
      },
    },
  },
  plugins: [vue()],
})
