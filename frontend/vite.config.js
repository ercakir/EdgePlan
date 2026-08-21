import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-recharts': ['recharts'],
          'vendor-jspdf': ['jspdf', 'html2canvas'],
          'vendor-icons': ['lucide-react']
        }
      }
    }
  },
  server: {
    port: 3001,
    strictPort: true,
    host: true,
  }
})
