import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { Button } from "../primitive/Button";

export interface EmptyStateProps extends BoxProps {
  /** Illustration or icon */
  icon?: React.ReactNode;
  /** Main heading */
  title: string;
  /** Supporting description */
  description?: string;
  /** CTA button label */
  actionLabel?: string;
  onAction?: () => void;
  /** Secondary link label */
  secondaryLabel?: string;
  onSecondaryAction?: () => void;
}

/**
 * MedixDeck EmptyState
 *
 * Shown when content is unavailable.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No appointments yet"
 *   description="Book a consultation with one of our licensed doctors."
 *   actionLabel="Find a Doctor"
 *   onAction={() => router.push("/search")}
 * />
 * ```
 */
export function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondaryAction,
  ...props
}: EmptyStateProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      py="16"
      px="8"
      gap="4"
      {...props}
    >
      {icon && (
        <Box
          w="16"
          h="16"
          borderRadius="full"
          bg="bg.subtle"
          display="flex"
          alignItems="center"
          justifyContent="center"
          fontSize="3xl"
          color="text.muted"
          mb="2"
        >
          {icon}
        </Box>
      )}
      <Box>
        <Box
          fontSize="xl"
          fontWeight="semibold"
          color="text.heading"
          fontFamily="var(--font-heading)"
          mb="2"
        >
          {title}
        </Box>
        {description && (
          <Box
            fontSize="md"
            color="text.muted"
            fontFamily="var(--font-body)"
            maxW="360px"
            lineHeight="loose"
          >
            {description}
          </Box>
        )}
      </Box>
      {(actionLabel || secondaryLabel) && (
        <Box display="flex" gap="3" mt="2">
          {actionLabel && (
            <Button variant="solid" colorScheme="blue" onClick={onAction}>
              {actionLabel}
            </Button>
          )}
          {secondaryLabel && (
            <Button variant="ghost" colorScheme="blue" onClick={onSecondaryAction}>
              {secondaryLabel}
            </Button>
          )}
        </Box>
      )}
    </Box>
  );
}
