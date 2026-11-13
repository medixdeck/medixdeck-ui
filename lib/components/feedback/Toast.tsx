'use client';

import React, { useEffect, useState } from 'react';
import { createToaster, Toaster as ChakraToaster, ToastRoot } from '@chakra-ui/react';
import { Alert, type AlertStatus, type AlertVariant } from './Alert';
import { useHaptics } from '../../hooks/useHaptics';
import type { HapticInput, HapticIntent } from '../../utils/haptics';

// Inject countdown progress keyframe once
if (typeof document !== 'undefined') {
  const styleId = 'medix-toast-keyframes';
  if (!document.getElementById(styleId)) {
    const s = document.createElement('style');
    s.id = styleId;
    s.textContent = `
      @keyframes medixToastProgress {
        from { transform: scaleX(1); }
        to   { transform: scaleX(0); }
      }
    `;
    document.head.appendChild(s);
  }
}

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
  overlap: true,
  gap: 16,
  duration: 4000,
  removeDelay: 200,
});

export type ToastType = AlertStatus;

export type ToastOptions = {
  title: string | React.ReactNode;
  description?: string | React.ReactNode;
  type?: AlertStatus;
  duration?: number;
  /** Haptic feedback intent/pattern when this toast appears. Set `false` to disable. */
  haptic?: HapticInput;
  /** Disable haptic feedback for this toast. */
  disableHaptic?: boolean;
};

export const toast = Object.assign(
  (options: ToastOptions) => {
    return toaster.create({
      title: options.title as any,
      description: options.description as any,
      type: options.type || 'info',
      duration: options.duration ?? 4000,
      meta: {
        ...(options.haptic !== undefined ? { haptic: options.haptic } : {}),
        ...(options.disableHaptic !== undefined ? { disableHaptic: options.disableHaptic } : {}),
      },
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

const progressColors: Record<AlertStatus, string> = {
  success: '#16A34A',
  error: '#DC2626',
  warning: '#D97706',
  info: '#0685FF',
};

const toastFiredHaptics = new Set<string>();

function getToastHapticIntent(status: AlertStatus): HapticIntent {
  switch (status) {
    case 'success':
      return 'success';
    case 'error':
      return 'error';
    case 'warning':
      return 'warning';
    case 'info':
    default:
      return 'notification';
  }
}

function ToastCard({ toast }: { toast: any }) {
  const [isHovered, setIsHovered] = useState(false);
  const { trigger } = useHaptics();
  const variant = (toast.meta?.variant as AlertVariant) || 'subtle';
  const duration = toast.duration ?? 4000;
  const status: AlertStatus = (toast.type as AlertStatus) || 'info';
  const barColor = progressColors[status] || '#0685FF';

  useEffect(() => {
    const id = toast?.id as string | undefined;
    if (!id || toastFiredHaptics.has(id)) return;

    const disableHaptic = toast?.meta?.disableHaptic === true;
    const hapticOverride = toast?.meta?.haptic as HapticInput | undefined;
    if (disableHaptic || hapticOverride === false) {
      toastFiredHaptics.add(id);
      return;
    }

    toastFiredHaptics.add(id);
    trigger(hapticOverride ?? getToastHapticIntent(status));
  }, [toast?.id, toast?.meta?.disableHaptic, toast?.meta?.haptic, status, trigger]);

  const handleMouseEnter = () => {
    setIsHovered(true);
    toaster.pause(toast.id);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    toaster.resume(toast.id);
  };

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
      boxShadow="none"
      pointerEvents="auto"
      overflow="hidden"
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Alert
        status={status}
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

      {/* Countdown progress bar — drains over toast duration, pauses on hover */}
      {duration !== Infinity && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            height: '3px',
            width: '100%',
            backgroundColor: barColor,
            opacity: 0.9,
            transformOrigin: 'left',
            animationName: 'medixToastProgress',
            animationDuration: `${duration}ms`,
            animationTimingFunction: 'linear',
            animationFillMode: 'forwards',
            animationPlayState: isHovered ? 'paused' : 'running',
          }}
        />
      )}
    </ToastRoot>
  );
}

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
      pointerEvents="none"
    >
      {(toast) => <ToastCard key={toast.id} toast={toast} />}
    </ChakraToaster>
  );
};
