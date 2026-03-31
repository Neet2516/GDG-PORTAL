import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const backendUrl = (env.BACKEND_URL || 'https://gdg-backend-beta.vercel.app').replace(/\/+$/, '')
  const backendPrefix = (env.BACKEND_API_PREFIX || '/api/v1').replace(/\/+$/, '')

  return {
    plugins: [react(), tailwindcss()],

    server: {
      port: 5173,
      open: true,
      proxy: {
        '/api': {
          target: backendUrl,
          changeOrigin: true,
          secure: true,
          rewrite: (path) => path.replace(/^\/api/, backendPrefix),
        },
      },
    },

    build: {
      outDir: 'dist',
      sourcemap: false,
    },
  }
})
