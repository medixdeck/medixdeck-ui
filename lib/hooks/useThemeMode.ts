'use client';

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';

export type ThemeMode = 'light' | 'dark';
export type ThemeModeSetting = ThemeMode | 'system';

export interface UseThemeModeResult {
  /**
   * Indicates whether the hook has mounted on the client.
   * Useful for avoiding SSR hydration mismatches with `next-themes`.
   */
  mounted: boolean;
  /**
   * The currently resolved theme mode ('light' or 'dark').
   */
  themeMode: ThemeMode;
  /**
   * The user's current theme preference ('light', 'dark', or 'system').
   */
  themeSetting: ThemeModeSetting;
  /**
   * Updates the active theme preference.
   */
  setThemeMode: (mode: ThemeModeSetting) => void;
  /**
   * Toggles between 'light' and 'dark' modes.
   */
  toggleThemeMode: () => void;
}

function subscribeDomTheme(callback: () => void) {
  if (typeof document === 'undefined') return () => { };
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  });
  if (document.body) {
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class'],
    });
  }
  return () => observer.disconnect();
}

function getDomIsDark(): boolean {
  if (typeof document === 'undefined') return false;
  return (
    document.documentElement.classList.contains('dark') ||
    document.body.classList.contains('dark')
  );
}

/**
 * Accesses the current MedixDeck theme mode and helpers for updating it.
 */
export function useThemeMode(): UseThemeModeResult {
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const isDomDark = useSyncExternalStore(
    subscribeDomTheme,
    getDomIsDark,
    () => false,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark' || isDomDark;
  const themeMode: ThemeMode = isDark ? 'dark' : 'light';
  const themeSetting: ThemeModeSetting =
    theme === 'light' || theme === 'dark' || theme === 'system' ? theme : 'system';

  const setThemeMode = useCallback(
    (mode: ThemeModeSetting) => {
      setTheme(mode);
    },
    [setTheme],
  );

  const toggleThemeMode = useCallback(() => {
    setTheme(themeMode === 'dark' ? 'light' : 'dark');
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
export function useIsDarkMode(): boolean {
  const { themeMode } = useThemeMode();
  return themeMode === 'dark';
}
