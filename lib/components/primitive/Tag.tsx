import React from "react";
import { Box, Tag as ChakraTag, TagLabel, type BoxProps } from "@chakra-ui/react";

export type TagVariant = "solid" | "subtle" | "outline";
export type TagColorScheme = "blue" | "purple" | "green" | "gray" | "red" | "amber";

export interface TagProps extends BoxProps {
  variant?: TagVariant;
  colorScheme?: TagColorScheme;
  /** Optional close-button handler */
  onClose?: () => void;
  children: React.ReactNode;
}

const colorPaletteMap: Record<TagColorScheme, string> = {
  blue: "blue",
  purple: "purple",
  green: "green",
  gray: "gray",
  red: "red",
  amber: "amber",
};

const variantStyleMap: Record<TagVariant, Record<string, string>> = {
  solid: { bg: "blue.500", color: "white" },
  subtle: { bg: "blue.100", color: "blue.700" },
  outline: { bg: "transparent", borderColor: "blue.400", color: "blue.600" },
};

/**
 * MedixDeck Tag / Chip
 *
 * For filters, categories, and selections.
 *
 * @example
 * ```tsx
 * <Tag colorScheme="blue" variant="subtle">Cardiology</Tag>
 * ```
 */
export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  ({ variant = "subtle", colorScheme = "blue", onClose, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        as="span"
        display="inline-flex"
        alignItems="center"
        gap="1"
        px="2.5"
        py="1"
        borderRadius="full"
        fontSize="xs"
        fontWeight="medium"
        fontFamily="var(--font-body)"
        border="1px solid"
        borderColor={variant === "outline" ? `${colorScheme}.400` : "transparent"}
        bg={
          variant === "solid"
            ? `${colorScheme}.500`
            : variant === "subtle"
            ? `${colorScheme}.100`
            : "transparent"
        }
        color={variant === "solid" ? "white" : `${colorScheme}.700`}
        transition="all 0.15s"
        cursor={onClose ? "default" : undefined}
        {...props}
      >
        {children}
        {onClose && (
          <Box
            as="button"
            onClick={onClose}
            ml="1"
            opacity={0.7}
            _hover={{ opacity: 1 }}
            lineHeight="1"
            fontSize="md"
            cursor="pointer"
            border="none"
            bg="transparent"
            padding="0"
            display="inline-flex"
            alignItems="center"
          >
            ×
          </Box>
        )}
      </Box>
    );
  }
);

Tag.displayName = "MedixTag";
