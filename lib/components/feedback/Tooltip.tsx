'use client';

import React from 'react';
import { Tooltip as ChakraTooltip, type TooltipRootProps } from '@chakra-ui/react';

export type TooltipPlacement =
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end'
  | 'left'
  | 'left-start'
  | 'left-end'
  | 'right'
  | 'right-start'
  | 'right-end';

export interface TooltipProps extends Omit<TooltipRootProps, 'content'> {
  /** Text shown in the tooltip bubble */
  label: string;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /**
   * Preferred placement of the tooltip relative to the trigger.
   * The tooltip will flip automatically if it overflows the viewport.
   * @default "top"
   */
  placement?: TooltipPlacement;
  /**
   * On touch/coarse-pointer devices, toggles tooltip open/close on tap by default
   * for accessibility. Set to `false` for controls with a primary tap action
   * (links/buttons/icon actions) so the tap is not intercepted.
   * @default true
   */
  toggleOnTouch?: boolean;
}

/**
 * MedixDeck Tooltip
 *
 * Hover label for icons, truncated text, and contextual hints.
 * On touch / mobile devices, tapping the trigger toggles the tooltip open
 * and an outside tap dismisses it by default — ensuring the content is accessible
 * without relying on hover events. For controls with a primary tap action, set
 * `toggleOnTouch={false}` so taps pass through.
 *
 * @example
 * ```tsx
 * <Tooltip label="MDCN Verified Doctor" placement="top">
 *   <span>✓</span>
 * </Tooltip>
 *
 * <Tooltip label="Copy patient ID" placement="bottom">
 *   <Button>📋</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({
  label,
  children,
  placement = 'top',
  toggleOnTouch = true,
  ...props
}: TooltipProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLSpanElement>(null);

  // Detect touch environment (coarse pointer = touchscreen)
  const isTouchDevice = React.useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(pointer: coarse)').matches;
  }, []);

  const touchToggleEnabled = isTouchDevice && toggleOnTouch;

  // Close on outside tap — only active when tooltip tap-toggle is open on touch devices
  React.useEffect(() => {
    if (!touchToggleEnabled || !isOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (triggerRef.current && !triggerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [touchToggleEnabled, isOpen]);

  // If touch toggle becomes disabled, ensure controlled-open state is reset
  React.useEffect(() => {
    if (!touchToggleEnabled && isOpen) {
      setIsOpen(false);
    }
  }, [touchToggleEnabled, isOpen]);

  const handleTriggerClick = (e: React.MouseEvent) => {
    if (!touchToggleEnabled) return;
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  return (
    <ChakraTooltip.Root
      positioning={{ placement }}
      open={touchToggleEnabled ? isOpen : undefined}
      onOpenChange={touchToggleEnabled ? (d) => setIsOpen(d.open) : undefined}
      {...props}
    >
      <ChakraTooltip.Trigger asChild>
        {/* Tooltip.Trigger needs a single child element */}
        <span
          ref={triggerRef}
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={handleTriggerClick}
        >
          {children}
        </span>
      </ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content
          bg="gray.900"
          color="white"
          borderRadius="md"
          px="3"
          py="1.5"
          fontSize="xs"
          fontFamily="var(--font-body)"
          border="1px solid"
          borderColor="gray.700"
          boxShadow="none"
        >
          {label}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  );
}
