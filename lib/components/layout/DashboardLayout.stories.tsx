import type { Meta, StoryObj } from "@storybook/react";
import { DashboardLayout } from "./DashboardLayout";
import { Box, Text } from "@chakra-ui/react";

const meta: Meta<typeof DashboardLayout> = {
  title: "Layout/DashboardLayout",
  component: DashboardLayout,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof DashboardLayout>;

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export const Default: Story = {
  args: {
    user: {
      name: "Daniel O.",
      email: "daniel@medixdeck.com",
    },
    navGroups: [
      {
        items: [
          { label: "Dashboard", href: "#dashboard", icon: <HomeIcon />, isActive: true },
          { label: "Patients", href: "#patients", icon: <UserIcon />, badge: 12 },
        ],
      },
      {
        groupLabel: "System",
        items: [
          { label: "Settings", href: "#settings", icon: <SettingsIcon />, hasDot: true },
        ],
      },
    ],
  },
  render: (args) => (
    <Box h="100vh" w="100%">
      <DashboardLayout {...args}>
        <Box p={8}>
          <Text fontSize="2xl" fontWeight="bold" mb={4} color="text.heading">
            Welcome to MedixDeck
          </Text>
          <Box p={8} bg="bg.surface" borderRadius="xl" border="1px dashed" borderColor="border">
            <Text color="text.body">Your dashboard content goes here.</Text>
          </Box>
        </Box>
      </DashboardLayout>
    </Box>
  ),
};
