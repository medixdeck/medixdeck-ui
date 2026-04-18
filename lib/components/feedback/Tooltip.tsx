import React from "react";
import { Tooltip as ChakraTooltip, type TooltipRootProps } from "@chakra-ui/react";

export type TooltipPlacement =
  | "top" | "top-start" | "top-end"
  | "bottom" | "bottom-start" | "bottom-end"
  | "left" | "left-start" | "left-end"
  | "right" | "right-start" | "right-end";

export interface TooltipProps extends Omit<TooltipRootProps, "content"> {
  /** Text shown in the tooltip bubble */
  label: string;
  /** Element that triggers the tooltip */
  children: React.ReactNode;
  /**
   * Preferred placement of the tooltip relative to the trigger.
   * The tooltip will flip automatically if it overflows the viewport.
   * @default "top"
   */
  placement?: TooltipPlacement;
}

/**
 * MedixDeck Tooltip
 *
 * Hover label for icons, truncated text, and contextual hints.
 *
 * @example
 * ```tsx
 * <Tooltip label="MDCN Verified Doctor" placement="top">
 *   <span>✓</span>
 * </Tooltip>
 *
 * <Tooltip label="Copy patient ID" placement="bottom">
 *   <Button>📋</Button>
 * </Tooltip>
 * ```
 */
export function Tooltip({ label, children, placement = "top", ...props }: TooltipProps) {
  return (
    <ChakraTooltip.Root positioning={{ placement }} {...props}>
      <ChakraTooltip.Trigger asChild>
        {/* Tooltip.Trigger needs a single child element */}
        <span style={{ display: "inline-flex" }}>{children}</span>
      </ChakraTooltip.Trigger>
      <ChakraTooltip.Positioner>
        <ChakraTooltip.Content
          bg="gray.900"
          color="white"
          borderRadius="md"
          px="3"
          py="1.5"
          fontSize="xs"
          fontFamily="var(--font-body)"
          boxShadow="lg"
        >
          {label}
        </ChakraTooltip.Content>
      </ChakraTooltip.Positioner>
    </ChakraTooltip.Root>
  );
}
