'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react';
import {
  cancelHaptic,
  canUseHaptics,
  type HapticInput,
  type HapticsConfig,
  isReducedMotionPreferred,
  type ResolvedHapticsConfig,
  resolveHapticsConfig,
  triggerHaptic,
} from '../utils/haptics';

export interface UseHapticsResult {
  /** Whether the Vibration API is available in this runtime. */
  isSupported: boolean;
  /** Effective enabled state after config and reduced-motion preference. */
  isEnabled: boolean;
  /** Trigger a haptic intent or custom pattern. Returns true if attempted. */
  trigger: (input: HapticInput) => boolean;
  /** Cancel ongoing vibration (best effort). */
  cancel: () => void;
  /** Resolved haptics configuration from provider/defaults. */
  config: ResolvedHapticsConfig;
}

export interface HapticsContextValue {
  config: ResolvedHapticsConfig;
  trigger: (input: HapticInput) => boolean;
  cancel: () => void;
}

const defaultConfig = resolveHapticsConfig(true);

export const HapticsContext = createContext<HapticsContextValue>({
  config: defaultConfig,
  trigger: (input) => triggerHaptic(input, { config: defaultConfig }),
  cancel: cancelHaptic,
});

function subscribeReducedMotion(callback: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return () => {};
  try {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', callback);
      return () => mql.removeEventListener('change', callback);
    }
    // Safari < 14
    mql.addListener(callback);
    return () => mql.removeListener(callback);
  } catch {
    return () => {};
  }
}

export interface HapticsProviderProps {
  /** Haptics configuration or boolean shorthand. @default true */
  haptics?: boolean | HapticsConfig;
  children: React.ReactNode;
}

/**
 * Internal provider for haptics configuration. `MedixProvider` renders this
 * automatically; consumers typically do not need to use it directly.
 */
export function HapticsProvider({ haptics, children }: HapticsProviderProps) {
  const config = useMemo(() => resolveHapticsConfig(haptics), [haptics]);

  const trigger = useCallback((input: HapticInput) => triggerHaptic(input, { config }), [config]);

  const cancel = useCallback(() => cancelHaptic(), []);

  const value = useMemo(() => ({ config, trigger, cancel }), [config, trigger, cancel]);

  return <HapticsContext.Provider value={value}>{children}</HapticsContext.Provider>;
}

/**
 * Access haptics configuration and trigger helpers.
 *
 * Safe to use without `MedixProvider` (falls back to defaults and no provider crash).
 */
export function useHaptics(): UseHapticsResult {
  const ctx = useContext(HapticsContext);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    isReducedMotionPreferred,
    () => false,
  );
  const supported = typeof navigator !== 'undefined' && canUseHaptics();

  const isEnabled =
    ctx.config.enabled &&
    ctx.config.strategy !== 'none' &&
    supported &&
    !(ctx.config.respectReducedMotion && reducedMotion);

  return {
    isSupported: supported,
    isEnabled,
    trigger: ctx.trigger,
    cancel: ctx.cancel,
    config: ctx.config,
  };
}

/**
 * Trigger haptics from non-React code paths using global navigator APIs.
 * Prefer `useHaptics().trigger` inside components when provider config matters.
 */
export function triggerGlobalHaptic(input: HapticInput, config?: boolean | HapticsConfig): boolean {
  return triggerHaptic(input, { config: resolveHapticsConfig(config) });
}

export type {
  HapticIntent,
  HapticInput,
  HapticPattern,
  HapticsConfig,
  ResolvedHapticsConfig,
} from '../utils/haptics';
