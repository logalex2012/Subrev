import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // SPA fallback: все неизвестные пути → index.html
    historyApiFallback: true,
  },
  preview: {
    historyApiFallback: true,
  },
})
