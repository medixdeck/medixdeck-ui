import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MedixProvider } from '../provider/MedixProvider';
import { ServerErrorPage } from './ServerErrorPage';

function renderPage(props: React.ComponentProps<typeof ServerErrorPage>) {
  return render(
    <MedixProvider defaultColorMode="light">
      <ServerErrorPage
        secondaryLabel="System Status"
        onAction={() => {}}
        onSecondaryAction={() => {}}
        {...props}
      />
    </MedixProvider>,
  );
}

describe('ServerErrorPage colorScheme', () => {
  it('renders blue buttons by default', () => {
    renderPage({});

    expect(screen.getByRole('button', { name: 'Try again' })).toHaveStyle({
      background: '#0685FF',
    });
    expect(screen.getByRole('button', { name: 'System Status' })).toHaveStyle({
      border: '1.5px solid #0685FF',
    });
  });

  it('renders purple buttons when colorScheme="purple"', () => {
    renderPage({ colorScheme: 'purple' });

    expect(screen.getByRole('button', { name: 'Try again' })).toHaveStyle({
      background: '#7700CC',
    });
    expect(screen.getByRole('button', { name: 'System Status' })).toHaveStyle({
      border: '1.5px solid #7700CC',
    });
  });

  it('keeps the red error icon on all schemes', () => {
    for (const colorScheme of ['blue', 'purple'] as const) {
      const { container, unmount } = renderPage({ colorScheme });
      // Alert-circle icon (r=10) is always rendered inside the status disc
      const icon = container.querySelector('svg circle[cx="12"][r="10"]');
      expect(icon).not.toBeNull();
      unmount();
    }
  });
});
