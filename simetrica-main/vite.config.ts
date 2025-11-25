import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL || 'http://localhost:3000/api')
    },
    build: {
      // Genera archivos con hash para evitar problemas de caché
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]'
        }
      },
      // Limpia la carpeta dist antes de cada build
      emptyOutDir: true,
      // Genera sourcemaps para debugging (opcional, puedes quitarlo en producción)
      sourcemap: false
    }
  }
})
