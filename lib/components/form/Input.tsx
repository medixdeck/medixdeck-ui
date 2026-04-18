import React from "react";
import { Input as ChakraInput, type InputProps as ChakraInputProps, Box, Text } from "@chakra-ui/react";

export interface InputProps extends Omit<ChakraInputProps, "size"> {
  /** Input size */
  size?: "sm" | "md" | "lg";
  /** Left icon or element */
  leftElement?: React.ReactNode;
  /** Right icon or element */
  rightElement?: React.ReactNode;
  /** Error state */
  isInvalid?: boolean;
  /** Error message */
  errorMessage?: string;
}

const sizeStyles = {
  sm: { h: "8", px: "3", fontSize: "sm" },
  md: { h: "10", px: "4", fontSize: "md" },
  lg: { h: "12", px: "4", fontSize: "lg" },
};

/**
 * MedixDeck Input
 *
 * Text input field. Supports icons, validation, and all standard HTML input types.
 *
 * @example
 * ```tsx
 * <Input
 *   placeholder="Search for a doctor…"
 *   leftElement={<SearchIcon />}
 * />
 * <Input isInvalid errorMessage="Email is required" type="email" />
 * ```
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ size = "md", leftElement, rightElement, isInvalid, errorMessage, ...props }, ref) => {
    const hasLeft = Boolean(leftElement);
    const hasRight = Boolean(rightElement);

    return (
      <Box w="100%">
        <Box position="relative">
          {hasLeft && (
            <Box
              position="absolute"
              left="3"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              color="text.muted"
              display="flex"
              alignItems="center"
            >
              {leftElement}
            </Box>
          )}
          <ChakraInput
            ref={ref}
            {...sizeStyles[size]}
            pl={hasLeft ? "10" : sizeStyles[size].px}
            pr={hasRight ? "10" : sizeStyles[size].px}
            bg="bg.surface"
            border="1px solid"
            borderColor={isInvalid ? "red.500" : "border"}
            borderRadius="md"
            color="text.heading"
            fontFamily="var(--font-body)"
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
            }}
            {...props}
          />
          {hasRight && (
            <Box
              position="absolute"
              right="3"
              top="50%"
              transform="translateY(-50%)"
              zIndex="1"
              color="text.muted"
              display="flex"
              alignItems="center"
            >
              {rightElement}
            </Box>
          )}
        </Box>
        {isInvalid && errorMessage && (
          <Text mt="1" fontSize="xs" color="red.500" fontFamily="var(--font-body)">
            {errorMessage}
          </Text>
        )}
      </Box>
    );
  }
);

Input.displayName = "MedixInput";

/**
 * SearchInput — Quick search variant with built-in search icon
 */
export interface SearchInputProps extends Omit<InputProps, "leftElement"> {
  placeholder?: string;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ placeholder = "Search…", ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="search"
        placeholder={placeholder}
        leftElement={
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = "MedixSearchInput";
