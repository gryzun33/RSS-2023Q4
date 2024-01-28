import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  build: {
    sourcemap: true,
  },
  plugins: [eslintPlugin()],
});
