import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface CardProps extends BoxProps {
  /** Remove default padding */
  noPadding?: boolean;
  /** Hover lift effect */
  hoverable?: boolean;
}

/**
 * MedixDeck Card
 *
 * Surface container for content blocks.
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader title="Patient Details" />
 *   <CardBody>…</CardBody>
 *   <CardFooter>…</CardFooter>
 * </Card>
 * ```
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ noPadding = false, hoverable = false, children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        bg="bg.surface"
        borderRadius="card"
        border="1px solid"
        borderColor="border"
        boxShadow="card-light"
        _dark={{ boxShadow: "card-dark" }}
        overflow="hidden"
        transition="all 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
        {...(hoverable && {
          _hover: {
            transform: "translateY(-2px)",
            boxShadow: "lg",
            borderColor: "blue.200",
          },
          cursor: "pointer",
        })}
        {...props}
      >
        {React.Children.map(children, (child) => {
          if (!child) return null;
          return child;
        })}
      </Box>
    );
  }
);

Card.displayName = "MedixCard";

// ─── CardHeader ──────────────────────────────────────────────────────────────

export interface CardHeaderProps extends BoxProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function CardHeader({ title, subtitle, action, children, ...props }: CardHeaderProps) {
  return (
    <Box
      px="6"
      py="4"
      borderBottom="1px solid"
      borderColor="border"
      display="flex"
      alignItems="flex-start"
      justifyContent="space-between"
      gap="4"
      {...props}
    >
      <Box flex="1">
        {title && (
          <Box
            as="h3"
            fontSize="lg"
            fontWeight="semibold"
            color="text.heading"
            fontFamily="var(--font-heading)"
            lineHeight="1.3"
          >
            {title}
          </Box>
        )}
        {subtitle && (
          <Box
            as="p"
            mt="0.5"
            fontSize="sm"
            color="text.muted"
            fontFamily="var(--font-body)"
          >
            {subtitle}
          </Box>
        )}
        {children}
      </Box>
      {action && <Box flexShrink={0}>{action}</Box>}
    </Box>
  );
}

// ─── CardBody ────────────────────────────────────────────────────────────────

export function CardBody({ children, ...props }: BoxProps) {
  return (
    <Box px="6" py="5" {...props}>
      {children}
    </Box>
  );
}

// ─── CardFooter ──────────────────────────────────────────────────────────────

export function CardFooter({ children, ...props }: BoxProps) {
  return (
    <Box
      px="6"
      py="4"
      borderTop="1px solid"
      borderColor="border"
      display="flex"
      alignItems="center"
      gap="3"
      {...props}
    >
      {children}
    </Box>
  );
}
