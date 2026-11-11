import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
  title: 'Primitives/Tag',
  component: Tag,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: {
      control: 'select',
      options: ['blue', 'purple', 'green', 'gray', 'red', 'amber'],
    },
    variant: {
      control: 'select',
      options: ['solid', 'subtle', 'outline'],
    },
    showDot: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Tag>;

export const DefaultDotted: Story = {
  args: { children: 'Cardiology', colorScheme: 'blue', variant: 'subtle' },
};

export const WithoutDot: Story = {
  args: { children: 'No dot', colorScheme: 'blue', variant: 'subtle', showDot: false },
};

export const Solid: Story = {
  args: { children: 'Psychiatry', colorScheme: 'purple', variant: 'solid' },
};

export const Outline: Story = {
  args: { children: 'General Practice', colorScheme: 'gray', variant: 'outline' },
};

export const Closable: Story = {
  args: {
    children: 'Pediatrics',
    colorScheme: 'green',
    variant: 'subtle',
    onClose: () => {},
  },
};

export const AllSchemes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
      {(['blue', 'purple', 'green', 'gray', 'red', 'amber'] as const).map((scheme) => (
        <Tag key={scheme} colorScheme={scheme} variant="subtle">
          {scheme}
        </Tag>
      ))}
    </div>
  ),
};
