import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Navigation/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: { control: 'select', options: ['blue', 'purple'] },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Default: Story = {
  args: {
    items: [
      { label: 'Home', href: '/' },
      { label: 'Appointments', href: '/appointments' },
      { label: 'Book Appointment' },
    ],
  },
};

export const SingleLevel: Story = {
  args: {
    items: [{ label: 'Home', href: '/' }, { label: 'Profile' }],
  },
};

export const Purple: Story = {
  args: {
    colorScheme: 'purple',
    items: [
      { label: 'Home', href: '/' },
      { label: 'Appointments', href: '/appointments' },
      { label: 'Book Appointment' },
    ],
  },
};
