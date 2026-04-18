"use client";

import React from "react";
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
} from "@chakra-ui/react";

export type DrawerPlacement = "left" | "right" | "top" | "bottom";
export type DrawerSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  closeOnOverlayClick?: boolean;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

type ChakraDrawerPlacement = DrawerRootProps["placement"];
type ChakraDrawerSize = DrawerRootProps["size"];

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
  placement = "right",
  size = "md",
  closeOnOverlayClick = true,
  footer,
  children,
}: DrawerProps) {
  return (
    <DrawerRoot
      open={isOpen}
      onOpenChange={(details) => { if (!details.open) onClose(); }}
      placement={placement as ChakraDrawerPlacement}
      size={size as ChakraDrawerSize}
      closeOnInteractOutside={closeOnOverlayClick}
    >
      {/* Backdrop renders behind the panel */}
      <DrawerBackdrop bg="rgba(10, 18, 32, 0.6)" backdropFilter="blur(2px)" />

      {/* Positioner is required in Chakra v3 to portal the drawer into <body> */}
      <DrawerPositioner>
        <DrawerContent
          bg="bg"
          borderColor="border"
          boxShadow="2xl"
        >
          {title && (
            <DrawerHeader borderBottom="1px solid" borderColor="border" px="6" py="4">
              <DrawerTitle
                fontFamily="var(--font-heading)"
                fontSize="xl"
                fontWeight="semibold"
                color="text.heading"
              >
                {title}
              </DrawerTitle>
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
                _hover={{ bg: "bg.subtle", color: "text.heading" }}
                transition="all 0.15s"
              />
            </DrawerHeader>
          )}

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
