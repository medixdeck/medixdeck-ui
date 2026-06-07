import type { Meta, StoryObj } from '@storybook/react';
import { Tabs } from './Tabs';

const meta: Meta<typeof Tabs> = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['line', 'pill'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

const tabItems = [
  {
    id: 'overview',
    label: 'Overview',
    content: <p style={{ padding: 16 }}>Patient overview and general health information.</p>,
  },
  {
    id: 'records',
    label: 'Medical Records',
    content: <p style={{ padding: 16 }}>All medical records, prescriptions, and history.</p>,
  },
  {
    id: 'appointments',
    label: 'Appointments',
    content: <p style={{ padding: 16 }}>Upcoming and past appointments.</p>,
  },
];

export const Line: Story = {
  args: { tabs: tabItems, variant: 'line' },
};

export const Pill: Story = {
  args: { tabs: tabItems, variant: 'pill' },
};

export const WithBadges: Story = {
  args: {
    variant: 'pill',
    tabs: [
      {
        id: 'patients',
        label: 'Patients',
        badge: 24,
        content: <p style={{ padding: 16 }}>Patients content.</p>,
      },
      {
        id: 'doctors',
        label: 'Doctors',
        badge: 8,
        content: <p style={{ padding: 16 }}>Doctors content.</p>,
      },
      {
        id: 'admins',
        label: 'Admins',
        badge: 2,
        content: <p style={{ padding: 16 }}>Admins content.</p>,
      },
    ],
  },
};
