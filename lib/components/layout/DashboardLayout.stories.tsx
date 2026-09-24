import type { Meta, StoryObj } from '@storybook/react';
import { DashboardLayout } from './DashboardLayout';
import { Box, Text } from '@chakra-ui/react';

// ─── Inline icons (no external deps needed in stories) ────────────────────────

const HomeIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UserIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9z" />
  </svg>
);

const ChatIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const FileIcon = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// ─── Shared nav groups ─────────────────────────────────────────────────────────

const BASE_NAV_GROUPS = [
  {
    items: [
      { label: 'Dashboard', href: '#dashboard', icon: <HomeIcon />, isActive: true },
      { label: 'Patients', href: '#patients', icon: <UserIcon />, badge: 12 },
    ],
  },
  {
    groupLabel: 'System',
    items: [{ label: 'Settings', href: '#settings', icon: <SettingsIcon />, hasDot: true }],
  },
];

const DOCTOR_NAV_GROUPS = [
  {
    items: [
      { label: 'Home', href: '#home', icon: <HomeIcon />, isActive: true },
      { label: 'Appointments', href: '#appointments', icon: <CalendarIcon /> },
      { label: 'Messages', href: '#messages', icon: <ChatIcon />, badge: 6 },
      { label: 'Records', href: '#records', icon: <FileIcon /> },
    ],
  },
  {
    groupLabel: 'Account',
    items: [
      { label: 'Profile', href: '#profile', icon: <UserIcon /> },
      { label: 'Settings', href: '#settings', icon: <SettingsIcon />, hasDot: true },
    ],
  },
];

const MOBILE_NAV_ITEMS = [
  { label: 'Home', href: '#home', icon: <HomeIcon /> },
  { label: 'Appointments', href: '#appointments', icon: <CalendarIcon /> },
  { label: 'Messages', href: '#messages', isActive: true, badge: 6, icon: <ChatIcon /> },
  { label: 'Profile', href: '#profile', icon: <UserIcon /> },
];

// ─── Storybook meta ────────────────────────────────────────────────────────────

