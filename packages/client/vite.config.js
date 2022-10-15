import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: path.join(__dirname, 'dist'),
    rollupOptions: {
      input: {
        app: path.join(__dirname, 'src', 'index.html'),
      },
    },
  },
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  server: {
    port: 9090,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:9000/socket.io',
        ws: true,
        changeOrigin: true
      },
      '^\/api\/.*': {
        target: 'http://localhost:9000/',
        changeOrigin: true
      }
    }
  }
});
