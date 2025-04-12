import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend server
        changeOrigin: true, // Ensure the request appears to come from the frontend server
        rewrite: (path) => path.replace(/^\/api/, ''), // Optional: Remove '/api' prefix
      },
    },
  },
})
