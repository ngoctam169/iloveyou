import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    target: 'es2020',
    sourcemap: false,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor'
          if (id.includes('node_modules/lucide-react')) return 'icons'
          if (id.includes('/src/data/vocabulary/generated/')) return 'vocabulary-data'
        },
      },
    },
  },
})
