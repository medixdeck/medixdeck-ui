import React from "react";
import { Textarea as ChakraTextarea, type TextareaProps as ChakraTextareaProps, Box, Text } from "@chakra-ui/react";

export interface TextareaProps extends ChakraTextareaProps {
  /** Error state */
  isInvalid?: boolean;
  /** Error message */
  errorMessage?: string;
  /** Show character count */
  maxLength?: number;
  /** Show remaining character count */
  showCount?: boolean;
}

/**
 * MedixDeck Textarea
 *
 * Multi-line text input for notes, messages, and descriptions.
 *
 * @example
 * ```tsx
 * <Textarea placeholder="Describe your symptoms…" rows={4} maxLength={500} showCount />
 * ```
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ isInvalid, errorMessage, maxLength, showCount = false, onChange, value, ...props }, ref) => {
    const [charCount, setCharCount] = React.useState(
      typeof value === "string" ? value.length : 0
    );

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setCharCount(e.target.value.length);
      onChange?.(e);
    };

    return (
      <Box w="100%">
        <ChakraTextarea
          ref={ref}
          bg="bg.surface"
          border="1px solid"
          borderColor={isInvalid ? "red.500" : "border"}
          borderRadius="md"
          color="text.heading"
          fontFamily="var(--font-body)"
          fontSize="md"
          px="4"
          py="3"
          resize="vertical"
          maxLength={maxLength}
          value={value}
          onChange={handleChange}
          _placeholder={{ color: "text.muted" }}
          _focus={{
            borderColor: isInvalid ? "red.500" : "blue.500",
            boxShadow: isInvalid
              ? "0 0 0 3px rgba(220, 38, 38, 0.15)"
              : "0 0 0 3px rgba(6, 133, 255, 0.15)",
            outline: "none",
          }}
          _dark={{
            bg: "bg.surface",
            borderColor: isInvalid ? "red.500" : "border",
            color: "text.heading",
            _placeholder: { color: "text.muted" },
          }}
          {...props}
        />
        <Box display="flex" justifyContent="space-between" mt="1">
          {isInvalid && errorMessage ? (
            <Text fontSize="xs" color="red.500" fontFamily="var(--font-body)">
              {errorMessage}
            </Text>
          ) : (
            <span />
          )}
          {showCount && maxLength && (
            <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)">
              {charCount}/{maxLength}
            </Text>
          )}
        </Box>
      </Box>
    );
  }
);

Textarea.displayName = "MedixTextarea";
