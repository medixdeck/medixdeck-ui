'use client';

import React from 'react';
import { createToaster, Toaster as ChakraToaster, ToastRoot } from '@chakra-ui/react';
import { Alert, type AlertStatus, type AlertVariant } from './Alert';

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
  overlap: true,
  gap: 16,
});

export type ToastType = AlertStatus;

export type ToastOptions = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  type?: AlertStatus;
  duration?: number;
};

export const toast = Object.assign(
  (options: ToastOptions) => {
    return toaster.create({
      title: options.title as any,
      description: options.description as any,
      type: options.type || 'info',
      duration: options.duration,
    });
  },
  {
    success: (title: string, options?: Partial<ToastOptions>) =>
      toast({ title, type: 'success', ...options }),
    error: (title: string, options?: Partial<ToastOptions>) =>
      toast({ title, type: 'error', ...options }),
    info: (title: string, options?: Partial<ToastOptions>) =>
      toast({ title, type: 'info', ...options }),
    warning: (title: string, options?: Partial<ToastOptions>) =>
      toast({ title, type: 'warning', ...options }),
  },
);

export const dismissToast = (id: string) => toaster.dismiss(id);

/**
 * MedixDeck Toaster
 *
 * Renders the toasts created by the `toaster` object using the MedixDeck Alert styling.
 * Place this component at the root of your application (e.g., inside MedixProvider).
 *
 * @example
 * ```tsx
 * import { Toaster, toaster } from "@medixdeck/ui";
 *
 * <Toaster />
 * <Button onClick={() => toaster.create({ title: "Success", type: "success" })}>Toast</Button>
 * ```
 */
export const Toaster = () => {
  return (
    <ChakraToaster
      toaster={toaster}
      insetInline={{ base: '4', md: '4' }}
      insetBlock={{ base: '4', md: '4' }}
    >
      {(toast) => {
        // Read custom variant from toast.meta if provided, else default to subtle
        const variant = (toast.meta?.variant as AlertVariant) || 'subtle';

        return (
          <ToastRoot
            key={toast.id}
            bg="bg.surface"
            p="0"
            border="none"
            borderRadius="md"
            w={{ base: 'full', sm: 'fit-content' }}
            minW={{ sm: '350px' }}
            maxW={{ base: 'full', sm: '400px' }}
            boxShadow="0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)"
          >
            <Alert
              status={(toast.type as AlertStatus) || 'info'}
              variant={variant}
              title={typeof toast.title === 'string' ? toast.title : undefined}
              description={typeof toast.description === 'string' ? toast.description : undefined}
              closable={true}
              onClose={() => toaster.dismiss(toast.id)}
              boxShadow="none"
              w="100%"
            >
              {typeof toast.title !== 'string' && toast.title}
              {typeof toast.description !== 'string' && toast.description}
            </Alert>
          </ToastRoot>
        );
      }}
    </ChakraToaster>
  );
};
