import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  ],
  // Explicitly setting base path to '/' to ensure assets are loaded correctly
  base: '/',
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'public/admin/index.html')
      },
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
          utils: ['@supabase/supabase-js', '@cloudinary/react', '@cloudinary/url-gen']
        }
      }
    },
    // Make source maps for easier debugging
    sourcemap: true,
    // Ensure _redirects file is copied to dist
    copyPublicDir: true,
    // Optimize build size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['lucide-react']
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  // Performance optimizations
  server: {
    hmr: {
      overlay: false
    }
  }
});