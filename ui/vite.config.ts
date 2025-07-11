/// <reference types='vitest' />
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import * as path from 'path';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
  logLevel: 'info',
  root: __dirname,
  cacheDir: '../node_modules/.vite/ui',
  plugins: [
    react(),
    nxViteTsPaths(),
    dts({
      entryRoot: 'src',
      tsconfigPath: path.join(__dirname, 'tsconfig.lib.json'),
    } as any),
  ],
  build: {
    outDir: '../dist/lib',
    emptyOutDir: true,
    reportCompressedSize: true,
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
      input: path.join(__dirname, '/src/index.ts'),
    },
    lib: {
      entry: 'src/index.ts',
      name: 'ui',
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
  },

  optimizeDeps: {
    include: [
      '@mui/material',
      '@emotion/react',
      '@storybook/react-vite',
      '@emotion/styled',
    ],
  },
});
