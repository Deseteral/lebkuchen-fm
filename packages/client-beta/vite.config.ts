import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// eslint-disable-next-line import/no-default-export
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
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  server: {
    port: 9090,
    proxy: {
      '/socket.io': {
        target: 'http://localhost:9000/socket.io',
        ws: true,
        changeOrigin: true,
      },
      '^/api/.*': {
        target: 'http://localhost:9000/',
        changeOrigin: true,
      },
    },
  },
});
