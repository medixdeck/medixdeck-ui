import React from 'react';
import { Box, Tag as ChakraTag, TagLabel, type BoxProps } from '@chakra-ui/react';

export type TagVariant = 'solid' | 'subtle' | 'outline';
export type TagColorScheme = 'blue' | 'purple' | 'green' | 'gray' | 'red' | 'amber';

export interface TagProps extends BoxProps {
  variant?: TagVariant;
  colorScheme?: TagColorScheme;
  /** Show a leading status dot. Dotted tags are the default. */
  showDot?: boolean;
  /** Optional close-button handler */
  onClose?: () => void;
  children: React.ReactNode;
}

const colorPaletteMap: Record<TagColorScheme, string> = {
  blue: 'blue',
  purple: 'purple',
  green: 'green',
  gray: 'gray',
  red: 'red',
  amber: 'amber',
};

const variantStyleMap: Record<TagVariant, Record<string, string>> = {
  solid: { bg: 'blue.500', color: 'white' },
  subtle: { bg: 'blue.100', color: 'blue.700' },
  outline: { bg: 'transparent', borderColor: 'blue.400', color: 'blue.600' },
};

/**
 * MedixDeck Tag / Chip
 *
 * For filters, categories, and selections.
 * Includes a leading dot by default for quick visual scanning.
 *
 * @example
 * ```tsx
 * <Tag colorScheme="blue" variant="subtle">Cardiology</Tag>
 * <Tag colorScheme="purple" variant="solid" showDot={false}>No dot</Tag>
 * ```
 */
export const Tag = React.forwardRef<HTMLDivElement, TagProps>(
  (
    { variant = 'subtle', colorScheme = 'blue', showDot = true, onClose, children, ...props },
    ref,
  ) => {
    // Dot must remain distinguishable from the tag background in every variant.
    const dotBg = variant === 'solid' ? 'white' : `${colorScheme}.500`;

    return (
      <Box
        ref={ref}
        as="span"
        display="inline-flex"
        alignItems="center"
        gap="1.5"
        px="2.5"
        py="1"
        borderRadius="full"
        fontSize="xs"
        fontWeight="medium"
        fontFamily="var(--font-body)"
        border="1px solid"
        borderColor={variant === 'outline' ? `${colorScheme}.400` : 'transparent'}
        bg={
          variant === 'solid'
            ? `${colorScheme}.500`
            : variant === 'subtle'
              ? `${colorScheme}.100`
              : 'transparent'
        }
        color={variant === 'solid' ? 'white' : `${colorScheme}.700`}
        transition="all 0.15s"
        cursor={onClose ? 'default' : undefined}
        {...props}
      >
        {showDot && (
          <Box
            as="span"
            aria-hidden="true"
            w="6px"
            h="6px"
            borderRadius="full"
            bg={dotBg}
            flexShrink={0}
          />
        )}
        {children}
        {onClose && (
          <Box
            as="button"
            onClick={onClose}
            ml="0.5"
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
  },
);

Tag.displayName = 'MedixTag';
