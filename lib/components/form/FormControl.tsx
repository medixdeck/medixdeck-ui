import React from 'react';
import { Box, Text } from '@chakra-ui/react';

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
 * Wires label association and ARIA helper/error descriptions to the child control.
 *
 * @example
 * ```tsx
 * <FormControl label="Email address" isRequired errorMessage="Please enter a valid email.">
 *   <Input type="email" placeholder="you@example.com" />
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
  const reactId = React.useId();
  const controlId = id ?? `medix-field-${reactId.replace(/:/g, '')}`;
  const isInvalid = Boolean(errorMessage);

  const helperId = helperText && !isInvalid ? `${controlId}-helper` : undefined;
  const errorId = isInvalid && errorMessage ? `${controlId}-error` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  let control = children;
  if (React.isValidElement(children)) {
    const childProps = children.props as Record<string, unknown>;
    const childDescribedBy =
      typeof childProps['aria-describedby'] === 'string'
        ? childProps['aria-describedby']
        : undefined;
    const mergedDescribedBy =
      [childDescribedBy, describedBy].filter(Boolean).join(' ') || undefined;

    control = React.cloneElement(children as React.ReactElement<Record<string, unknown>>, {
      id: (childProps.id as string | undefined) ?? controlId,
      isInvalid: isInvalid || Boolean(childProps.isInvalid) || undefined,
      'aria-invalid': isInvalid
        ? true
        : (childProps['aria-invalid'] as boolean | 'true' | 'false' | undefined),
      'aria-required':
        isRequired || childProps.required || childProps.isRequired || childProps['aria-required']
          ? true
          : undefined,
      'aria-describedby': mergedDescribedBy,
    });
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="1.5"
      opacity={isDisabled ? 0.5 : 1}
      pointerEvents={isDisabled ? 'none' : undefined}
      w="100%"
    >
      {label && (
        <Box
          as="label"
          // Use a native HTML attribute via htmlFor on the label element
          {...({ htmlFor: controlId } as Record<string, unknown>)}
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
            <Text as="span" color="red.500" fontSize="sm" lineHeight="1" aria-hidden="true">
              *
            </Text>
          )}
        </Box>
      )}

      {control}

      {helperId && helperText && (
        <Text id={helperId} fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
          {helperText}
        </Text>
      )}

      {errorId && errorMessage && (
        <Text id={errorId} fontSize="xs" color="red.500" fontFamily="var(--font-body)" role="alert">
          {errorMessage}
        </Text>
      )}
    </Box>
  );
}
