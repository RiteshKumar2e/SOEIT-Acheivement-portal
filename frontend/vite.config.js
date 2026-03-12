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
  esbuild: {
    drop: ['console', 'debugger'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'axios'],
          utils: ['jspdf', 'xlsx', 'react-hot-toast'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    minify: true, // Uses esbuild by default
  },
})
