import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom"],
  },
  server: {
    port: 9090,
    proxy: {
      "/socket.io": {
        target: "http://localhost:9000/socket.io",
        ws: true,
        changeOrigin: true
      },
      "/api/player": {
        target: "http://localhost:9000/api/player",
        changeOrigin: true
      },
      "/api/x-sounds": {
        target: "http://localhost:9000/",
        changeOrigin: true
      },
      "/api/commands/text": {
        target: "http://localhost:9000/",
        changeOrigin: true
      },
      "/api/auth": {
        target: "http://localhost:9000/",
        changeOrigin: true
      }
    }
  }
});
