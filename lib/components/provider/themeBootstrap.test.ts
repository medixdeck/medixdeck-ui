import { runInNewContext } from 'node:vm';
import { describe, expect, it } from 'vitest';
import { getThemeBootstrapScript } from './themeBootstrap';

function runBootstrap(options: {
  saved?: string;
  defaultMode?: 'light' | 'dark' | 'system';
  forcedMode?: 'light' | 'dark';
  systemDark?: boolean;
  blockedStorage?: boolean;
}) {
  const classes = new Set(['light', 'unrelated']);
  const style = { colorScheme: '' };
  const script = getThemeBootstrapScript(options.defaultMode ?? 'light', options.forcedMode);
  runInNewContext(script, {
    document: {
      documentElement: {
        classList: {
          remove: (...names: string[]) => names.forEach((name) => classes.delete(name)),
          add: (name: string) => classes.add(name),
        },
        style,
      },
    },
    window: {
      localStorage: {
        getItem: () => {
          if (options.blockedStorage) throw new Error('Storage denied');
          return options.saved ?? null;
        },
      },
      matchMedia: () => ({ matches: options.systemDark ?? false }),
    },
  });
  return { classes, style, script };
}

describe('literal theme bootstrap', () => {
  it('restores dark preference and keeps unrelated HTML classes', () => {
    const { classes, style, script } = runBootstrap({ saved: 'dark' });
    expect([...classes]).toEqual(['unrelated', 'dark']);
    expect(style.colorScheme).toBe('dark');
    expect(script).not.toContain('__name');
  });

  it('resolves system preference and honors a forced mode', () => {
    expect(runBootstrap({ saved: 'system', systemDark: true }).classes.has('dark')).toBe(true);
    expect(runBootstrap({ saved: 'dark', forcedMode: 'light' }).classes.has('light')).toBe(true);
  });

  it('uses defaults when storage is unavailable or contains an invalid value', () => {
    expect(
      runBootstrap({ defaultMode: 'system', systemDark: true, blockedStorage: true }).classes.has(
        'dark',
      ),
    ).toBe(true);
    expect(runBootstrap({ saved: 'invalid', defaultMode: 'dark' }).classes.has('dark')).toBe(true);
  });
});
