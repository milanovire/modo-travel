import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'
import { searchAnalyticsPlugin } from './vite-plugin-search-analytics'

export default defineConfig({
  plugins: [react(), searchAnalyticsPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
