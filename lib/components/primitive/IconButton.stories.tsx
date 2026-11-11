import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const SearchIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Primitives/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['solid', 'outline', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg'],
    },
    colorScheme: {
      control: 'select',
      options: ['blue', 'purple', 'green', 'red', 'gray'],
    },
    isRound: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
  args: {
    'aria-label': 'Search',
    children: <SearchIcon />,
    variant: 'solid',
    colorScheme: 'blue',
  },
};

export const Outline: Story = {
  args: {
    'aria-label': 'Search',
    children: <SearchIcon />,
    variant: 'outline',
    colorScheme: 'purple',
  },
};

export const GhostRound: Story = {
  args: {
    'aria-label': 'Search',
    children: <SearchIcon />,
    variant: 'ghost',
    colorScheme: 'gray',
    isRound: true,
  },
};

export const Disabled: Story = {
  args: {
    'aria-label': 'Search',
    children: <SearchIcon />,
    variant: 'solid',
    colorScheme: 'blue',
    disabled: true,
  },
};
