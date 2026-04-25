"use client";

import { useCallback, useEffect, useState } from "react";
import { useTheme } from "next-themes";

export type ThemeMode = "light" | "dark";
export type ThemeModeSetting = ThemeMode | "system";

export interface UseThemeModeResult {
  /**
   * Indicates whether the hook has mounted and the active theme has resolved.
   */
  mounted: boolean;
  /**
   * The currently resolved theme mode.
   * Falls back to `"light"` until the client has mounted.
   */
  themeMode: ThemeMode;
  /**
   * The user's current theme preference.
   * Can be `"system"` when the provider is configured to follow the OS setting.
   */
  themeSetting?: ThemeModeSetting;
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
 * @example
 * ```tsx
 * const { themeMode, toggleThemeMode } = useThemeMode();
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
  const themeSetting =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : undefined;

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
 */
export function useIsDarkMode() {
  const { themeMode } = useThemeMode();

  return themeMode === "dark";
}
