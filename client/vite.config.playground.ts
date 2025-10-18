import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import path from 'path';

export default defineConfig({
  root: 'src/_playground',
  build: {
    outDir: path.join(__dirname, 'src', '_playground', 'dist'),
    rollupOptions: {
      input: {
        app: path.join(__dirname, 'src', '_playground', 'index.html'),
      },
    },
  },
  plugins: [solid()],
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
});
