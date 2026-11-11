import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MedixProvider } from '../provider/MedixProvider';
import { NotFoundPage } from './NotFoundPage';

function renderPage(props: React.ComponentProps<typeof NotFoundPage>) {
  return render(
    <MedixProvider defaultColorMode="light">
      <NotFoundPage
        secondaryLabel="Contact Support"
        onAction={() => {}}
        onSecondaryAction={() => {}}
        {...props}
      />
    </MedixProvider>,
  );
}

describe('NotFoundPage colorScheme', () => {
  it('renders blue accents by default', () => {
    renderPage({});

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go back home' })).toHaveStyle({
      background: '#0685FF',
    });
    expect(screen.getByRole('button', { name: 'Contact Support' })).toHaveStyle({
      border: '1.5px solid #0685FF',
    });
  });

  it('renders purple accents when colorScheme="purple"', () => {
    renderPage({ colorScheme: 'purple' });

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Go back home' })).toHaveStyle({
      background: '#7700CC',
    });
    expect(screen.getByRole('button', { name: 'Contact Support' })).toHaveStyle({
      border: '1.5px solid #7700CC',
    });
  });
});
