/// <reference types='vitest' />
/// <reference types="vite-plugin-svgr/client" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';
import svgr from 'vite-plugin-svgr';
import { join } from 'path';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/organisation',

  server: {
    port: 4200,
    host: 'localhost',
    fs: {
      allow: [path.resolve(__dirname, '../../ui/src/fonts')],
    },
  },

  preview: {
    port: 4300,
    host: 'localhost',
  },

  plugins: [
    svgr({
      include: '**/*.svg?react',
    }),
    react(),
    nxViteTsPaths(),
  ],
  css: {
    postcss: join(__dirname, 'postcss.config.js'),
  },
  define: {
    global: {},
  },

  build: {
    outDir: '../../dist/apps/organisation',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
      strictRequires: true,
    },
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
          if (id.includes('some-large-library')) {
            return 'large-lib';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
