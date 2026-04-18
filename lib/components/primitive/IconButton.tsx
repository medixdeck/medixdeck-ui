"use client";

import React from "react";

// ─── Reuses the same brand color map as Button.tsx ───────────────────────────

const COLORS = {
  blue:   { solid: "#0685FF", solidHover: "#0575E6", solidActive: "#0562C2", tint: "#E8F3FF", tintHover: "#D6EEFF", fg: "#0685FF" },
  purple: { solid: "#7700CC", solidHover: "#6600B3", solidActive: "#550099", tint: "#F9F0FF", tintHover: "#EDD6FF", fg: "#7700CC" },
  green:  { solid: "#1B7A38", solidHover: "#166530", solidActive: "#125429", tint: "#F0FDF4", tintHover: "#DCFCE7", fg: "#1B7A38" },
  red:    { solid: "#DC2626", solidHover: "#C41F1F", solidActive: "#AC1919", tint: "#FFF1F2", tintHover: "#FFE4E6", fg: "#DC2626" },
  gray:   { solid: "#6B7280", solidHover: "#4B5563", solidActive: "#374151", tint: "#F3F4F6", tintHover: "#E5E7EB", fg: "#374151" },
} as const;

const SIZE: Record<"xs" | "sm" | "md" | "lg", React.CSSProperties> = {
  xs: { width: 24, height: 24, fontSize: 12, borderRadius: 6 },
  sm: { width: 28, height: 28, fontSize: 14, borderRadius: 6 },
  md: { width: 36, height: 36, fontSize: 16, borderRadius: 8 },
  lg: { width: 44, height: 44, fontSize: 18, borderRadius: 8 },
};

// ─── Props ───────────────────────────────────────────────────────────────────

export interface IconButtonProps {
  /** Accessible label — required for screen readers */
  "aria-label": string;
  /** Visual variant */
  variant?: "solid" | "outline" | "ghost";
  /** Size */
  size?: "xs" | "sm" | "md" | "lg";
  /** Brand color scheme */
  colorScheme?: "blue" | "purple" | "green" | "red" | "gray";
  /** Render as a circle instead of a rounded square */
  isRound?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** HTML type attribute */
  type?: "button" | "submit" | "reset";
  /** Click handler */
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  id?: string;
}

/**
 * MedixDeck IconButton
 *
 * Square (or circle) icon-only button using exact MedixDeck brand colours.
 *
 * @example
 * ```tsx
 * <IconButton aria-label="Close" variant="ghost" colorScheme="red">
 *   <XIcon />
 * </IconButton>
 * ```
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      variant = "ghost",
      size = "md",
      colorScheme = "blue",
      isRound = false,
      disabled,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const c = COLORS[colorScheme];
    const sz = SIZE[size];

    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);

    let base: React.CSSProperties;
    switch (variant) {
      case "solid":
        base = { background: hovered ? (pressed ? c.solidActive : c.solidHover) : c.solid, color: "#fff" };
        break;
      case "outline":
        base = {
          background: hovered ? c.tint : "transparent",
          color: c.fg,
          border: `1.5px solid ${c.solid}`,
        };
        break;
      case "ghost":
      default:
        base = { background: hovered ? c.tint : "transparent", color: c.fg };
        break;
    }

    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={disabled}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.55 : 1,
          outline: "none",
          flexShrink: 0,
          transition: "background 0.15s ease, box-shadow 0.15s ease",
          ...sz,
          ...(isRound ? { borderRadius: "50%" } : {}),
          ...base,
          ...style,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        onFocus={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow =
            `0 0 0 2px #fff, 0 0 0 4px ${c.solid}`;
        }}
        onBlur={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
        }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

IconButton.displayName = "MedixIconButton";
