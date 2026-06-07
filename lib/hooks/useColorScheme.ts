'use client';

import { useCallback, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * The two MedixDeck brand color schemes available on themed components.
 * - `"blue"`   — Primary brand blue  (#0685FF)
 * - `"purple"` — Secondary brand purple (#7700CC)
 */
export type ColorScheme = 'blue' | 'purple';

export interface UseColorSchemeResult {
  /**
   * The currently active color scheme.
   */
  colorScheme: ColorScheme;
  /**
   * Explicitly set the active color scheme.
   */
  setColorScheme: (scheme: ColorScheme) => void;
  /**
   * Toggle between `"blue"` and `"purple"`.
   */
  toggleColorScheme: () => void;
  /**
   * `true` when the active scheme is `"blue"`.
   */
  isBlue: boolean;
  /**
   * `true` when the active scheme is `"purple"`.
   */
  isPurple: boolean;
}

/**
 * Manages the active MedixDeck brand color scheme for themed components such
 * as `Navbar`, `Footer`, `Accordion`, and `BlogCard`.
 *
 * Initialises to `"blue"` by default, or to the `initialScheme` you pass in.
 * The returned `setColorScheme` and `toggleColorScheme` helpers let you update
 * it at any time — the new value propagates down through whatever you pass it
 * to via the component's `colorScheme` prop.
 *
 * @param initialScheme - Starting scheme. Defaults to `"blue"`.
 *
 * @example
 * ```tsx
 * // Basic — bind to a single component
 * const { colorScheme, toggleColorScheme } = useColorScheme();
 *
 * return (
 *   <>
 *     <button onClick={toggleColorScheme}>Switch scheme</button>
 *     <Navbar colorScheme={colorScheme} navItems={[...]} />
 *   </>
 * );
 * ```
 *
 * @example
 * ```tsx
 * // Start purple; share across multiple components
 * const { colorScheme, setColorScheme } = useColorScheme("purple");
 *
 * return (
 *   <>
 *     <Navbar   colorScheme={colorScheme} navItems={[...]} />
 *     <Accordion colorScheme={colorScheme} items={[...]} />
 *     <Footer   colorScheme={colorScheme} />
 *   </>
 * );
 * ```
 */
export function useColorScheme(initialScheme: ColorScheme = 'blue'): UseColorSchemeResult {
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>(initialScheme);

  const setColorScheme = useCallback((scheme: ColorScheme) => {
    setColorSchemeState(scheme);
  }, []);

  const toggleColorScheme = useCallback(() => {
    setColorSchemeState((prev) => (prev === 'blue' ? 'purple' : 'blue'));
  }, []);

  return {
    colorScheme,
    setColorScheme,
    toggleColorScheme,
    isBlue: colorScheme === 'blue',
    isPurple: colorScheme === 'purple',
  };
}
