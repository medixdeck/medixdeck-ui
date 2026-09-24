import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MedixProvider } from '../provider/MedixProvider';
import { DashboardLayout, type DashboardNavGroup } from './DashboardLayout';

const TEST_NAV_GROUPS: DashboardNavGroup[] = [
  {
    items: [
      { label: 'Overview', href: '/overview', isActive: true },
      {
        label: 'Consultations',
        href: '/consultations',
        badge: 3,
        subItems: [
          { label: 'Upcoming', href: '/consultations/upcoming' },
          { label: 'Past Sessions', href: '/consultations/past' },
        ],
      },
      { label: 'Messages', href: '/messages', hasDot: true },
    ],
  },
  {
    groupLabel: 'Management',
    items: [
      { label: 'Prescriptions', href: '/prescriptions' },
      { label: 'Wallet', href: '/wallet' },
    ],
  },
];

const TEST_USER = { name: 'Dr. Amina Bello', email: 'amina@medixdeck.com' };

describe('DashboardLayout Component', () => {
  it('renders user greeting, logo, and navigation groups', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout user={TEST_USER} navGroups={TEST_NAV_GROUPS} environment="production">
          <div>Dashboard Main Workspace</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    expect(screen.getByText('Dr. Amina Bello')).toBeInTheDocument();
    expect(screen.getByText('Overview')).toBeInTheDocument();
    expect(screen.getByText('Consultations')).toBeInTheDocument();
    expect(screen.getByText('Messages')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Dashboard Main Workspace')).toBeInTheDocument();
  });

  it('toggles collapse state on sidebar header collapse button click', () => {
    const onCollapseChange = vi.fn();
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={TEST_NAV_GROUPS}
          collapsible={true}
          defaultCollapsed={false}
          collapseTogglePlacement="sidebar-header"
          onCollapseChange={onCollapseChange}
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    const collapseBtn = screen.getByRole('button', { name: /Collapse sidebar/i });
    expect(collapseBtn).toBeInTheDocument();

    fireEvent.click(collapseBtn);
    expect(onCollapseChange).toHaveBeenCalledWith(true);
  });

  it('renders below-logo expand toggle button in collapsed rail mode', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={TEST_NAV_GROUPS}
          collapsible={true}
          defaultCollapsed={true}
          collapseTogglePlacement="sidebar-header"
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    const expandBtn = screen.getByRole('button', { name: /Expand sidebar/i });
    expect(expandBtn).toBeInTheDocument();
  });

  it('renders doctor score card in expanded mode and supports link', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={TEST_NAV_GROUPS}
          environment="production"
          scoreCard={{
            name: 'Dr. Amina Bello',
            role: 'Chief of Cardiology',
            tier: 'diamond',
            medixScore: 985,
            link: '/doctor/profile',
          }}
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    expect(screen.getByText('Chief of Cardiology')).toBeInTheDocument();
    expect(screen.getByText('Diamond Clinician')).toBeInTheDocument();
    expect(screen.getByText('985 pts')).toBeInTheDocument();
  });

  it('renders environment banner for sandbox environment', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout user={TEST_USER} navGroups={TEST_NAV_GROUPS} environment="sandbox">
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    expect(screen.getByText('SANDBOX ENVIRONMENT')).toBeInTheDocument();
  });

  it('opens flyout menu when clicking a parent nav item in collapsed mode and closes on subitem click', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={TEST_NAV_GROUPS}
          collapsible={true}
          defaultCollapsed={true}
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    // Click the Consultations button in collapsed mode
    const consultBtn = screen.getByRole('button', { name: 'Consultations' });
    expect(consultBtn).toBeInTheDocument();
    expect(screen.queryByRole('menu', { name: 'Consultations' })).not.toBeInTheDocument();

    fireEvent.click(consultBtn);

    // Flyout menu should now be visible with sub-items
    const menu = screen.getByRole('menu', { name: 'Consultations' });
    expect(menu).toBeInTheDocument();
    expect(screen.getByText('Upcoming')).toBeInTheDocument();
    expect(screen.getByText('Past Sessions')).toBeInTheDocument();

    // Clicking a sub-item closes the flyout
    fireEvent.click(screen.getByText('Upcoming'));
    expect(screen.queryByRole('menu', { name: 'Consultations' })).not.toBeInTheDocument();
  });

  it('closes flyout menu in collapsed mode when pressing Escape key', () => {
    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={TEST_NAV_GROUPS}
          collapsible={true}
          defaultCollapsed={true}
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    const consultBtn = screen.getByRole('button', { name: 'Consultations' });
    fireEvent.click(consultBtn);
    expect(screen.getByRole('menu', { name: 'Consultations' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu', { name: 'Consultations' })).not.toBeInTheDocument();
  });
});
