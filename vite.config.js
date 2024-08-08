import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// eslint-disable-next-line no-unused-vars
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    // Configuração de desenvolvimento
    return {
      plugins: [react()],
      server: {
        port: 5173,
        proxy: {
          '/api': {
            target: 'http://localhost:5000',
            changeOrigin: true,
          },
        },
      },
    };
  } else {
    // Configuração de produção
    return {
      plugins: [react()],
      build: {
        outDir: 'dist',
      },
      server: {
        // eslint-disable-next-line no-undef
        port: process.env.PORT || 3000, // Use a porta definida pelo Railway ou a 3000 como fallback
      },
    };
  }
});
