'use client';

import React from 'react';
import {
  DrawerRoot,
  DrawerPositioner,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerCloseTrigger,
  DrawerBackdrop,
  type DrawerRootProps,
} from '@chakra-ui/react';

export type DrawerPlacement = 'left' | 'right' | 'top' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

// Chakra UI v3 DrawerRoot expects 'start' | 'end' | 'top' | 'bottom'
const placementMap: Record<DrawerPlacement, 'start' | 'end' | 'top' | 'bottom'> = {
  left: 'start',
  right: 'end',
  top: 'top',
  bottom: 'bottom',
};

type ChakraDrawerSize = DrawerRootProps['size'];

/**
 * MedixDeck Drawer
 *
 * Slide-in panel for navigation, filters, and detail views.
 *
 * @example
 * ```tsx
 * <Drawer isOpen={isOpen} onClose={onClose} title="Patient Details" placement="right">
 *   <PatientProfile id={id} />
 * </Drawer>
 * ```
 */
export function Drawer({
  isOpen,
  onClose,
  title,
  placement = 'right',
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  children,
}: DrawerProps) {
  const mappedPlacement = placementMap[placement] ?? 'end';

  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      placement={mappedPlacement}
      size={size as ChakraDrawerSize}
      closeOnInteractOutside={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
    >
      {/* Backdrop renders behind the panel */}
      <DrawerBackdrop bg="rgba(10, 18, 32, 0.7)" backdropFilter="blur(4px)" />

      {/* Positioner portals the drawer into body */}
      <DrawerPositioner>
        <DrawerContent bg="bg.surface" border="1px solid" borderColor="border" boxShadow="none">
          <DrawerHeader
            borderBottom={title ? '1px solid' : 'none'}
            borderColor="border"
            px="6"
            py="4"
            position="relative"
            minH={title ? undefined : '12'}
          >
            {title && (
              <DrawerTitle
                fontFamily="var(--font-heading)"
                fontSize="xl"
                fontWeight="semibold"
                color="text.heading"
                pr="8"
              >
                {title}
              </DrawerTitle>
            )}
            <DrawerCloseTrigger
              position="absolute"
              top="4"
              right="4"
              w="8"
              h="8"
              display="flex"
              alignItems="center"
              justifyContent="center"
              borderRadius="md"
              color="text.muted"
              _hover={{ bg: 'bg.subtle', color: 'text.heading' }}
              transition="all 0.15s"
              aria-label="Close drawer"
              type="button"
              cursor="pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </DrawerCloseTrigger>
          </DrawerHeader>

          <DrawerBody px="6" py="5">
            {children}
          </DrawerBody>

          {footer && (
            <DrawerFooter
              borderTop="1px solid"
              borderColor="border"
              px="6"
              py="4"
              display="flex"
              justifyContent="flex-end"
              gap="3"
            >
              {footer}
            </DrawerFooter>
          )}
        </DrawerContent>
      </DrawerPositioner>
    </DrawerRoot>
  );
}

