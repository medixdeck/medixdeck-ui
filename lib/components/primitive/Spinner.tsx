import React from "react";
import { Spinner as ChakraSpinner } from "@chakra-ui/react";
import { Box, Text } from "@chakra-ui/react";

export interface SpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  label?: string;
  color?: string;
  [key: string]: unknown;
}

/**
 * MedixDeck Spinner
 *
 * Loading indicator for async operations.
 *
 * @example
 * ```tsx
 * <Spinner size="md" label="Loading..." />
 * ```
 */
export function Spinner({ size = "md", label, color = "blue.500", ...props }: SpinnerProps) {
  return (
    <Box display="inline-flex" flexDirection="column" alignItems="center" gap="2">
      <ChakraSpinner size={size} color={color} borderWidth="2px" {...props} />
      {label && (
        <Text textStyle="small" color="text.muted">
          {label}
        </Text>
      )}
    </Box>
  );
}

/**
 * FullPageSpinner — centered full-page loading state
 */
export function FullPageSpinner({ label }: { label?: string }) {
  return (
    <Box
      position="fixed"
      inset="0"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="bg"
      zIndex="overlay"
    >
      <Spinner size="xl" label={label ?? "Loading…"} />
    </Box>
  );
}
