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
      '/socket.io': {
        // target: 'http://localhost:9000/socket.io',
        target: 'https://lebkuchen-fm-dev.fly.dev/socket.io',
        ws: true,
        changeOrigin: true,
      },
      '^/api/.*': {
        // target: 'http://localhost:9000/',
        target: 'https://lebkuchen-fm-dev.fly.dev/',
        changeOrigin: true,
      },
    },
  },
});
