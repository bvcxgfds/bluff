import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/bluff/',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          socket: ['socket.io-client'],
          voice: ['livekit-client'],
          motion: ['framer-motion']
        }
      }
    }
  }
});
