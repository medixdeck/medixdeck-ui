import React from "react";
import { Box, Text, type BoxProps } from "@chakra-ui/react";
import { Button } from "../primitive/Button";

export interface NotFoundPageProps extends BoxProps {
  /** Optional custom title. Defaults to "Page Not Found" */
  title?: string;
  /** Optional custom description. Defaults to "The page you are looking for doesn't exist or has been moved." */
  description?: string;
  /** CTA button label. Defaults to "Go back home" */
  actionLabel?: string;
  /** CTA button onClick handler */
  onAction?: () => void;
  /** Secondary button label. */
  secondaryLabel?: string;
  /** Secondary button onClick handler */
  onSecondaryAction?: () => void;
}

/**
 * MedixDeck NotFoundPage (404)
 *
 * A reusable 404 error page layout for applications to render in their Not Found routing.
 *
 * @example
 * ```tsx
 * // app/not-found.tsx (Next.js App Router)
 * import { NotFoundPage } from "@medixdeck/ui";
 * import { useRouter } from "next/navigation";
 *
 * export default function NotFound() {
 *   const router = useRouter();
 *   return <NotFoundPage onAction={() => router.push("/")} />;
 * }
 * ```
 */
export function NotFoundPage({
  title = "Page Not Found",
  description = "The page you are looking for doesn't exist or has been moved.",
  actionLabel = "Go back home",
  onAction,
  secondaryLabel,
  onSecondaryAction,
  ...props
}: NotFoundPageProps) {
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
        fontSize="8xl"
        fontWeight="bold"
        color="blue.500"
        fontFamily="var(--font-heading)"
        lineHeight="1"
        mb="4"
        opacity={0.15}
      >
        404
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
        mb="8"
      >
        {description}
      </Text>
      
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
