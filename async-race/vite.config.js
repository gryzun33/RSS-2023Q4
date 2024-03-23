import { defineConfig } from 'vite';
import eslintPlugin from 'vite-plugin-eslint';

export default defineConfig({
  base: './',
  build: {
    sourcemap: true,
  },
  plugins: [eslintPlugin()],
  css: {
    modules: {
      localsConvention: 'camelCase',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/styles/fonts.scss";
          @import "./src/styles/variables.scss";
          @import "./src/styles/mixins.scss";
        `,
      },
    },
  },
});
