import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MedixProvider } from '../provider/MedixProvider';
import { PWAInstallPrompt } from './PWAInstallPrompt';

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
