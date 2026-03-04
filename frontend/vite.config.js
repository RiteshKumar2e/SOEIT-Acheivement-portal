import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://soeit-acheivement-portal.onrender.com',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'https://soeit-acheivement-portal.onrender.com',
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    include: ['jspdf', 'jspdf-autotable', 'xlsx'],
  },
})
