import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface ProgressProps extends BoxProps {
  /** Progress value 0–100 */
  value: number;
  /** Color scheme */
  colorScheme?: "blue" | "purple" | "green" | "amber" | "red";
  /** Height of the bar */
  size?: "xs" | "sm" | "md" | "lg";
  /** Show label */
  showLabel?: boolean;
  /** Animate on mount */
  animated?: boolean;
  /** Indeterminate (loop) animation */
  isIndeterminate?: boolean;
}

const colorMap: Record<NonNullable<ProgressProps["colorScheme"]>, string> = {
  blue: "#0685FF",
  purple: "#7700CC",
  green: "#1B7A38",
  amber: "#D97706",
  red: "#DC2626",
};

const heightMap: Record<NonNullable<ProgressProps["size"]>, string> = {
  xs: "2px",
  sm: "4px",
  md: "8px",
  lg: "12px",
};

// Inject indeterminate keyframes once
if (typeof document !== "undefined") {
  const styleId = "medix-progress-keyframes";
  if (!document.getElementById(styleId)) {
    const style = document.createElement("style");
    style.id = styleId;
    style.textContent = `
      @keyframes medix-indeterminate {
        0% { left: -40%; }
        100% { left: 100%; }
      }
    `;
    document.head.appendChild(style);
  }
}

/**
 * MedixDeck Progress / ProgressBar
 *
 * @example
 * ```tsx
 * <Progress value={75} colorScheme="blue" size="md" showLabel />
 * ```
 */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      value,
      colorScheme = "blue",
      size = "md",
      showLabel = false,
      animated = true,
      isIndeterminate = false,
      ...props
    },
    ref
  ) => {
    const clampedValue = Math.min(100, Math.max(0, value));
    const color = colorMap[colorScheme];
    const h = heightMap[size];

    return (
      <Box ref={ref} w="100%" {...props}>
        {showLabel && (
          <Box
            display="flex"
            justifyContent="space-between"
            mb="1"
            fontSize="xs"
            color="text.muted"
            fontFamily="var(--font-body)"
          >
            <span>Progress</span>
            <span>{clampedValue}%</span>
          </Box>
        )}
        <Box
          w="100%"
          h={h}
          bg="bg.subtle"
          borderRadius="full"
          overflow="hidden"
          position="relative"
        >
          {isIndeterminate ? (
            <Box
              position="absolute"
              h="100%"
              w="40%"
              bg={color}
              borderRadius="full"
              style={{ animation: "medix-indeterminate 1.5s linear infinite" }}
            />
          ) : (
            <Box
              h="100%"
              w={`${clampedValue}%`}
              bg={color}
              borderRadius="full"
              transition={animated ? "width 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none"}
              position="relative"
            />
          )}
        </Box>
      </Box>
    );
  }
);

Progress.displayName = "MedixProgress";
