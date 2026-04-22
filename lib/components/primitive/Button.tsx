"use client";

import React from "react";
import { Box } from "@chakra-ui/react";

// ─── MedixDeck brand color definitions ────────────────────────────────────────
// Using raw hex values ensures the Button always renders with the correct brand
// colors regardless of how Chakra's colorPalette semantic-token bridge resolves.

const COLORS = {
  blue: {
    solid: "#0685FF",
    solidHover: "#0575E6",
    solidActive: "#0562C2",
    tint: "#E8F3FF",
    tintHover: "#D6EEFF",
    fg: "#0685FF",
    fgHover: "#0562C2",
  },
  purple: {
    solid: "#7700CC",
    solidHover: "#6600B3",
    solidActive: "#550099",
    tint: "#F9F0FF",
    tintHover: "#EDD6FF",
    fg: "#7700CC",
    fgHover: "#550099",
  },
  green: {
    solid: "#1B7A38",
    solidHover: "#166530",
    solidActive: "#125429",
    tint: "#F0FDF4",
    tintHover: "#DCFCE7",
    fg: "#1B7A38",
    fgHover: "#125429",
  },
  red: {
    solid: "#DC2626",
    solidHover: "#C41F1F",
    solidActive: "#AC1919",
    tint: "#FFF1F2",
    tintHover: "#FFE4E6",
    fg: "#DC2626",
    fgHover: "#AC1919",
  },
  amber: {
    solid: "#D97706",
    solidHover: "#C26905",
    solidActive: "#A85B04",
    tint: "#FFFBEB",
    tintHover: "#FEF3C7",
    fg: "#D97706",
    fgHover: "#A85B04",
  },
  black: {
    solid: "#111926",
    solidHover: "#0D131D",
    solidActive: "#000000",
    tint: "#F3F4F6",
    tintHover: "#E5E7EB",
    fg: "#111926",
    fgHover: "#000000",
  },
  gray: {
    solid: "#4B5563",
    solidHover: "#374151",
    solidActive: "#1F2937",
    tint: "#F9FAFB",
    tintHover: "#F3F4F6",
    fg: "#4B5563",
    fgHover: "#1F2937",
  },
} as Record<string, any>;

const SIZE = {
  xs: { height: "28px", px: "12px", fontSize: "11px" },
  sm: { height: "32px", px: "14px", fontSize: "13px" },
  md: { height: "40px", px: "18px", fontSize: "14px" },
  lg: { height: "48px", px: "24px", fontSize: "16px" },
} as const;

// ─── Props ────────────────────────────────────────────────────────────────────

export interface ButtonProps {
  /** Visual variant */
  variant?: "solid" | "outline" | "ghost" | "link" | "secondary";
  /** Size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Color scheme — maps to MedixDeck brand colors */
  colorScheme?: "blue" | "purple" | "green" | "red" | "amber" | "black" | "gray" | string;
  /** Show loading spinner */
  isLoading?: boolean;
  /** Element rendered before the label */
  leftIcon?: React.ReactElement;
  /** Element rendered after the label */
  rightIcon?: React.ReactElement;
  /** Disabled state */
  disabled?: boolean;
  /** HTML type attribute */
  type?: "button" | "submit" | "reset";
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLElement>;
  /** Any additional className */
  className?: string;
  /** Arbitrary additional style */
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
  "aria-label"?: string;
  "aria-expanded"?: boolean | "true" | "false";
  "aria-controls"?: string;
  "aria-haspopup"?: boolean | "dialog" | "menu" | "grid" | "listbox" | "tree";
  /** HTML element to render as — supports "button" (default) or "a" (anchor link) */
  as?: "button" | "a";
  /** Link destination if rendered as an anchor */
  href?: string;
  /** Link target if rendered as an anchor */
  target?: string;
  /** Link rel if rendered as an anchor */
  rel?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MedixDeck Button
 *
 * Uses the MedixDeck brand palette directly — #0685FF for blue, #7700CC for
 * purple — so the rendered colors are always accurate regardless of Chakra's
 * theme resolution order.
 *
 * @example
 * ```tsx
 * <Button variant="solid" colorScheme="blue">Talk to a Doctor</Button>
 * <Button variant="outline" colorScheme="purple">Learn More</Button>
 * <Button variant="ghost" colorScheme="blue" size="sm">Cancel</Button>
 * ```
 */
export const Button = React.forwardRef<HTMLElement, ButtonProps>(
  (
    {
      variant = "solid",
      size = "md",
      colorScheme = "blue",
      isLoading = false,
      leftIcon,
      rightIcon,
      disabled,
      children,
      style,
      as: Component = "button",
      href,
      target,
      rel,
      ...props
    },
    ref
  ) => {
    // Safely fallback to blue if an invalid/unsupported color scheme is passed
    const c = COLORS[colorScheme] || COLORS.blue;
    const s = SIZE[size as keyof typeof SIZE] || SIZE.md;

    // ── Compute base styles per variant ────────────────────────────────────
    const base: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.4rem",
      height: s.height,
      paddingLeft: s.px,
      paddingRight: s.px,
      fontSize: s.fontSize,
      fontWeight: 600,
      fontFamily: "var(--font-body)",
      borderRadius: 8,
      border: "none",
      cursor: disabled || isLoading ? "not-allowed" : "pointer",
      opacity: disabled || isLoading ? 0.55 : 1,
      outline: "none",
      textDecoration: "none",
      whiteSpace: "nowrap",
      userSelect: "none",
      WebkitTapHighlightColor: "transparent",
      transition: "background 0.18s ease, color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease",
    };

    let variantStyles: React.CSSProperties = {};

    switch (variant) {
      case "solid":
        variantStyles = {
          background: c.solid,
          color: "#FFFFFF",
        };
        break;
      case "outline":
        variantStyles = {
          background: "transparent",
          color: c.fg,
          border: `1.5px solid ${c.solid}`,
        };
        break;
      case "ghost":
        variantStyles = {
          background: "transparent",
          color: c.fg,
          border: "none",
        };
        break;
      case "secondary":
        variantStyles = {
          background: c.tint,
          color: c.fg,
          border: "none",
        };
        break;
      case "link":
        variantStyles = {
          background: "transparent",
          color: c.fg,
          border: "none",
          padding: 0,
          height: "auto",
          fontSize: s.fontSize,
          textDecoration: "underline",
          textUnderlineOffset: "3px",
        };
        break;
    }

    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);

