import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';
import path from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@assets': path.resolve(import.meta.dirname, 'src', 'assets'),
    },
  },
  base: './',
  build: {
    sourcemap: true,
  },
  plugins: [eslintPlugin()],
});
