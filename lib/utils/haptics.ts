'use client';

/**
 * MedixDeck Haptics
 *
 * Lightweight, SSR-safe haptic feedback utilities for web/PWA environments.
 * Uses the Vibration API when available (primarily Android/Chromium). iOS
 * Safari does not support navigator.vibrate, so calls become graceful no-ops
 * unless an experimental fallback is added in the future.
 *
 * Haptics are an enhancement, never the only signal. Visual/state feedback and
 * accessibility semantics must remain primary.
 */

export type HapticIntent =
  | 'selection'
  | 'impactLight'
  | 'impactMedium'
  | 'impactHeavy'
  | 'success'
  | 'warning'
  | 'error'
  | 'notification';

/** Vibration API-compatible pattern: duration in ms or [vibrate, pause, ...]. */
export type HapticPattern = number | number[];

/** Accept semantic intents, custom patterns, or false/null to disable. */
export type HapticInput = HapticIntent | HapticPattern | false | null | undefined;

export interface HapticsConfig {
  /** Master enable switch. @default true */
  enabled?: boolean;
  /** Suppress haptics when prefers-reduced-motion matches. @default true */
  respectReducedMotion?: boolean;
  /** Override default intent patterns. */
  patterns?: Partial<Record<HapticIntent, HapticPattern>>;
  /** Execution strategy. @default "vibration" */
  strategy?: 'vibration' | 'none';
  /** Emit debug logs in development. @default false */
  debug?: boolean;
}

export interface ResolvedHapticsConfig {
  enabled: boolean;
  respectReducedMotion: boolean;
  patterns: Record<HapticIntent, HapticPattern>;
  strategy: 'vibration' | 'none';
  debug: boolean;
}

export const DEFAULT_HAPTIC_PATTERNS: Record<HapticIntent, HapticPattern> = {
  selection: 10,
  impactLight: 12,
  impactMedium: 20,
  impactHeavy: [30, 40, 30],
  success: [10, 30, 20],
  warning: [20, 40, 20],
  error: [30, 30, 30],
  notification: 15,
};

export const DEFAULT_HAPTICS_CONFIG: ResolvedHapticsConfig = {
  enabled: true,
  respectReducedMotion: true,
  patterns: DEFAULT_HAPTIC_PATTERNS,
  strategy: 'vibration',
  debug: false,
};

function isHapticIntent(value: unknown): value is HapticIntent {
  return (
    value === 'selection' ||
    value === 'impactLight' ||
    value === 'impactMedium' ||
    value === 'impactHeavy' ||
    value === 'success' ||
    value === 'warning' ||
    value === 'error' ||
    value === 'notification'
  );
}

function normalizePattern(pattern: number | number[]): HapticPattern | null {
  if (typeof pattern === 'number') {
    if (!Number.isFinite(pattern) || pattern <= 0) return null;
    return Math.round(pattern);
  }
  if (!Array.isArray(pattern) || pattern.length === 0) return null;
  const cleaned = pattern
    .map((v) => (Number.isFinite(v) ? Math.max(0, Math.round(v)) : 0))
    .filter((_, i, arr) => !(arr.length === 1 && arr[0] === 0));
  if (cleaned.length === 0) return null;
  // Ensure at least one non-zero vibration segment exists
  if (!cleaned.some((v) => v > 0)) return null;
  return cleaned;
}

/** Resolve a partial config against defaults. */
export function resolveHapticsConfig(config?: boolean | HapticsConfig | null): ResolvedHapticsConfig {
  if (config === false) {
    return { ...DEFAULT_HAPTICS_CONFIG, enabled: false };
  }
  if (config === true || config == null) {
    return { ...DEFAULT_HAPTICS_CONFIG };
  }
  return {
    enabled: config.enabled ?? DEFAULT_HAPTICS_CONFIG.enabled,
    respectReducedMotion:
      config.respectReducedMotion ?? DEFAULT_HAPTICS_CONFIG.respectReducedMotion,
    patterns: { ...DEFAULT_HAPTIC_PATTERNS, ...(config.patterns ?? {}) },
    strategy: config.strategy ?? DEFAULT_HAPTICS_CONFIG.strategy,
    debug: config.debug ?? DEFAULT_HAPTICS_CONFIG.debug,
  };
}

/** True when the Vibration API is present. */
export function canUseHaptics(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';
}

/** True when the user prefers reduced motion. Safe during SSR. */
export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return false;
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
}

/** Resolve an input intent/pattern to a concrete Vibration API pattern. */
export function resolveHapticPattern(
  input: HapticInput,
  config?: ResolvedHapticsConfig | HapticsConfig | boolean | null,
): HapticPattern | null {
  if (input === false || input == null) return null;
  const resolved = isResolvedConfig(config) ? config : resolveHapticsConfig(config as any);
  if (typeof input === 'string') {
    if (!isHapticIntent(input)) return null;
    return normalizePattern(resolved.patterns[input] ?? DEFAULT_HAPTIC_PATTERNS[input]);
  }
  return normalizePattern(input);
}

function isResolvedConfig(config: unknown): config is ResolvedHapticsConfig {
  return !!config && typeof config === 'object' && 'patterns' in config && 'enabled' in config && Array.isArray((config as any).patterns) === false;
}

/** Cancel any ongoing vibration pattern (best effort). */
export function cancelHaptic(): void {
  if (!canUseHaptics()) return;
  try {
    navigator.vibrate(0);
  } catch {
    // ignore
  }
}

export interface TriggerHapticOptions {
  config?: ResolvedHapticsConfig | HapticsConfig | boolean | null;
  /** Bypass reduced-motion preference check (use sparingly). */
  force?: boolean;
}

/**
 * Trigger haptic feedback. Returns true if a vibration call was attempted.
 * Always safe to call (SSR/no-support/reduced-motion/disabled => false).
 */
export function triggerHaptic(input: HapticInput, options?: TriggerHapticOptions): boolean {
  const config = isResolvedConfig(options?.config)
    ? options!.config
    : resolveHapticsConfig(options?.config as any);

  if (!config.enabled || config.strategy === 'none') return false;
  if (typeof window === 'undefined' || !canUseHaptics()) return false;
  if (!options?.force && config.respectReducedMotion && isReducedMotionPreferred()) return false;

  const pattern = resolveHapticPattern(input, config);
  if (pattern == null) return false;

  try {
    const ok = navigator.vibrate(pattern);
    if (config.debug && typeof console !== 'undefined') {
      // eslint-disable-next-line no-console
      console.debug('[medixdeck:haptics]', { input, pattern, ok });
    }
    return Boolean(ok);
  } catch {
    return false;
  }
}

/**
 * Convenience helper to get a default intent for common button variants.
 */
export function getButtonHapticIntent(variant?: string): HapticIntent {
  if (variant === 'ghost' || variant === 'link') return 'impactLight';
  return 'impactMedium';
}
