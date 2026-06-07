import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { Button, Wrap } from '@chakra-ui/react';
import { Toaster, toast, dismissToast } from './Toast';

const meta: Meta<typeof Toaster> = {
  title: 'Components/Feedback/Toast',
  component: Toaster,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Toaster>;

/**
 * Basic usage of the Toast system. Make sure the `<Toaster />` component is mounted
 * once at the root of your application.
 */
export const Basic: Story = {
  render: () => {
    return (
      <>
        <Toaster />
        <Wrap gap="4">
          <Button
            onClick={() =>
              toast.info('Update available', {
                description: 'A new software version is available.',
              })
            }
          >
            Info
          </Button>

          <Button
            colorPalette="green"
            onClick={() =>
              toast.success('Profile saved', {
                description: 'Your changes have been successfully saved.',
              })
            }
          >
            Success
          </Button>

          <Button
            colorPalette="orange"
            onClick={() =>
              toast.warning('Low storage', {
                description: 'You are running out of storage space.',
              })
            }
          >
            Warning
          </Button>

          <Button
            colorPalette="red"
            onClick={() =>
              toast.error('Action failed', {
                description: 'Could not connect to the server. Please try again.',
              })
            }
          >
            Error
          </Button>
        </Wrap>
      </>
    );
  },
};

/**
 * Programmatically closing a toast using its generated ID.
 */
export const ProgrammaticDismissal: Story = {
  render: () => {
    const [toastId, setToastId] = React.useState<string | null>(null);

    return (
      <>
        <Toaster />
        <Wrap gap="4">
          <Button
            onClick={() => {
              const id = toast({
                title: 'Processing...',
                description: 'This toast will stay until you close it.',
                duration: Infinity,
                type: 'info',
              });
              setToastId(id as unknown as string);
            }}
          >
            Show Persistent Toast
          </Button>
          <Button
            variant="outline"
            disabled={!toastId}
            onClick={() => {
              if (toastId) {
                dismissToast(toastId);
                setToastId(null);
              }
            }}
          >
            Dismiss Toast
          </Button>
        </Wrap>
      </>
    );
  },
};
