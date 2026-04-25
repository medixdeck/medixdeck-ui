"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ThemeMode = "light" | "dark";
export type ThemeModeSetting = ThemeMode | "system";

export interface UseThemeModeResult {
  /**
   * Indicates whether the hook has mounted on the client.
   * Primarily useful for avoiding SSR hydration mismatches with `next-themes`.
   */
  mounted: boolean;
  /**
   * The currently resolved theme mode.
   * Falls back to `"light"` before client-side theme values are available.
   */
  themeMode: ThemeMode;
  /**
   * The user's current theme preference (`"light"`, `"dark"`, or `"system"`).
   * Defaults to `"system"` before client-side hydration or when the provider
   * returns an unrecognised value (e.g. outside a `MedixProvider`).
   */
  themeSetting: ThemeModeSetting;
  /**
   * Updates the active theme preference.
   */
  setThemeMode: (mode: ThemeModeSetting) => void;
  /**
   * Toggles between `"light"` and `"dark"` modes.
   */
  toggleThemeMode: () => void;
}

/**
 * Accesses the current MedixDeck theme mode and helpers for updating it.
 *
 * In SSR environments (e.g. Next.js), `next-themes` resolves the theme after
 * hydration. Gate any theme-dependent UI on `mounted` to avoid hydration
 * mismatches and flicker. In Next.js App Router, this hook must be called
 * inside a `"use client"` component.
 *
 * @example
 * ```tsx
 * // Avoid hydration mismatch: render theme-dependent UI only after mount.
 * const { mounted, themeMode, toggleThemeMode } = useThemeMode();
 *
 * if (!mounted) return null;
 *
 * return (
 *   <button onClick={toggleThemeMode}>
 *     Switch to {themeMode === "dark" ? "light" : "dark"} mode
 *   </button>
 * );
 * ```
 */
export function useThemeMode(): UseThemeModeResult {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const themeMode: ThemeMode = resolvedTheme === "dark" ? "dark" : "light";
  const themeSetting: ThemeModeSetting =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const setThemeMode = useCallback(
    (mode: ThemeModeSetting) => {
      setTheme(mode);
    },
    [setTheme],
  );

  const toggleThemeMode = useCallback(() => {
    setTheme(themeMode === "dark" ? "light" : "dark");
  }, [setTheme, themeMode]);

  return {
    mounted,
    themeMode,
    themeSetting,
    setThemeMode,
    toggleThemeMode,
  };
}

/**
 * Convenience hook for checking whether the active MedixDeck theme is dark.
 *
 * Returns `false` until the component has mounted and `next-themes` has had a
 * chance to resolve the active theme. This avoids reporting light mode during
 * SSR or initial hydration when the resolved client theme is actually dark.
 */
export function useIsDarkMode(): boolean {
  const { mounted, themeMode } = useThemeMode();

  return mounted && themeMode === "dark";
}
