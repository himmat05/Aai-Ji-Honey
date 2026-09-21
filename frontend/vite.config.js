import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-three-vanta': ['three', 'vanta'],
          'vendor-swiper': ['swiper'],
          'vendor-ui': ['react-toastify', 'axios', 'number-to-words', 'web-vitals'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
