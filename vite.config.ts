import { defineConfig } from 'vite';
import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

/**
 * @see https://vitejs.dev/config/
 */
export default defineConfig({
  plugins: [react(), eslintPlugin()],
  resolve: {
    alias: {
      '@': path.resolve('./src'),
    },
  },
  server: {
    allowedHosts: ['762eb3b1-4480-4af7-894e-ae17e439fef7-00-2jnjmus0gt3kg.spock.replit.dev']
  }
});
