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
