import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// Automatically cleanup React Testing Library after each test
afterEach(() => {
  cleanup();
});
