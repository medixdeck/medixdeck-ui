import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface SkeletonProps extends BoxProps {
  isLoaded?: boolean;
  children?: React.ReactNode;
}

const shimmerKeyframes = `
@keyframes medix-shimmer {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
`;

// Inject keyframes once
if (typeof document !== "undefined") {
  const styleId = "medix-skeleton-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = shimmerKeyframes;
    document.head.appendChild(style);
  }
}

/**
 * MedixDeck Skeleton
 *
 * Placeholder for loading content.
 *
 * @example
 * ```tsx
 * <Skeleton h="4" w="200px" borderRadius="md" />
 * ```
 */
export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ isLoaded = false, children, ...props }, ref) => {
    if (isLoaded) {
      return <>{children}</>;
    }

    return (
      <Box
        ref={ref}
        position="relative"
        overflow="hidden"
        borderRadius="md"
        // Light mode: #E2E8F0 — visibly darker than bg.surface (#F6F6F6) and bg.subtle (#F0F4F8)
        // Dark mode:  a subtle white-tinted layer over the dark surface
        bg="#E2E8F0"
        _dark={{ bg: "rgba(255,255,255,0.08)" }}
        _before={{
          content: '""',
          position: "absolute",
          inset: "0",
          // Light mode shimmer: transparent → slightly lighter → transparent
          // gives a bright sweep across the grey bar
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 50%, transparent 100%)",
          animation: "medix-shimmer 1.6s ease-in-out infinite",
          transform: "translateX(-100%)",
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "MedixSkeleton";

// ─── SkeletonText ─────────────────────────────────────────────────────────────

export interface SkeletonTextProps extends BoxProps {
  lines?: number;
  spacing?: string;
  lastLineWidth?: string;
}

/**
 * MedixDeck SkeletonText
 */
export function SkeletonText({
  lines = 3,
  spacing = "3",
  lastLineWidth = "60%",
  ...props
}: SkeletonTextProps) {
  return (
    <Box display="flex" flexDirection="column" gap={spacing} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          h="3"
          w={i === lines - 1 ? lastLineWidth : "100%"}
          borderRadius="full"
        />
      ))}
    </Box>
  );
}

// ─── SkeletonCard ─────────────────────────────────────────────────────────────

/**
 * MedixDeck SkeletonCard
 */
export function SkeletonCard({ ...props }: BoxProps) {
  return (
    <Box
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="card"
      p="5"
      {...props}
    >
      <Skeleton h="48" borderRadius="md" mb="4" />
      <Box display="flex" alignItems="center" gap="3" mb="3">
        <Skeleton w="10" h="10" borderRadius="full" />
        <Box flex="1">
          <Skeleton h="3" w="60%" borderRadius="full" mb="2" />
          <Skeleton h="2.5" w="40%" borderRadius="full" />
        </Box>
      </Box>
      <SkeletonText lines={2} />
    </Box>
  );
}
