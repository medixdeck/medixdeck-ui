import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";

export interface StatCardProps extends BoxProps {
  /** Main metric value */
  value: string | number;
  /** Metric label */
  label: string;
  /** Optional sub-label or unit */
  unit?: string;
  /** Percentage change */
  change?: number;
  /** Trend direction — if not provided, inferred from change */
  trend?: "up" | "down" | "neutral";
  /** Icon to display */
  icon?: React.ReactNode;
  /** Color accent */
  accentColor?: string;
}

/**
 * MedixDeck StatCard
 *
 * Metric display card (e.g. 25K+ Happy Patients).
 *
 * @example
 * ```tsx
 * <StatCard value="25K+" label="Happy Patients" change={12.5} />
 * ```
 */
export const StatCard = React.forwardRef<HTMLDivElement, StatCardProps>(
  ({ value, label, unit, change, trend, icon, accentColor = "blue.500", ...props }, ref) => {
    const trendDir = trend ?? (change !== undefined ? (change >= 0 ? "up" : "down") : "neutral");
    const trendColor = trendDir === "up" ? "green.500" : trendDir === "down" ? "red.500" : "text.muted";

    return (
      <Box
        ref={ref}
        bg="bg.surface"
        border="1px solid"
        borderColor="border"
        borderRadius="card"
        p="6"
        boxShadow="card-light"
        _dark={{ boxShadow: "card-dark" }}
        {...props}
      >
        {icon && (
          <Box
            w="10"
            h="10"
            borderRadius="md"
            bg={`${accentColor.split(".")[0]}.100`}
            color={accentColor}
            display="flex"
            alignItems="center"
            justifyContent="center"
            mb="3"
            fontSize="xl"
          >
            {icon}
          </Box>
        )}

        <Box
          fontSize="4xl"
          fontWeight="bold"
          color="text.heading"
          fontFamily="var(--font-heading)"
          lineHeight="1.1"
        >
          {value}
          {unit && (
            <Box as="span" fontSize="xl" fontWeight="medium" color="text.muted" ml="1">
              {unit}
            </Box>
          )}
        </Box>

        <Box
          mt="1"
          fontSize="sm"
          color="text.muted"
          fontFamily="var(--font-body)"
        >
          {label}
        </Box>

        {change !== undefined && (
          <Box
            mt="2"
            display="inline-flex"
            alignItems="center"
            gap="1"
            fontSize="xs"
            fontWeight="medium"
            color={trendColor}
          >
            <Box as="span">{trendDir === "up" ? "↑" : trendDir === "down" ? "↓" : "→"}</Box>
            <Box as="span">
              {Math.abs(change)}%
            </Box>
          </Box>
        )}
      </Box>
    );
  }
);

StatCard.displayName = "MedixStatCard";
