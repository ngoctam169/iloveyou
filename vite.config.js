import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const defaultBase = mode === 'production' ? '/iloveyou/' : '/'

  return {
    plugins: [react()],
    base: env.VITE_BASE_PATH || defaultBase,
    build: {
      target: 'es2020',
      sourcemap: false,
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'react-vendor'
            if (id.includes('node_modules/lucide-react')) return 'icons'
          },
        },
      },
    },
  }
})