    // Hover / active visual feedback
    let stateOverride: React.CSSProperties = {};
    if ((hovered || pressed) && !disabled && !isLoading) {
      switch (variant) {
        case "solid":
          stateOverride = {
            background: pressed ? c.solidActive : c.solidHover,
            boxShadow: pressed ? "none" : "0 4px 14px rgba(0,0,0,0.18)",
          };
          break;
        case "outline":
          stateOverride = {
            background: c.tint,
            color: c.fgHover,
          };
          break;
        case "ghost":
          stateOverride = {
            background: c.tint,
          };
          break;
        case "secondary":
          stateOverride = {
            background: c.tintHover,
          };
          break;
        case "link":
          stateOverride = {
            color: c.fgHover,
          };
          break;
      }
    }

    const composedStyle: React.CSSProperties = {
      ...base,
      ...variantStyles,
      ...stateOverride,
      ...style,
    };

    return (
      <Component
        ref={ref}
        type={Component === "button" ? (props.type ?? "button") : undefined}
        href={href}
        target={target}
        rel={rel}
        disabled={Component === "button" ? (disabled || isLoading) : undefined}
        style={composedStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onFocus={(e: React.FocusEvent<HTMLElement>) => {
          e.currentTarget.style.boxShadow =
            `0 0 0 2px #FFFFFF, 0 0 0 4px ${c.solid}`;
        }}
        onBlur={(e: React.FocusEvent<HTMLElement>) => {
          e.currentTarget.style.boxShadow =
            stateOverride.boxShadow ?? variantStyles.boxShadow ?? "none";
        }}
        {...props}
        aria-disabled={
          Component !== "button" && (disabled || isLoading)
            ? true
            : (props as { "aria-disabled"?: boolean | "true" | "false" })[
                "aria-disabled"
              ]
        }
        onClick={(e: any) => {
          if (Component !== "button" && (disabled || isLoading)) {
            e.preventDefault();
            return;
          }
          props.onClick?.(e);
        }}
      >
        {isLoading ? (
          <Box
            as="span"
            display="inline-block"
            w="1em"
            h="1em"
            borderRadius="full"
            border="2px solid currentColor"
            borderTopColor="transparent"
            style={{ animation: "medix-spin 0.65s linear infinite" }}
          />
        ) : (
          <>
            {leftIcon && (
              <span style={{ display: "inline-flex", flexShrink: 0 }}>
                {leftIcon}
              </span>
            )}
            {children}
            {rightIcon && (
              <span style={{ display: "inline-flex", flexShrink: 0 }}>
                {rightIcon}
              </span>
            )}
          </>
        )}
      </Component>
    );
  }
);

Button.displayName = "MedixButton";