const meta: Meta<typeof DashboardLayout> = {
  title: 'Layout/DashboardLayout',
  component: DashboardLayout,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: `
**DashboardLayout** is the full-screen application shell for authenticated MedixDeck users.
It provides a fixed sidebar (collapsible on mobile), a sticky top bar with greeting + user menu,
and an optional mobile bottom navigation bar for native-app-style UX on small screens.

### Features
- Responsive sidebar that slides in on mobile
- Built-in light/dark/system theme toggle (top-right of top bar)
- **Automatic Test / Sandbox Environment Banner**: automatically shown in non-production environments with custom badges, messages, actions, and dismiss triggers
- \`colorScheme\` prop → brand blue or purple accent on all interactive elements
- \`scoreCard\` prop → doctor identity card (avatar ring + MedixScore tier) shown above the sidebar nav on desktop
- \`mobileNavItems\` prop → fixed bottom tab bar with icon + badge support (mobile only)
- \`greetingSubtext\` prop → optional subtitle line below the greeting (date, schedule summary, etc.)
- \`renderLink\` prop → integrate any router (Next.js, React Router, TanStack) without importing it
`,
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

// ─── Page content helper ───────────────────────────────────────────────────────

function PageContent({ title, description }: { title: string; description: string }) {
  return (
    <Box p={8}>
      <Text fontSize="2xl" fontWeight="bold" mb={2} color="text.heading">
        {title}
      </Text>
      <Text mb={6} color="text.body">
        {description}
      </Text>
      <Box p={8} bg="bg.surface" borderRadius="xl" border="1px dashed" borderColor="border">
        <Text color="text.muted" fontSize="sm">
          Your dashboard content goes here.
        </Text>
      </Box>
    </Box>
  );
}

// ─── Stories ──────────────────────────────────────────────────────────────────

/** Default blue-scheme layout with basic navigation groups and badge/dot indicators. */
export const Default: Story = {
  args: {
    user: { name: 'Daniel O.', email: 'daniel@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Welcome to MedixDeck"
          description="Use the top-right theme control to switch between light, dark, and system modes."
        />
      </DashboardLayout>
    </Box>
  ),
};

/** Purple accent — all interactive elements use brand purple (#7700CC). */
export const Purple: Story = {
  args: {
    colorScheme: 'purple',
    user: { name: 'Amara N.', email: 'amara@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Purple scheme"
          description="Active nav items, badge pills, and the theme toggle use MedixDeck brand purple."
        />
      </DashboardLayout>
    </Box>
  ),
};

/** Collapsible sub-links — parent item expands to show nested routes. */
export const WithSublinks: Story = {
  args: {
    user: { name: 'Tobi K.', email: 'tobi@medixdeck.com' },
    navGroups: [
      {
        items: [
          { label: 'Dashboard', href: '#dashboard', icon: <HomeIcon /> },
          {
            label: 'Appointments',
            href: '#appointments-parent',
            icon: <CalendarIcon />,
            isActive: true,
            subItems: [
              { label: 'Upcoming', href: '#upcoming', badge: 3 },
              { label: 'Completed', href: '#completed' },
              { label: 'Cancelled', href: '#cancelled' },
            ],
          },
        ],
      },
      {
        groupLabel: 'System',
        items: [{ label: 'Settings', href: '#settings', icon: <SettingsIcon /> }],
      },
    ],
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Collapsible sublinks"
          description='The "Appointments" item has sub-links. It renders a chevron and expands/collapses when clicked.'
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Mobile bottom navigation bar.
 *
 * Resize the viewport to < 768 px to see the fixed bottom tab bar.
 * Each item supports an `icon`, `badge` count, and an `isActive` flag.
 * The same `renderLink` prop wraps each tab for router integration.
 */
export const WithMobileNav: Story = {
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    mobileNavItems: MOBILE_NAV_ITEMS,
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Mobile bottom navigation"
          description="Resize below 768 px to reveal the fixed bottom tab bar. The Messages tab shows a badge of 6."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * DoctorScoreCard — the clinician identity card shown above the sidebar nav.
 *
 * Only rendered on desktop (`display={{ base: "none", md: "block" }}`).
 * The `tier` prop controls the avatar ring gradient and the tier label colour.
 * Five tiers: `bronze`, `silver`, `gold`, `platinum`, `diamond`.
 */
export const WithDoctorScoreCard: Story = {
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Okedi Williams',
      role: 'Cardiologist',
      tier: 'gold',
      medixScore: 847,
      link: '#doctor-profile',
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Doctor Score Card (gold tier)"
          description="The sidebar displays the doctor's name, role, tier badge, and MedixScore above the nav links. The avatar ring matches the tier colour."
        />
      </DashboardLayout>
    </Box>
  ),
};

/** All five tier variants displayed as separate stories via the `name` pattern. */
export const ScoreCardBronzeTier: Story = {
  name: 'ScoreCard / Bronze tier',
  args: {
    colorScheme: 'blue',
    user: { name: 'Dr. Ada Okonkwo', email: 'ada@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Ada Okonkwo',
      role: 'General Practitioner',
      tier: 'bronze',
      medixScore: 123,
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Bronze tier"
          description="Warm copper ring + dark amber label (#92400E)."
        />
      </DashboardLayout>
    </Box>
  ),
};

export const ScoreCardSilverTier: Story = {
  name: 'ScoreCard / Silver tier',
  args: {
    colorScheme: 'blue',
    user: { name: 'Dr. Emeka Nwankwo', email: 'emeka@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Emeka Nwankwo',
      role: 'Surgeon',
      tier: 'silver',
      medixScore: 410,
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent title="Silver tier" description="Steel ring + slate label (#475569)." />
      </DashboardLayout>
    </Box>
  ),
};

export const ScoreCardPlatinumTier: Story = {
  name: 'ScoreCard / Platinum tier',
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Ngozi Abara', email: 'ngozi@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Ngozi Abara',
      role: 'Neurologist',
      tier: 'platinum',
      medixScore: 1240,
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Platinum tier"
          description="Sky-blue ring + info blue label (#0284C7)."
        />
      </DashboardLayout>
    </Box>
  ),
};

export const ScoreCardDiamondTier: Story = {
  name: 'ScoreCard / Diamond tier',
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Chidi Obi', email: 'chidi@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Chidi Obi',
      role: 'Oncologist',
      tier: 'diamond',
      medixScore: 2100,
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent title="Diamond tier" description="Violet ring + purple label (#7C3AED)." />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Greeting subtext — a muted subtitle line below the user's name.
 *
 * When `greetingSubtext` is set the top bar height expands from 64 px to 80 px
 * to accommodate the second line. Pass any string: a formatted date, a schedule
 * summary, or a motivational message.
 */
export const WithGreetingSubtext: Story = {
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    greetingSubtext: `${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · 8 consultations scheduled today`,
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Okedi Williams',
      role: 'Cardiologist',
      tier: 'gold',
      medixScore: 847,
      link: '#doctor-profile',
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Greeting subtext"
          description="A second line appears below the greeting with today's date and a schedule summary. The top bar expands automatically."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Full doctor dashboard — all new features combined:
 * ScoreCard (gold) + mobile bottom nav (with badges) + greeting subtext.
 */
export const FullDoctorDashboard: Story = {
  args: {
    colorScheme: 'purple',
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    greetingSubtext: `${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} · 8 consultations scheduled today`,
    scoreCard: {
      name: 'Dr. Okedi Williams',
      role: 'Cardiologist',
      tier: 'gold',
      medixScore: 847,
      link: '#doctor-profile',
    },
    navGroups: DOCTOR_NAV_GROUPS,
    mobileNavItems: MOBILE_NAV_ITEMS,
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Full doctor dashboard"
          description="Doctor score card, mobile bottom nav, and greeting subtext all active simultaneously."
        />
      </DashboardLayout>
    </Box>
  ),
};

// ─── Environment Banner Stories ───────────────────────────────────────────────

/**
 * Default auto-detection:
 * In a development / localhost / Storybook environment, the banner is automatically
 * displayed with a warning tone without needing any explicit props.
 */
export const SandboxAuto: Story = {
  name: 'Environment / Auto Detection',
  args: {
    user: { name: 'Dr. Amaka Okonkwo', email: 'amaka@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environment: 'auto',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Automatic Environment Detection"
          description="The banner is automatically rendered because this environment is detected as non-production (localhost/dev/preview)."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Explicit Sandbox environment (`environment="sandbox"`).
 */
export const SandboxExplicit: Story = {
  name: 'Environment / Explicit Sandbox',
  args: {
    user: { name: 'Tobi Daniels', email: 'tobi@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environment: 'sandbox',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Explicit Sandbox Environment"
          description="Renders an amber banner with 'SANDBOX ENVIRONMENT' badge."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Explicit Test environment (`environment="test"`).
 */
export const TestEnvironment: Story = {
  name: 'Environment / Test Mode',
  args: {
    user: { name: 'QA Engineer', email: 'qa@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environment: 'test',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Test Environment"
          description="Renders a red/error-tinted alert banner for automated QA and testing environments."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Explicit Staging environment (`environment="staging"`).
 */
export const StagingEnvironment: Story = {
  name: 'Environment / Staging Mode',
  args: {
    user: { name: 'Clinical Reviewer', email: 'reviewer@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environment: 'staging',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Staging Environment"
          description="Renders an info-blue banner with 'STAGING ENVIRONMENT' badge."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Custom banner configuration with custom badge label, message, and action link.
 */
export const CustomBannerConfig: Story = {
  name: 'Environment / Custom Message & Action',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    environmentBanner: {
      environment: 'sandbox',
      badgeLabel: 'SIMULATION LAB',
      message:
        'This clinical terminal is running in simulation mode for training and compliance review.',
      action: (
        <a
          href="https://app.medixdeck.com"
          target="_blank"
          rel="noreferrer"
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textDecoration: 'none',
            color: '#92400E',
            background: 'rgba(245,158,11,0.15)',
            border: '1px solid rgba(245,158,11,0.4)',
            padding: '3px 9px',
            borderRadius: '6px',
            whiteSpace: 'nowrap',
          }}
        >
          Go to Live App →
        </a>
      ),
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Custom Banner Message & Action"
          description="Custom badge label ('SIMULATION LAB'), custom message, and an inline action link."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Dismissible banner (`dismissible: true`).
 */
export const DismissibleBanner: Story = {
  name: 'Environment / Dismissible Banner',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    environmentBanner: {
      environment: 'sandbox',
      dismissible: true,
      onDismiss: () => console.log('Environment banner dismissed'),
    },
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Dismissible Banner"
          description="Click the ✕ button in the top-right corner to dismiss the banner for the current session."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Custom banner slot (`environmentBannerSlot`).
 */
export const CustomBannerSlot: Story = {
  name: 'Environment / Custom Banner Slot',
  args: {
    user: { name: 'Dr. Ada Okonkwo', email: 'ada@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environmentBannerSlot: (
      <Box
        bg="purple.500"
        color="#FFFFFF"
        px="4"
        py="2"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        fontSize="xs"
        fontWeight="600"
      >
        <Box display="flex" alignItems="center" gap="2">
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span>SPECIAL CLINICAL TRIAL BUILD v2.4 (NON-PROD)</span>
        </Box>
        <span style={{ fontSize: '11px', opacity: 0.85 }}>Confidential Internal Preview</span>
      </Box>
    ),
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Custom Banner Slot"
          description="Completely custom banner component passed via environmentBannerSlot."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Production environment (`environment="production"`) — the banner is suppressed.
 */
export const ProductionSuppressed: Story = {
  name: 'Environment / Production (Hidden)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Production Environment"
          description="The banner is automatically suppressed because environment is set to 'production'."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Explicitly suppressed banner (`showEnvironmentBanner={false}`).
 */
export const ExplicitlySuppressed: Story = {
  name: 'Environment / Explicitly Suppressed (showEnvironmentBanner=false)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    showEnvironmentBanner: false,
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Banner Suppressed"
          description="Passing showEnvironmentBanner={false} completely hides the banner in any environment."
        />
      </DashboardLayout>
    </Box>
  ),
};

// ─── Collapsible Sidebar Stories ────────────────────────────────────────────

/**
 * Default collapsible sidebar (`collapsible={true}`, `defaultCollapsed={false}`).
 * Toggle via the header icon button or the sticky topbar button.
 */
export const CollapsibleDefault: Story = {
  name: 'Collapsible / Default (Expanded)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    collapsible: true,
    defaultCollapsed: false,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Collapsible Sidebar (Expanded)"
          description="Click the panel collapse icon in the sidebar header or top bar to shrink the sidebar into a compact icon rail."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Starts in collapsed rail mode (`defaultCollapsed={true}`).
 */
export const DefaultCollapsed: Story = {
  name: 'Collapsible / Default Collapsed (Rail)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    collapsible: true,
    defaultCollapsed: true,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Default Collapsed Sidebar"
          description="The sidebar is initialized in collapsed icon rail mode (68px). Hover over icons to see titles or click the expand button in the top bar to expand."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Controlled collapsed state with external triggers.
 */
export const ControlledCollapse: Story = {
  name: 'Collapsible / Controlled Collapse',
  render: () => {
    const [collapsed, setCollapsed] = React.useState(false);
    return (
      <Box h="100vh" w="100%">
        <DashboardLayout
          user={{ name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' }}
          navGroups={BASE_NAV_GROUPS}
          isCollapsed={collapsed}
          onCollapseChange={setCollapsed}
          collapsible={true}
          environment="production"
        >
          <Box p="6" borderRadius="xl" bg="bg.surface" border="1px solid" borderColor="border">
            <Text fontSize="lg" fontWeight="700" color="text.heading" mb="2">
              Controlled Sidebar State: {collapsed ? 'Collapsed (Rail)' : 'Expanded (Full)'}
            </Text>
            <Text fontSize="sm" color="text.muted" mb="4">
              You can control the sidebar programmatically using <code>isCollapsed</code> and{' '}
              <code>onCollapseChange</code>.
            </Text>
            <Box
              as="button"
              px="4"
              py="2"
              borderRadius="md"
              bg="blue.500"
              color="#fff"
              border="none"
              fontWeight="600"
              fontSize="sm"
              cursor="pointer"
              onClick={() => setCollapsed((c) => !c)}
            >
              {collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            </Box>
          </Box>
        </DashboardLayout>
      </Box>
    );
  },
};

/**
 * Collapsible sidebar with Doctor Score Card.
 * Demonstrates the score card transforming into a compact clinician ring avatar when collapsed.
 */
export const CollapsibleWithDoctorScoreCard: Story = {
  name: 'Collapsible / With Doctor Score Card',
  args: {
    user: { name: 'Dr. Amina Bello', email: 'amina@medixdeck.com' },
    navGroups: DOCTOR_NAV_GROUPS,
    scoreCard: {
      name: 'Dr. Amina Bello',
      role: 'Chief of Cardiology',
      tier: 'diamond',
      medixScore: 985,
    },
    collapsible: true,
    defaultCollapsed: false,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Collapsible with Doctor Score Card"
          description="Notice how the doctor score card smoothly collapses into a sleek circular avatar with the diamond tier gradient ring."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Collapsible sidebar with nested sub-items (flyout popover when collapsed).
 */
export const CollapsibleWithSublinks: Story = {
  name: 'Collapsible / With Sub-items & Flyout',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: NAV_GROUPS_WITH_SUBITEMS,
    collapsible: true,
    defaultCollapsed: true,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Collapsible with Sub-items"
          description="In collapsed rail mode, clicking a navigation item with sub-links opens an anchored floating popover flyout menu."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * Non-collapsible sidebar (`collapsible={false}`).
 */
export const NonCollapsible: Story = {
  name: 'Collapsible / Disabled (Non-Collapsible)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    collapsible: false,
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="Non-Collapsible Sidebar"
          description="With collapsible={false}, the toggle buttons are hidden and the sidebar remains permanently expanded at full width."
        />
      </DashboardLayout>
    </Box>
  ),
};

/**
 * TopBar toggle placement option (`collapseTogglePlacement="both"`).
 */
export const TopBarTogglePlacement: Story = {
  name: 'Collapsible / TopBar Toggle Placement (both)',
  args: {
    user: { name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' },
    navGroups: BASE_NAV_GROUPS,
    collapsible: true,
    defaultCollapsed: false,
    collapseTogglePlacement: 'both',
    environment: 'production',
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <PageContent
          title="TopBar Toggle Button Placement"
          description="Setting collapseTogglePlacement='both' or 'topbar' renders the collapse/expand toggle button in the sticky topbar."
        />
      </DashboardLayout>
    </Box>
  ),
};
