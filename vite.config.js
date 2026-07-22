import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(),react()],
  server: {
    // host: true,
    // port: 8083,
    // strictPort: true,
    // hmr: {
    //   clientPort: 8083
    // },
    // proxy: {
    //   '/api': {
    //     target: 'http://13.204.165.35',
    //     changeOrigin: true
    //   }
    // }
  }
})