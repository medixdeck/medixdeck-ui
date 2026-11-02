import type React from 'react';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import { MedixProvider } from '../provider/MedixProvider';
import { PWAInstallPrompt } from './PWAInstallPrompt';

// Keep visibility assertions independent of Framer Motion's exit animation.
vi.mock('framer-motion', () => ({
  AnimatePresence: ({ children }: React.PropsWithChildren) => children,
  motion: { div: ({ children }: React.PropsWithChildren) => <div>{children}</div> },
}));

function renderPrompt(props: React.ComponentProps<typeof PWAInstallPrompt>) {
  return render(
    <MedixProvider defaultColorMode="light">
      <PWAInstallPrompt forceVisible {...props} />
    </MedixProvider>,
  );
}

describe('PWAInstallPrompt colorScheme', () => {
  it('renders blue accents by default', () => {
    renderPrompt({ title: 'Install MedixDeck' });

    expect(screen.getByRole('button', { name: 'Install' })).toHaveStyle({
      background: '#0685FF',
    });
    // Dismiss stays neutral gray regardless of scheme
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });

  it('renders purple install button when colorScheme="purple"', () => {
    renderPrompt({ title: 'Install MedixDeck', colorScheme: 'purple' });

    expect(screen.getByRole('button', { name: 'Install' })).toHaveStyle({
      background: '#7700CC',
    });
    expect(screen.getByRole('button', { name: 'Not now' })).toBeInTheDocument();
  });

  it('renders blue iOS share icon and step badges by default', () => {
    const { container } = renderPrompt({ title: 'Install MedixDeck', forceIOS: true });

    const shareIcon = container.querySelector('svg[stroke="#0685FF"]');
    expect(shareIcon).not.toBeNull();
  });

  it('renders purple iOS share icon and step badges when colorScheme="purple"', () => {
    const { container } = renderPrompt({
      title: 'Install MedixDeck',
      forceIOS: true,
      colorScheme: 'purple',
    });

    const shareIcon = container.querySelector('svg[stroke="#7700CC"]');
    expect(shareIcon).not.toBeNull();
    // iOS mode hides the install button and shows "Got it" dismiss
    expect(screen.getByRole('button', { name: 'Got it' })).toBeInTheDocument();
  });
});

