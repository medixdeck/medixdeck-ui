import { ReactElement } from 'react';
import { render as rtlRender, screen, fireEvent, RenderOptions } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Navbar, type NavItem } from './Navbar';
import { MedixProvider } from '../provider/MedixProvider';

const render = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  rtlRender(ui, { wrapper: MedixProvider, ...options });

const sampleNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      {
        label: 'Doctor Consultations',
        href: '/services/doctors',
        description: 'Connect with specialists',
        badge: 'Popular',
      },
      {
        label: 'Homecare Visits',
        href: '/services/homecare',
        description: 'Clinical nursing at home',
      },
    ],
  },
  { label: 'About Us', href: '/about' },
];

describe('Navbar Component', () => {
  it('renders standard navigation items', () => {
    render(<Navbar navItems={sampleNavItems} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Services')).toBeInTheDocument();
  });

  it('renders and triggers primary CTA button', () => {
    const handleCta = vi.fn();
    render(
      <Navbar
        navItems={sampleNavItems}
        ctaLabel="Talk to a Doctor"
        onCtaClick={handleCta}
      />,
    );

    const ctaButtons = screen.getAllByText('Talk to a Doctor');
    expect(ctaButtons.length).toBeGreaterThan(0);
    fireEvent.click(ctaButtons[0]);
    expect(handleCta).toHaveBeenCalledTimes(1);
  });

  it('renders and triggers secondary CTA button', () => {
    const handleSecondary = vi.fn();
    render(
      <Navbar
        navItems={sampleNavItems}
        secondaryCtaLabel="Sign In"
        onSecondaryCtaClick={handleSecondary}
      />,
    );

    const secondaryButtons = screen.getAllByText('Sign In');
    expect(secondaryButtons.length).toBeGreaterThan(0);
    fireEvent.click(secondaryButtons[0]);
    expect(handleSecondary).toHaveBeenCalledTimes(1);
  });

  it('renders dropdown triggers with accessibility attributes and toggles dropdown on click', () => {
    render(<Navbar navItems={sampleNavItems} />);

    const servicesTrigger = screen.getByRole('button', { name: /services/i });
    expect(servicesTrigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');

    // Click to open dropdown
    fireEvent.click(servicesTrigger);
    expect(servicesTrigger).toHaveAttribute('aria-expanded', 'true');

    // Verify dropdown items and descriptions appear
    expect(screen.getByText('Doctor Consultations')).toBeInTheDocument();
    expect(screen.getByText('Connect with specialists')).toBeInTheDocument();
    expect(screen.getByText('Popular')).toBeInTheDocument();
    expect(screen.getByText('Homecare Visits')).toBeInTheDocument();
  });

  it('closes desktop dropdown on Escape key', () => {
    render(<Navbar navItems={sampleNavItems} />);

    const servicesTrigger = screen.getByRole('button', { name: /services/i });
    fireEvent.click(servicesTrigger);
    expect(screen.getByText('Doctor Consultations')).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(servicesTrigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('toggles mobile menu and allows expanding mobile accordion submenus', () => {
    render(<Navbar navItems={sampleNavItems} />);

    const hamburger = screen.getByLabelText('Open menu');
    fireEvent.click(hamburger);

    // Mobile menu open
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();

    // Find the accordion button in the mobile menu
    const mobileDropdownTriggers = screen.getAllByRole('button', { name: /services/i });
    expect(mobileDropdownTriggers.length).toBeGreaterThan(0);

    // Click accordion trigger
    fireEvent.click(mobileDropdownTriggers[mobileDropdownTriggers.length - 1]);
    expect(screen.getAllByText('Doctor Consultations').length).toBeGreaterThan(0);
  });

  it('executes custom renderLink for dropdown children', () => {
    const customRenderLink = vi.fn((item: NavItem, children) => (
      <span data-testid={`link-${item.label}`}>{children}</span>
    ));

    render(<Navbar navItems={sampleNavItems} renderLink={customRenderLink} />);

    const servicesTrigger = screen.getByRole('button', { name: /services/i });
    fireEvent.click(servicesTrigger);

    expect(customRenderLink).toHaveBeenCalled();
    expect(screen.getByTestId('link-Doctor Consultations')).toBeInTheDocument();
  });
});
