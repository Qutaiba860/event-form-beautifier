
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./FrontEnd/event-form-beautifier/src"),
    },
  },
  server: {
    host: "::",
    port: 8080,
  },
})
