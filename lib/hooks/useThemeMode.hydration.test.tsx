import React, { act } from 'react';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { hydrateRoot, type Root } from 'react-dom/client';
import { waitFor } from '@testing-library/react';
import { beforeAll, expect, it } from 'vitest';
import { MedixProvider } from '../components/provider/MedixProvider';
import { useThemeMode } from './useThemeMode';

let serverHtml: string;
beforeAll(async () => {
  const { stdout } = await promisify(execFile)(
    process.execPath,
    ['scripts/check-ssr.mjs', '--theme-fixture'],
    { maxBuffer: 4 * 1024 * 1024 },
  );
  serverHtml = JSON.parse(stdout).html;
}, 300000);

function ThemeProbe() {
  const { themeMode, themeSetting, mounted } = useThemeMode();
  return <output data-ssr-theme>{`${themeMode}|${themeSetting}|${mounted}`}</output>;
}

it('hydrates real DOM-free SSR markup before restoring a saved dark preference', async () => {
  localStorage.setItem('theme', 'dark');
  document.documentElement.className = 'dark';
  const container = document.createElement('div');
  container.innerHTML = serverHtml;
  document.body.appendChild(container);
  expect(container.querySelector('output')?.textContent).toBe('light|system|false');
  const errors: unknown[] = [];
  let root: Root | undefined;
  try {
    await act(async () => {
      root = hydrateRoot(
        container,
        <MedixProvider defaultColorMode="light">
          <ThemeProbe />
        </MedixProvider>,
        { onRecoverableError: (error) => errors.push(error) },
      );
    });
    await waitFor(() =>
      expect(container.querySelector('output')?.textContent).toBe('dark|dark|true'),
    );
    expect(errors).toEqual([]);
    expect(document.documentElement).toHaveClass('dark');
  } finally {
    await act(async () => root?.unmount());
    container.remove();
    localStorage.clear();
    document.documentElement.className = '';
  }
}, 20000);
