import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Ajuste conforme o ambiente de produção
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
  },
});
