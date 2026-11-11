import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta: Meta<typeof Badge> = {
  title: 'Primitives/Badge',
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'info', 'neutral'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline', 'surface'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    rounded: { control: 'boolean' },
    showDot: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const DefaultDotted: Story = {
  args: { children: 'Verified', status: 'success', variant: 'subtle', rounded: true },
};

export const WithoutDot: Story = {
  args: {
    children: 'No dot',
    status: 'info',
    variant: 'subtle',
    rounded: true,
    showDot: false,
  },
};

export const Solid: Story = {
  args: { children: 'Active', status: 'success', variant: 'solid', rounded: true },
};

export const Subtle: Story = {
  args: { children: 'Pending', status: 'warning', variant: 'subtle', rounded: true },
};

export const Outline: Story = {
  args: { children: 'Cancelled', status: 'error', variant: 'outline', rounded: true },
};

export const AllStatuses: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['success', 'warning', 'error', 'info', 'neutral'] as const).map((status) => (
        <Badge key={status} status={status} rounded>
          {status}
        </Badge>
      ))}
    </div>
  ),
};