describe('PWAInstallPrompt installation lifecycle', () => {
  const storageKey = 'medixdeck_pwa_dismissed';

  function renderInstallPrompt(props: React.ComponentProps<typeof PWAInstallPrompt> = {}) {
    return renderPrompt({ forceVisible: false, ...props });
  }

  function dispatchInstallEvent(outcome: 'accepted' | 'dismissed' = 'accepted') {
    const prompt = vi.fn().mockResolvedValue(undefined);
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      platforms: ['web'],
      prompt,
      userChoice: Promise.resolve({ outcome, platform: 'web' }),
    });
    act(() => {
      window.dispatchEvent(event);
    });
    return { prompt, event };
  }

  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('waits for a browser install event before offering installation', () => {
    renderInstallPrompt();
    act(() => {
      vi.advanceTimersByTime(60000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('calls the captured browser prompt from the delayed Install button', async () => {
    const onInstall = vi.fn();
    renderInstallPrompt({ delaySeconds: 30, onInstall });
    const { prompt, event } = dispatchInstallEvent();
    expect(event.defaultPrevented).toBe(true);
    act(() => {
      vi.advanceTimersByTime(29999);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    });
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(onInstall).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    dispatchInstallEvent();
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it.each(['Not now', 'Close install prompt'])(
    'respects %s dismissal on later events and remount',
    (name) => {
      const onDismiss = vi.fn();
      const view = renderInstallPrompt({ onDismiss });
      dispatchInstallEvent();
      fireEvent.click(screen.getByRole('button', { name }));
      expect(localStorage.getItem(storageKey)).not.toBeNull();
      expect(onDismiss).toHaveBeenCalledTimes(1);
      dispatchInstallEvent();
      expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
      view.unmount();
      renderInstallPrompt();
      dispatchInstallEvent();
      expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    },
  );

  it('applies the cooldown and onDismiss callback to native dialog dismissal', async () => {
    const onDismiss = vi.fn();
    const onInstall = vi.fn();
    const view = renderInstallPrompt({ onDismiss, onInstall });
    dispatchInstallEvent('dismissed');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(onInstall).not.toHaveBeenCalled();
    expect(localStorage.getItem(storageKey)).not.toBeNull();
    dispatchInstallEvent();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    view.unmount();
    renderInstallPrompt();
    dispatchInstallEvent();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('keeps dismissal in memory when localStorage is unavailable', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('Storage blocked');
      },
      setItem: () => {
        throw new Error('Storage blocked');
      },
    });
    renderInstallPrompt();
    dispatchInstallEvent();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    dispatchInstallEvent();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('cancels a delayed banner on appinstalled and ignores subsequent events', () => {
    renderInstallPrompt({ delaySeconds: 30 });
    dispatchInstallEvent();
    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    dispatchInstallEvent();
    act(() => {
      vi.advanceTimersByTime(30000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('replaces an earlier delay and uses the latest browser event', async () => {
    renderInstallPrompt({ delaySeconds: 10 });
    const first = dispatchInstallEvent();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    const second = dispatchInstallEvent();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    });
    expect(first.prompt).not.toHaveBeenCalled();
    expect(second.prompt).toHaveBeenCalledTimes(1);
  });

  it('cancels another queued display when the visible banner is dismissed', () => {
    renderInstallPrompt({ delaySeconds: 10 });
    dispatchInstallEvent();
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    dispatchInstallEvent();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('rechecks persisted dismissal before a delayed banner appears', () => {
    renderInstallPrompt({ delaySeconds: 10 });
    dispatchInstallEvent();
    localStorage.setItem(storageKey, String(Date.now()));
    act(() => {
      vi.advanceTimersByTime(10000);
    });
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
  });

  it('allows a fresh install event after the configured cooldown expires', () => {
    renderInstallPrompt({ cooldownDays: 2 });
    dispatchInstallEvent();
    fireEvent.click(screen.getByRole('button', { name: 'Not now' }));
    vi.setSystemTime(Date.now() + 2 * 24 * 60 * 60 * 1000);
    dispatchInstallEvent();
    expect(screen.getByRole('button', { name: 'Install' })).toBeInTheDocument();
  });

  it('consumes the event once and suppresses new offers while installation is pending', async () => {
    let finishPrompt!: () => void;
    const prompt = vi.fn().mockReturnValue(
      new Promise<void>((resolve) => {
        finishPrompt = resolve;
      }),
    );
    const event = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), {
      prompt,
      userChoice: Promise.resolve({ outcome: 'accepted', platform: 'web' }),
    });
    const onInstall = vi.fn();
    renderInstallPrompt({ onInstall });
    act(() => {
      window.dispatchEvent(event);
    });
    const button = screen.getByRole('button', { name: 'Install' });
    act(() => {
      fireEvent.click(button);
      fireEvent.click(button);
    });
    const next = dispatchInstallEvent();
    expect(prompt).toHaveBeenCalledTimes(1);
    expect(next.prompt).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    await act(async () => {
      finishPrompt();
    });
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  it('discards a failed event and waits for a fresh event before allowing another attempt', async () => {
    const onInstall = vi.fn();
    renderInstallPrompt({ onInstall });
    const failed = dispatchInstallEvent();
    failed.prompt.mockRejectedValueOnce(new Error('Event already consumed'));
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    });
    expect(onInstall).not.toHaveBeenCalled();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    const fresh = dispatchInstallEvent();
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Install' }));
    });
    expect(failed.prompt).toHaveBeenCalledTimes(1);
    expect(fresh.prompt).toHaveBeenCalledTimes(1);
    expect(onInstall).toHaveBeenCalledTimes(1);
  });

  it('preserves manual iOS instructions and their dismissal cooldown', () => {
    vi.stubGlobal('navigator', { userAgent: 'iPhone' });
    const view = renderInstallPrompt();
    expect(screen.getByText('Tap Share')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Install' })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: 'Got it' }));
    view.unmount();
    renderInstallPrompt();
    expect(screen.queryByRole('button', { name: 'Got it' })).toBeNull();
  });
});
