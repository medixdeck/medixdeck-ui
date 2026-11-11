import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  canUseHaptics,
  cancelHaptic,
  DEFAULT_HAPTIC_PATTERNS,
  isReducedMotionPreferred,
  resolveHapticPattern,
  resolveHapticsConfig,
  triggerHaptic,
} from './haptics';

describe('haptics utils', () => {
  const originalVibrate = (navigator as any).vibrate;
  const originalMatchMedia = window.matchMedia;

  beforeEach(() => {
    (navigator as any).vibrate = vi.fn(() => true);
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as any;
  });

  afterEach(() => {
    (navigator as any).vibrate = originalVibrate;
    window.matchMedia = originalMatchMedia;
    vi.restoreAllMocks();
  });

  it('detects vibration support', () => {
    expect(canUseHaptics()).toBe(true);
  });

  it('resolves default intent patterns', () => {
    expect(resolveHapticPattern('selection')).toBe(DEFAULT_HAPTIC_PATTERNS.selection);
    expect(resolveHapticPattern('error')).toEqual(DEFAULT_HAPTIC_PATTERNS.error);
  });

  it('returns null for disabled/invalid inputs', () => {
    expect(resolveHapticPattern(false)).toBeNull();
    expect(resolveHapticPattern(null)).toBeNull();
    expect(resolveHapticPattern(0)).toBeNull();
  });

  it('triggers navigator.vibrate for supported intents', () => {
    const ok = triggerHaptic('impactMedium');
    expect(ok).toBe(true);
    expect((navigator as any).vibrate).toHaveBeenCalledWith(DEFAULT_HAPTIC_PATTERNS.impactMedium);
  });

  it('does not trigger when disabled in config', () => {
    const ok = triggerHaptic('selection', { config: { enabled: false } });
    expect(ok).toBe(false);
    expect((navigator as any).vibrate).not.toHaveBeenCalled();
  });

  it('respects reduced motion by default', () => {
    window.matchMedia = vi.fn().mockImplementation((query: string) => ({
      matches: query.includes('prefers-reduced-motion'),
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })) as any;
    expect(isReducedMotionPreferred()).toBe(true);
    const ok = triggerHaptic('selection');
    expect(ok).toBe(false);
  });

  it('cancel calls vibrate(0)', () => {
    cancelHaptic();
    expect((navigator as any).vibrate).toHaveBeenCalledWith(0);
  });

  it('resolveHapticsConfig supports boolean shorthand', () => {
    expect(resolveHapticsConfig(false).enabled).toBe(false);
    expect(resolveHapticsConfig(true).enabled).toBe(true);
  });
});
