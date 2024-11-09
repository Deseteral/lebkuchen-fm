import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
// @ts-ignore
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
  plugins: [solid()],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  server: {
    port: 9090,
    proxy: {
      '/api/event-stream': {
        target: 'ws://localhost:8080',
        ws: true,
        changeOrigin: true,
      },
      '^/api/.*': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
      },
    },
  },
});
