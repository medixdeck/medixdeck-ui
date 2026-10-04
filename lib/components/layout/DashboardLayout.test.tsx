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

  it('renders NEW badge on sidebar nav items with isNew: true and matches colorScheme', () => {
    const navGroupsWithNew: DashboardNavGroup[] = [
      {
        items: [
          { label: 'Schedule', href: '/schedule', isNew: true },
          { label: 'Reports', href: '/reports', isNew: true },
          { label: 'Overview', href: '/overview' },
        ],
      },
    ];

    const { rerender } = render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={navGroupsWithNew}
          colorScheme="blue"
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    const newBadges = screen.getAllByText('NEW');
    expect(newBadges.length).toBe(2);
    // Matches blue scheme solid (#0685FF)
    expect(newBadges[0]).toHaveStyle({ background: '#0685FF', color: '#fff' });

    // Rerender with purple colorScheme
    rerender(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={navGroupsWithNew}
          colorScheme="purple"
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    const purpleNewBadges = screen.getAllByText('NEW');
    expect(purpleNewBadges.length).toBe(2);
    // Matches purple scheme solid (#7700CC)
    expect(purpleNewBadges[0]).toHaveStyle({ background: '#7700CC', color: '#fff' });
  });

  it('renders isNew indicator and tooltip label in collapsed rail mode', () => {
    const navGroupsWithNew: DashboardNavGroup[] = [
      {
        items: [{ label: 'My Schedule', href: '/schedule', isNew: true }],
      },
    ];

    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout
          user={TEST_USER}
          navGroups={navGroupsWithNew}
          collapsible={true}
          defaultCollapsed={true}
          environment="production"
        >
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    expect(screen.getByLabelText('New feature')).toBeInTheDocument();
  });

  it('renders NEW badge on expanded sub-items with isNew: true', () => {
    const navGroupsWithSubNew: DashboardNavGroup[] = [
      {
        items: [
          {
            label: 'Records',
            href: '/records',
            subItems: [{ label: 'Prescriptions', href: '/records/prescriptions', isNew: true }],
          },
        ],
      },
    ];

    render(
      <MedixProvider defaultColorMode="light">
        <DashboardLayout user={TEST_USER} navGroups={navGroupsWithSubNew} environment="production">
          <div>Main Content</div>
        </DashboardLayout>
      </MedixProvider>,
    );

    // Expand the accordion
    const recordsBtn = screen.getByRole('button', { name: /Records/i });
    fireEvent.click(recordsBtn);

    expect(screen.getByText('Prescriptions')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();
  });
});
