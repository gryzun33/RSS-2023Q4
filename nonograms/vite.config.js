import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  build: {
    base: './',
    sourcemap: true,
  },
  plugins: [eslintPlugin()],
});
