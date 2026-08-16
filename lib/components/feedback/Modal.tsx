'use client';

import React from 'react';
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
} from '@chakra-ui/react';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalMobileVariant = 'centered' | 'bottom-sheet';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  size?: ModalSize;
  /** Prevent closing on backdrop click */
  closeOnOverlayClick?: boolean;
  /** Prevent closing on Escape key press */
  closeOnEscape?: boolean;
  /** Footer action buttons */
  footer?: React.ReactNode;
  children?: React.ReactNode;
  /**
   * On mobile viewports (< 768px), transforms the modal into a swipeable
   * bottom sheet that slides up from the bottom edge.
   * @default "bottom-sheet"
   */
  mobileVariant?: ModalMobileVariant;
}

// Chakra UI v3 DialogRoot accepts only its own size union
type ChakraDialogSize = 'sm' | 'md' | 'lg' | 'xl' | 'xs' | 'full' | 'cover';

const sizeMap: Record<ModalSize, ChakraDialogSize> = {
  xs: 'xs',
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  full: 'full',
};

// Inject bottom-sheet keyframe once
let bsKfInjected = false;
function injectBottomSheetKeyframe() {
  if (typeof document === 'undefined' || bsKfInjected) return;
  const s = document.createElement('style');
  s.textContent = `
    @keyframes medixBottomSheetIn {
      from { transform: translateY(100%); }
      to   { transform: translateY(0); }
    }
    @keyframes medixBottomSheetOut {
      from { transform: translateY(0); }
      to   { transform: translateY(100%); }
    }
  `;
  document.head.appendChild(s);
  bsKfInjected = true;
}

/**
 * MedixDeck Modal
 *
 * Dialog overlay for focused interactions.
 * On mobile viewports it automatically renders as a swipeable bottom sheet
 * (set `mobileVariant="centered"` to opt out of this behaviour).
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
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  footer,
  children,
  mobileVariant = 'bottom-sheet',
}: ModalProps) {
  const hasHeader = Boolean(title || description);

  React.useEffect(() => {
    injectBottomSheetKeyframe();
  }, []);

  const isBottomSheet = mobileVariant === 'bottom-sheet';

  return (
    <DialogRoot
      open={isOpen}
      onOpenChange={(details) => {
        if (!details.open) onClose();
      }}
      closeOnInteractOutside={closeOnOverlayClick}
      closeOnEscape={closeOnEscape}
      size={sizeMap[size]}
    >
      {/* Backdrop renders behind the dialog */}
      <DialogBackdrop bg="rgba(10, 18, 32, 0.7)" backdropFilter="blur(4px)" />

      {/* Positioner — bottom-sheet on mobile, centered on desktop */}
      <DialogPositioner
        display="flex"
        alignItems={isBottomSheet ? { base: 'flex-end', md: 'center' } : 'center'}
        justifyContent="center"
      >
        <DialogContent
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          boxShadow="none"
          /* Standard desktop radius */
          borderRadius={{ base: isBottomSheet ? 'none' : 'modal', md: 'modal' }}
          /* Bottom sheet: full width on mobile, standard width on desktop */
          w={{ base: isBottomSheet ? 'full' : undefined, md: undefined }}
          /* Rounded top corners only on mobile bottom sheet */
          borderTopRadius={isBottomSheet ? { base: 'modal', md: 'modal' } : 'modal'}
          style={
            isBottomSheet
              ? ({
                  '--bottom-sheet-animation': isOpen
                    ? 'medixBottomSheetIn 0.35s cubic-bezier(0.32,0.72,0,1) both'
                    : undefined,
                } as React.CSSProperties)
              : undefined
          }
        >
          <DialogHeader
            borderBottom={hasHeader ? '1px solid' : 'none'}
            borderColor="border"
            px="6"
            py="4"
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            justifyContent="space-between"
            position="relative"
            minH={hasHeader ? undefined : '12'}
          >
            {/* Bottom-sheet drag handle — visual affordance for swipeability */}
            {isBottomSheet && (
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  top: 10,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 36,
                  height: 4,
                  borderRadius: 2,
                  background: 'var(--chakra-colors-border, #E2E8F0)',
                  display: 'none',
                }}
                className="medix-bs-handle"
              />
            )}

            {hasHeader && (
              <div
                style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingRight: '2rem' }}
              >
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
              </div>
            )}

            {/* Close button with visible ✕ icon */}
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
              _hover={{ bg: 'bg.subtle', color: 'text.heading' }}
              transition="all 0.15s"
              aria-label="Close modal"
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
            </DialogCloseTrigger>
          </DialogHeader>

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
              /* On mobile bottom-sheet, add safe-area inset */
              style={
                isBottomSheet ? { paddingBottom: 'env(safe-area-inset-bottom, 16px)' } : undefined
              }
            >
              {footer}
            </DialogFooter>
          )}
        </DialogContent>
      </DialogPositioner>
    </DialogRoot>
  );
}
