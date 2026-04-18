import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "lib"),
    },
  },
  build: {
    outDir: "dist-app", // Output to a different folder to avoid mixing with library build
    emptyOutDir: true,
  },
});
