import React from "react";
import { Separator, type SeparatorProps } from "@chakra-ui/react";

export interface DividerProps extends SeparatorProps {
  /** Orientation of the divider */
  orientation?: "horizontal" | "vertical";
  /** Custom label in the center */
  label?: string;
}

/**
 * MedixDeck Divider
 *
 * Horizontal or vertical separator, optionally with a centered label.
 *
 * @example
 * ```tsx
 * <Divider />
 * <Divider label="or continue with" />
 * ```
 */
export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ orientation = "horizontal", label, ...props }, ref) => {
    if (label) {
      return (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            width: "100%",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "var(--chakra-colors-border)" }} />
          <span
            style={{
              fontSize: "var(--chakra-font-sizes-sm)",
              color: "var(--chakra-colors-text-muted)",
              whiteSpace: "nowrap",
              fontFamily: "var(--font-body)",
            }}
          >
            {label}
          </span>
          <div style={{ flex: 1, height: "1px", background: "var(--chakra-colors-border)" }} />
        </div>
      );
    }

    return <Separator ref={ref} orientation={orientation} borderColor="border" {...props} />;
  }
);

Divider.displayName = "MedixDivider";
