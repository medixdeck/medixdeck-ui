import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@lib': resolve(__dirname, 'lib'),
    },
  },
  test: {
    environment: 'happy-dom',
    environmentOptions: {
      happyDOM: {
        settings: {
          disableCSSFileLoading: true,
          disableJavaScriptFileLoading: true,
          handleDisabledFileLoadingAsSuccess: true,
        },
      },
    },
    globals: true,
    pool: 'threads',
    maxWorkers: process.env.CI ? 2 : 1,
    setupFiles: './lib/test/setup.ts',
    include: ['lib/**/*.test.{ts,tsx}'],
  },
});
