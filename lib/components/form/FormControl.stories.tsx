import type { Meta, StoryObj } from '@storybook/react';
import { FormControl } from './FormControl';
import { Input } from './Input';

const meta: Meta<typeof FormControl> = {
  title: 'Form/FormControl',
  component: FormControl,
  tags: ['autodocs'],
  argTypes: {
    isRequired: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof FormControl>;

export const Default: Story = {
  args: {
    id: 'email',
    label: 'Email address',
    helperText: 'We will never share your email.',
    children: <Input type="email" placeholder="you@example.com" />,
  },
};

export const Required: Story = {
  args: {
    id: 'phone',
    label: 'Phone number',
    isRequired: true,
    children: <Input placeholder="Enter phone number" />,
  },
};

export const WithError: Story = {
  args: {
    id: 'email-error',
    label: 'Email address',
    errorMessage: 'Please enter a valid email address.',
    isRequired: true,
    children: <Input type="email" placeholder="you@example.com" />,
  },
};
