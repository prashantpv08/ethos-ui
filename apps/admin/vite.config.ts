/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import { resolve } from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/admin',

  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [resolve(__dirname, '../../ui/src/fonts')],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  resolve: {
    alias: {
      '@fonts': resolve(__dirname, '../../ui/src/fonts/assets'),
    },
  },

  assetsInclude: ['**/*.eot'],
  plugins: [react(), nxViteTsPaths()],

  build: {
    outDir: '../../dist/apps/admin',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
