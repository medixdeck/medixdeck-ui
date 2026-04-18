import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "lib"),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./lib/test/setup.ts",
    include: ["lib/**/*.test.{ts,tsx}"],
  },
});
