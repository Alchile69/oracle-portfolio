import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // AJOUTEZ CETTE LIGNE

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  resolve: { // AJOUTEZ CETTE SECTION
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});