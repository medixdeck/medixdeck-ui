import type { Meta, StoryObj } from '@storybook/react';
import { NotFoundPage } from './NotFoundPage';

const meta: Meta<typeof NotFoundPage> = {
  title: 'Feedback/NotFoundPage',
  component: NotFoundPage,
  tags: ['autodocs'],
  argTypes: {
    colorScheme: { control: 'select', options: ['blue', 'purple'] },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof NotFoundPage>;

export const Default: Story = {
  args: {
    onAction: () => console.log('Go back home clicked'),
  },
};

export const CustomContent: Story = {
  args: {
    title: 'Oops! We lost this page',
    description:
      'The link you followed might be broken, or the page may have been removed. Check the URL and try again.',
    actionLabel: 'Return to Dashboard',
    secondaryLabel: 'Contact Support',
    onAction: () => console.log('Return to Dashboard clicked'),
    onSecondaryAction: () => console.log('Contact Support clicked'),
  },
};

export const PurpleScheme: Story = {
  args: {
    colorScheme: 'purple',
    secondaryLabel: 'Contact Support',
    onAction: () => console.log('Go back home clicked'),
    onSecondaryAction: () => console.log('Contact Support clicked'),
  },
};
