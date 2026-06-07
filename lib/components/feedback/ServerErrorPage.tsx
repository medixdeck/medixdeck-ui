import { Box, Text, type BoxProps } from '@chakra-ui/react';
import { Button } from '../primitive/Button';

declare const process: any;

export interface ServerErrorPageProps extends BoxProps {
  /** Optional custom title. Defaults to "Something went wrong" */
  title?: string;
  /** Optional custom description. Defaults to "An unexpected error occurred on our end. Please try again later." */
  description?: string;
  /** Optional error message details to display in a code block */
  errorMessage?: string;
  /** CTA button label. Defaults to "Try again" */
  actionLabel?: string;
  /** CTA button onClick handler (e.g. reset() in Next.js) */
  onAction?: () => void;
  /** Secondary button label. */
  secondaryLabel?: string;
  /** Secondary button onClick handler */
  onSecondaryAction?: () => void;
}

/**
 * MedixDeck ServerErrorPage (500)
 *
 * A reusable 500 error page layout for applications to render in their global error routing.
 *
 * @example
 * ```tsx
 * // app/error.tsx (Next.js App Router)
 * "use client";
 * import { ServerErrorPage } from "@medixdeck/ui";
 *
 * export default function Error({ error, reset }: { error: Error; reset: () => void }) {
 *   return <ServerErrorPage errorMessage={error.message} onAction={() => reset()} />;
 * }
 * ```
 */
export function ServerErrorPage({
  title = 'Something went wrong',
  description = 'An unexpected error occurred on our end. Please try again later.',
  errorMessage,
  actionLabel = 'Try again',
  onAction,
  secondaryLabel,
  onSecondaryAction,
  ...props
}: ServerErrorPageProps) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      textAlign="center"
      minH="100vh"
      px="6"
      bg="bg"
      {...props}
    >
      <Box
        w="20"
        h="20"
        borderRadius="full"
        bg="red.50"
        _dark={{ bg: 'rgba(220, 38, 38, 0.1)' }}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="red.500"
        mb="6"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </Box>

      <Text
        fontSize="2xl"
        fontWeight="bold"
        color="text.heading"
        fontFamily="var(--font-heading)"
        mb="3"
      >
        {title}
      </Text>

      <Text
        fontSize="md"
        color="text.muted"
        fontFamily="var(--font-body)"
        maxW="400px"
        mb={errorMessage ? '4' : '8'}
      >
        {description}
      </Text>

      {errorMessage && process.env.NODE_ENV === 'development' && (
        <Box
          bg="bg.surface"
          border="1px solid"
          borderColor="border"
          borderRadius="md"
          p="3"
          mb="8"
          maxW="500px"
          w="100%"
          textAlign="left"
          overflowX="auto"
          fontFamily="var(--font-mono)"
          fontSize="sm"
          color="text.muted"
        >
          {errorMessage}
        </Box>
      )}

      <Box display="flex" gap="4">
        {actionLabel && (
          <Button variant="solid" colorScheme="blue" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
        {secondaryLabel && (
          <Button variant="outline" colorScheme="blue" onClick={onSecondaryAction}>
            {secondaryLabel}
          </Button>
        )}
      </Box>
    </Box>
  );
}
