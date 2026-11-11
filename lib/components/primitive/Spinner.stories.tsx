import type { Meta, StoryObj } from '@storybook/react';
import { Spinner, FullPageSpinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
  title: 'Primitives/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
    },
    label: { control: 'text' },
    color: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: { size: 'md' },
};

export const WithLabel: Story = {
  args: { size: 'md', label: 'Loading...' },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Spinner key={size} size={size} label={size} />
      ))}
    </div>
  ),
};

export const FullPage: StoryObj<typeof FullPageSpinner> = {
  render: () => <FullPageSpinner label="Loading…" />,
};
