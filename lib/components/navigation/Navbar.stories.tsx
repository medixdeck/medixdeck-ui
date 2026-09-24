import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Box, Text } from '@chakra-ui/react';
import { Navbar, type NavItem } from './Navbar';
import { Button } from '../primitive/Button';

// ─── Inline Storybook Icons ───────────────────────────────────────────────────

const StethoscopeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
    <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
    <circle cx="20" cy="10" r="2" />
  </svg>
);

const HomeHeartIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M12 11.5c-1-1.5-3-1.5-3 .5 0 2 3 4 3 4s3-2 3-4c0-2-2-2-3-.5z" />
  </svg>
);

const UsersIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const DocumentIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

const meta: Meta<typeof Navbar> = {
  title: 'Navigation/Navbar',
  component: Navbar,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: { control: 'select', options: ['blue', 'purple'] },
    variant: { control: 'select', options: ['solid', 'transparent', 'blur'] },
    navItemsAlign: { control: 'select', options: ['left', 'center', 'right'] },
    isSticky: { control: 'boolean' },
    ctaLabel: { control: 'text' },
    secondaryCtaLabel: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Navbar>;

// ─── Sample Navigation Datasets ───────────────────────────────────────────────

const simpleNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Specialists', href: '/specialists' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

const dropdownNavItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      {
        label: 'Doctor Consultations',
        href: '/services/doctors',
        description: 'Connect with certified Nigerian medical practitioners 24/7.',
        icon: <StethoscopeIcon />,
      },
      {
        label: 'Homecare Visits',
        href: '/services/homecare',
        description: 'Personalized nursing and clinical care at your residence.',
        badge: 'Popular',
        icon: <HomeHeartIcon />,
      },
      {
        label: 'Medical Outreach',
        href: '/services/outreach',
        description: 'Community screening & corporate healthcare solutions.',
        icon: <UsersIcon />,
      },
    ],
  },
  {
    label: 'Resources',
    children: [
      {
        label: 'Health Blog',
        href: '/blog',
        description: 'Wellness advice, clinical articles, and healthcare updates.',
        icon: <DocumentIcon />,
      },
      {
        label: 'Privacy & Security',
        href: '/privacy',
        description: 'HIPAA & NDPR compliant patient records architecture.',
        badge: 'NDPR',
        icon: <ShieldCheckIcon />,
      },
      {
        label: 'Documentation & API',
        href: 'https://docs.medixdeck.com',
        description: 'Public health API integration guides for developers.',
        isExternal: true,
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
];

// ─── Stories ──────────────────────────────────────────────────────────────────

export const Default: Story = {
  args: {
    navItems: simpleNavItems,
    ctaLabel: 'Talk to a Doctor',
    ctaHref: '#',
    secondaryCtaLabel: 'Sign In',
    secondaryCtaHref: '#',
    colorScheme: 'blue',
  },
};

export const WithDropdowns: Story = {
  args: {
    navItems: dropdownNavItems,
    ctaLabel: 'Talk to a Doctor',
    ctaHref: '#',
    secondaryCtaLabel: 'Sign In',
    secondaryCtaHref: '#',
    colorScheme: 'blue',
  },
};

export const PurpleColorScheme: Story = {
  args: {
    navItems: dropdownNavItems,
    ctaLabel: 'Get Started',
    ctaHref: '#',
    secondaryCtaLabel: 'Sign In',
    secondaryCtaHref: '#',
    colorScheme: 'purple',
  },
};

export const LeftAlignedNavLinks: Story = {
  args: {
    navItems: dropdownNavItems,
    navItemsAlign: 'left',
    ctaLabel: 'Book Appointment',
    ctaHref: '#',
    colorScheme: 'blue',
  },
};

export const CustomCtaSlot: Story = {
  args: {
    navItems: dropdownNavItems,
    colorScheme: 'blue',
    ctaSlot: (
      <Box display="flex" gap="2" alignItems="center">
        <Button variant="ghost" colorScheme="blue" size="sm">
          Patient Login
        </Button>
        <Button variant="solid" colorScheme="purple" size="sm">
          Doctor Portal
        </Button>
      </Box>
    ),
  },
};

export const BlurVariant: Story = {
  render: (args) => (
    <Box
      p="8"
      bg="linear-gradient(135deg, #0A1220 0%, #152035 100%)"
      borderRadius="card"
      color="white"
    >
      <Text fontSize="sm" color="gray.400" mb="4">
        Navbar with `variant="blur"` rendered over a dark gradient background:
      </Text>
      <Navbar {...args} />
    </Box>
  ),
  args: {
    navItems: dropdownNavItems,
    variant: 'blur',
    ctaLabel: 'Talk to a Doctor',
    ctaHref: '#',
    secondaryCtaLabel: 'Sign In',
    secondaryCtaHref: '#',
    colorScheme: 'blue',
  },
};
