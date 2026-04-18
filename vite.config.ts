import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { resolve } from "path";

const isStorybook = process.argv.includes("storybook") || process.env.npm_lifecycle_event?.includes("storybook");

export default defineConfig({
  plugins: [
    react(),
    !isStorybook && dts({
      include: ["lib"],
      exclude: ["src", "**/*.stories.*", "**/*.test.*"],
      insertTypesEntry: true,
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "lib"),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "lib/index.ts"),
      name: "MedixDeckUI",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "js" : "cjs"}`,
    },
    rollupOptions: {
      external: ["react", "react-dom", "react/jsx-runtime", "@chakra-ui/react"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "@chakra-ui/react": "ChakraUI",
        },
        // Preserve directory structure for CSS if any
        assetFileNames: "assets/[name][extname]",
      },
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
