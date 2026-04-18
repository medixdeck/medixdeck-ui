import React from "react";
import { Box, Text } from "@chakra-ui/react";

export interface FormControlProps {
  /** Unique ID for the field (links label to input) */
  id?: string;
  /** Field label */
  label?: string;
  /** Helper text below the field */
  helperText?: string;
  /** Error message — also activates error state */
  errorMessage?: string;
  /** Whether the field is required */
  isRequired?: boolean;
  /** Whether the field is disabled */
  isDisabled?: boolean;
  /** Form field child */
  children: React.ReactNode;
}

/**
 * MedixDeck FormControl
 *
 * Wrapper for form fields that adds label, helper text, and error display.
 *
 * @example
 * ```tsx
 * <FormControl label="Email address" isRequired errorMessage="Please enter a valid email.">
 *   <Input type="email" placeholder="you@example.com" isInvalid />
 * </FormControl>
 * ```
 */
export function FormControl({
  id,
  label,
  helperText,
  errorMessage,
  isRequired = false,
  isDisabled = false,
  children,
}: FormControlProps) {
  const isInvalid = Boolean(errorMessage);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1.5"
      opacity={isDisabled ? 0.5 : 1}
      pointerEvents={isDisabled ? "none" : undefined}
      w="100%"
    >
      {label && (
        <Box
          as="label"
          // Use a native HTML attribute via htmlFor on the label element
          {...({ htmlFor: id } as Record<string, unknown>)}
          display="flex"
          alignItems="center"
          gap="1"
        >
          <Text
            as="span"
            fontSize="sm"
            fontWeight="medium"
            color="text.heading"
            fontFamily="var(--font-body)"
          >
            {label}
          </Text>
          {isRequired && (
            <Text as="span" color="red.500" fontSize="sm" lineHeight="1">
              *
            </Text>
          )}
        </Box>
      )}

      {React.cloneElement(children as React.ReactElement<{ id?: string; isInvalid?: boolean }>, {
        id,
        isInvalid: isInvalid || undefined,
      })}

      {helperText && !isInvalid && (
        <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
          {helperText}
        </Text>
      )}

      {isInvalid && errorMessage && (
        <Text fontSize="xs" color="red.500" fontFamily="var(--font-body)">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}
