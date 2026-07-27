import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Drawer } from './Drawer';
import { Button } from '../primitive/Button';

const meta: Meta<typeof Drawer> = {
  title: 'Feedback/Drawer',
  component: Drawer,
  tags: ['autodocs'],
  argTypes: {
    placement: { control: 'select', options: ['left', 'right', 'top', 'bottom'] },
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const RightDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Right Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Patient Details"
          placement="right"
          footer={
            <>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Close
              </Button>
              <Button colorScheme="blue">Save Changes</Button>
            </>
          }
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--chakra-colors-text-body)' }}>
            Right drawer content goes here.
          </p>
        </Drawer>
      </>
    );
  },
};

export const LeftDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Left Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Navigation Menu"
          placement="left"
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--chakra-colors-text-body)' }}>
            Left navigation drawer content.
          </p>
        </Drawer>
      </>
    );
  },
};

export const TopDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Top Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="System Notifications"
          placement="top"
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--chakra-colors-text-body)' }}>
            Top drawer alert bar content.
          </p>
        </Drawer>
      </>
    );
  },
};

export const BottomDrawer: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Bottom Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          title="Quick Actions"
          placement="bottom"
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--chakra-colors-text-body)' }}>
            Bottom sheet action panel content.
          </p>
        </Drawer>
      </>
    );
  },
};

export const WithoutTitle: Story = {
  render: (args) => {
    const [open, setOpen] = React.useState(false);
    return (
      <>
        <Button onClick={() => setOpen(true)}>Open Headless Drawer</Button>
        <Drawer
          {...args}
          isOpen={open}
          onClose={() => setOpen(false)}
          placement="right"
        >
          <p style={{ fontFamily: 'var(--font-body)', color: 'var(--chakra-colors-text-body)' }}>
            Drawer without explicit title (close trigger is still accessible at top-right).
          </p>
        </Drawer>
      </>
    );
  },
};

