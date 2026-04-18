import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

// ─── Container ───────────────────────────────────────────────────────────────

export interface ContainerProps extends BoxProps {
  /** Max width preset */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
}

const maxWidthMap = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1440px",
  full: "100%",
};

/**
 * MedixDeck Container
 *
 * Centers and constrains page content.
 *
 * @example
 * ```tsx
 * <Container maxWidth="xl">
 *   <Navbar />
 * </Container>
 * ```
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ maxWidth = "xl", children, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        w="100%"
        maxW={maxWidthMap[maxWidth]}
        mx="auto"
        px={{ base: "4", md: "6", lg: "8" }}
        {...props}
      >
        {children}
      </Box>
    );
  }
);

Container.displayName = "MedixContainer";

// ─── SectionHeader ────────────────────────────────────────────────────────────

export interface SectionHeaderProps extends BoxProps {
  /** Section tag/eyebrow label */
  eyebrow?: string;
  /** Main heading */
  title: string;
  /** Description / subtitle */
  description?: string;
  /** Alignment */
  align?: "left" | "center" | "right";
  /** Action slot (button) */
  action?: React.ReactNode;
  /** Eyebrow color */
  eyebrowColor?: string;
}

/**
 * MedixDeck SectionHeader
 *
 * Consistent section headers used across MedixDeck pages.
 *
 * @example
 * ```tsx
 * <SectionHeader
 *   eyebrow="How it Works"
 *   title="Smart healthcare, simplified into a few intuitive steps."
 *   align="center"
 * />
 * ```
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  action,
  eyebrowColor = "blue.500",
  ...props
}: SectionHeaderProps) {
  const textAlign = align as "left" | "center" | "right";
  const alignItems =
    align === "center" ? "center" : align === "right" ? "flex-end" : "flex-start";

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={alignItems}
      textAlign={textAlign}
      gap="3"
      {...props}
    >
      {eyebrow && (
        <Box
          as="span"
          fontSize="xs"
          fontWeight="bold"
          color={eyebrowColor}
          letterSpacing="wider"
          textTransform="uppercase"
          fontFamily="var(--font-body)"
        >
          {eyebrow}
        </Box>
      )}
      <Box
        as="h2"
        fontSize={{ base: "3xl", md: "4xl" }}
        fontWeight="semibold"
        color="text.heading"
        fontFamily="var(--font-heading)"
        lineHeight="snug"
        maxW={align === "center" ? "720px" : undefined}
      >
        {title}
      </Box>
      {description && (
        <Box
          as="p"
          fontSize="md"
          color="text.body"
          fontFamily="var(--font-body)"
          lineHeight="loose"
          maxW={align === "center" ? "640px" : undefined}
        >
          {description}
        </Box>
      )}
      {action && <Box mt="2">{action}</Box>}
    </Box>
  );
}
