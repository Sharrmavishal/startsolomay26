import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // Explicitly setting base path to '/' to ensure assets are loaded correctly
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'public/admin/index.html')
      }
    },
    // Make source maps for easier debugging
    sourcemap: true,
    // Ensure _redirects file is copied to dist
    copyPublicDir: true
  },
  optimizeDeps: {
    exclude: ['lucide-react']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  }
});