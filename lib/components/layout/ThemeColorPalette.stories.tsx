import type { Meta, StoryObj } from '@storybook/react';
import { ThemeColorPalette } from './ThemeColorPalette';

const meta: Meta<typeof ThemeColorPalette> = {
  title: 'Layout/ThemeColorPalette',
  component: ThemeColorPalette,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    showSemanticTokens: true,
    showPrimitiveTokens: true,
  },
};

export default meta;
type Story = StoryObj<typeof ThemeColorPalette>;

export const Default: Story = {
  render: (args) => <ThemeColorPalette maxW="7xl" mx="auto" p={{ base: '4', md: '8' }} {...args} />,
};

export const SemanticOnly: Story = {
  args: {
    showSemanticTokens: true,
    showPrimitiveTokens: false,
  },
  render: (args) => <ThemeColorPalette maxW="7xl" mx="auto" p={{ base: '4', md: '8' }} {...args} />,
};

export const RawPalettesOnly: Story = {
  args: {
    showSemanticTokens: false,
    showPrimitiveTokens: true,
  },
  render: (args) => <ThemeColorPalette maxW="7xl" mx="auto" p={{ base: '4', md: '8' }} {...args} />,
};
