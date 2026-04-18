"use client";

import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { system } from "../../theme";

export interface MedixProviderProps {
  children: React.ReactNode;
  /**
   * Default color mode. Matches next-themes attribute.
   * @default "system"
   */
  defaultColorMode?: "light" | "dark" | "system";
  /**
   * Force a specific color mode (disables user toggle)
   */
  forcedColorMode?: "light" | "dark";
}

// ─────────────────────────────────────────────────────────────────────────────
// Font stylesheet URLs
// Satoshi is from Fontshare. Inter is a Google Fonts fallback for multi-weight
// support across consuming projects.
// ─────────────────────────────────────────────────────────────────────────────
const FONT_URLS = [
  "https://api.fontshare.com/v2/css?f[]=satoshi@400,500,600,700&display=swap",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
];

// ─────────────────────────────────────────────────────────────────────────────
// Global CSS injected once by MedixProvider.
//
// 1. --font-body / --font-heading  — bridge between our component code that
//    uses var(--font-body) and the actual fonts (Satoshi with system fallbacks).
//    Components reference these vars; this block gives them concrete values.
//
// 2. --medix-form-* — form-element color tokens for native inputs that can't
//    use Chakra's semantic token system. Flip automatically when .dark is on
//    any ancestor element.
//
// 3. color-scheme + autofill overrides for native browser controls.
// ─────────────────────────────────────────────────────────────────────────────
const GLOBAL_STYLES = `
  /* ── Font custom properties ─────────────────────────────────────────────── */
  :root {
    --font-heading: 'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont,
                   'Segoe UI', Helvetica, Arial, sans-serif;
    --font-body:    'Satoshi', 'Inter', -apple-system, BlinkMacSystemFont,
                   'Segoe UI', Helvetica, Arial, sans-serif;
    --font-mono:    'JetBrains Mono', 'Fira Code', 'Fira Mono',
                   'Courier New', monospace;
  }

  /* Apply Satoshi to every element by default so components inherit it */
  html, body, * {
    font-family: var(--font-body);
  }

  /* ── Form-element color tokens (light mode defaults) ────────────────────── */
  :root {
    --medix-form-bg:          #F6F6F6;
    --medix-form-bg-subtle:   #F0F4F8;
    --medix-form-text:        #111926;
    --medix-form-text-muted:  #6B7280;
    --medix-form-border:      #E2E8F0;
    --medix-form-placeholder: #9CA3AF;
  }

  /* ── Dark mode overrides — activates whenever .dark is on any ancestor ──── */
  .dark {
    --medix-form-bg:          #152035;
    --medix-form-bg-subtle:   #0F1C2E;
    --medix-form-text:        #F5F6F8;
    --medix-form-text-muted:  #94A3B8;
    --medix-form-border:      #1E3554;
    --medix-form-placeholder: #4A5568;
  }

  /* Native browser controls follow dark/light color-scheme */
  .dark input, .dark select, .dark textarea { color-scheme: dark; }
  :not(.dark) input, :not(.dark) select, :not(.dark) textarea { color-scheme: light; }

  /* Placeholder colour in dark mode */
  .dark input::placeholder, .dark textarea::placeholder {
    color: var(--medix-form-placeholder) !important;
  }

  /* Webkit autofill override in dark mode */
  .dark input:-webkit-autofill,
  .dark input:-webkit-autofill:hover,
  .dark input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 30px var(--medix-form-bg) inset !important;
    -webkit-text-fill-color: var(--medix-form-text) !important;
    caret-color: var(--medix-form-text) !important;
  }

  /* ── Button loading spinner ──────────────────────────────────────────────── */
  @keyframes medix-spin {
    to { transform: rotate(360deg); }
  }
`;

// Singleton flags — only inject once per document lifetime
let fontsInjected = false;
let stylesInjected = false;

/**
 * Injects Satoshi + Inter font <link> tags into document.head.
 * Uses preconnect hints for faster CDN handshakes.
 * Safe to call multiple times — only runs once.
 */
function injectFonts() {
  if (typeof document === "undefined" || fontsInjected) return;

  // Preconnect hints
  const preconnects = [
    "https://api.fontshare.com",
    "https://fonts.googleapis.com",
    "https://fonts.gstatic.com",
  ];
  preconnects.forEach((href) => {
    if (document.head.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = href;
    if (href.includes("gstatic")) link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  });

  // Font stylesheets
  FONT_URLS.forEach((href) => {
    if (document.head.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
  });

  fontsInjected = true;
}

/**
 * Injects the MedixDeck global CSS (font vars + form-color vars).
 * Safe to call multiple times — only runs once.
 */
function injectGlobalStyles() {
  if (typeof document === "undefined" || stylesInjected) return;
  const style = document.createElement("style");
  style.setAttribute("data-medixdeck", "global");
  style.textContent = GLOBAL_STYLES;
  // Prepend so it is overridable by app-level styles
  document.head.insertBefore(style, document.head.firstChild);
  stylesInjected = true;
}

/**
 * MedixDeck UI Provider
 *
 * Wrap your app root with this component to apply the MedixDeck theme,
 * load the Satoshi & Inter fonts, and enable dark mode support.
 *
 * The provider automatically injects:
 * - Font `<link>` tags (Satoshi via Fontshare, Inter via Google Fonts)
 * - `--font-body` / `--font-heading` / `--font-mono` CSS custom properties
 * - `--medix-form-*` color tokens for native form elements
 * - `color-scheme` overrides for browser native controls
 *
 * @example
 * ```tsx
 * import { MedixProvider } from "@medixdeck/ui";
 *
 * function App() {
 *   return (
 *     <MedixProvider defaultColorMode="light">
 *       <YourApp />
 *     </MedixProvider>
 *   );
 * }
 * ```
 */
export function MedixProvider({
  children,
  defaultColorMode = "system",
  forcedColorMode,
}: MedixProviderProps) {
  // Run on mount — safe in SSR (typeof document guard inside each fn)
  React.useEffect(() => {
    injectFonts();
    injectGlobalStyles();
  }, []);

  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme={defaultColorMode}
      forcedTheme={forcedColorMode}
      disableTransitionOnChange
    >
      <ChakraProvider value={system}>{children}</ChakraProvider>
    </NextThemesProvider>
  );
}

export default MedixProvider;
