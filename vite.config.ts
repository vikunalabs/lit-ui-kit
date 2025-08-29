import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'LitUIKit',
      fileName: (format) => `lit-ui-kit.${format}.js`,
      formats: ['es', 'cjs'],
    },
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ['lit'],
    },
  },
    resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
});