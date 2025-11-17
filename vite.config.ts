import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  return {
    plugins: [react()],
    // Set the base path correctly for deployment vs. local development
    base: command === 'build' ? '/ai-persona-creator/' : '/',
    build: {
      target: 'esnext'
    }
  };
});