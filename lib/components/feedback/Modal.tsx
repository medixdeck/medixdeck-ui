"use client";

import React from "react";
import {
  DialogRoot,
  DialogPositioner,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogCloseTrigger,
  DialogBackdrop,
} from "@chakra-ui/react";

export type ModalSize = "xs" | "sm" | "md" | "lg" | "xl" | "full";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  /** Prevent closing on backdrop click */
  closeOnOverlayClick?: boolean;
  /** Footer action buttons */
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

// Chakra UI v3 DialogRoot accepts only its own size union
type ChakraDialogSize = "sm" | "md" | "lg" | "xl" | "xs" | "full" | "cover";

const sizeMap: Record<ModalSize, ChakraDialogSize> = {
  xs: "xs",
  sm: "sm",
  md: "md",
  lg: "lg",
  xl: "xl",
  full: "full",
};

/**
 * MedixDeck Modal
 *
 * Dialog overlay for focused interactions.
 *
 * @example
 * ```tsx
 * <Modal
 *   isOpen={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   title="Book Appointment"
 *   footer={<Button onClick={handleSubmit}>Confirm</Button>}
 * >
 *   <AppointmentForm />
 * </Modal>
 * ```
 */
export function Modal({
  isOpen,
  onClose,
  title,
  description,
  size = "md",
  closeOnOverlayClick = true,
  footer,
  children,
}: ModalProps) {
  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      closeOnInteractOutside={closeOnOverlayClick}
      size={sizeMap[size]}
    >
      {/* Backdrop renders behind the dialog */}
      <DialogBackdrop
        bg="rgba(10, 18, 32, 0.7)"
        backdropFilter="blur(4px)"
      />

      {/* Positioner is required in Chakra v3 to portal the dialog into <body> */}
      <DialogPositioner>
        <DialogContent
          bg="bg"
          border="1px solid"
          borderColor="border"
          borderRadius="modal"
          boxShadow="xl"
        >
          {(title || description) && (
            <DialogHeader borderBottom="1px solid" borderColor="border" px="6" py="4">
              {title && (
                <DialogTitle
                  fontFamily="var(--font-heading)"
                  fontSize="xl"
                  fontWeight="semibold"
                  color="text.heading"
                >
                  {title}
                </DialogTitle>
              )}
              {description && (
                <DialogDescription
                  mt="1"
                  fontSize="sm"
                  color="text.muted"
                  fontFamily="var(--font-body)"
                >
                  {description}
                </DialogDescription>
              )}
              <DialogCloseTrigger
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
            </DialogHeader>
          )}

          <DialogBody px="6" py="5">
            {children}
          </DialogBody>

          {footer && (
            <DialogFooter
              borderTop="1px solid"
              borderColor="border"
              px="6"
              py="4"
              display="flex"
              justifyContent="flex-end"
              gap="3"
            >
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
