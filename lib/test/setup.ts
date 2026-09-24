import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Automatically cleanup React Testing Library after each test
afterEach(() => {
  cleanup();
});

// Mock matchMedia since JSDOM / happy-dom does not implement it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock fetch to avoid real network calls to external CDNs (Fontshare, Google Fonts)
if (typeof globalThis.fetch === 'function') {
  vi.spyOn(globalThis, 'fetch').mockImplementation(() =>
    Promise.resolve(new Response('', { status: 200, statusText: 'OK' })),
  );
}
