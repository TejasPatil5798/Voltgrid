import { defineConfig } from 'vite'

export default defineConfig({
  assetsInclude: ['**/*.JPG', '**/*.JPEG', '**/*.PNG'],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
