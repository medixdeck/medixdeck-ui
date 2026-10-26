import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync(resolve(__dirname, 'package.json'), 'utf-8'));
const externalPackages = new Set([
  ...Object.keys(packageJson.dependencies),
  ...Object.keys(packageJson.peerDependencies),
]);
// react-markdown is ESM-only. Bundle its universal implementation so the CJS
// entry remains usable without requiring synchronous ESM support from Node.
externalPackages.delete('react-markdown');
// These legacy CJS packages expose a nested default export. Bundle them so
// Rollup normalizes interop consistently in both the ESM and CommonJS entries.
externalPackages.delete('react-cookie-consent');
externalPackages.delete('react-country-flag');

const isStorybook =
  process.argv.includes('storybook') || process.env.npm_lifecycle_event?.includes('storybook');

export default defineConfig({
  define: {
    'import.meta.env.PACKAGE_VERSION': JSON.stringify(packageJson.version),
  },
  plugins: [
    react(),
    !isStorybook &&
      dts({
        include: ['lib'],
        exclude: ['src', '**/*.stories.*', '**/*.test.*', 'lib/test/**'],
        insertTypesEntry: true,
        rollupTypes: true,
      }),
  ],
  resolve: {
    // Library output runs in browsers AND DOM-free SSR. Never bake a
    // dependency's browser-only conditional entry into the shared bundle.
    conditions: ['module', 'development|production'],
    alias: {
      '@lib': resolve(__dirname, 'lib'),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'lib/index.ts'),
      name: 'MedixDeckUI',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: (id) =>
        [...externalPackages].some((name) => id === name || id.startsWith(`${name}/`)) ||
        /^@tiptap\//.test(id) ||
        /^prosemirror-/.test(id),
      output: {
        // TipTap's CJS entry exposes __esModule/default. Match that shape
        // instead of treating the entire require() object as StarterKit.
        interop: 'auto',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@chakra-ui/react': 'ChakraUI',
        },
        // Preserve directory structure for CSS if any
        assetFileNames: 'assets/[name][extname]',
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
