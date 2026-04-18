import React from "react";

// ─── Badge color map — using exact MedixDeck brand hex ───────────────────────
// For display-only status badges we use hardcoded inline styles rather than
// Chakra's colorPalette system, ensuring the brand blue (#0685FF) is used
// instead of Chakra's default blue (#3B82F6).

export type BadgeVariant = "solid" | "subtle" | "outline" | "surface";
export type BadgeStatus = "success" | "warning" | "error" | "info" | "neutral";
export type BadgeSize = "sm" | "md" | "lg";

export interface BadgeProps {
  /** Visual style — controls opacity/border treatment */
  variant?: BadgeVariant;
  /** Semantic status — determines the colour */
  status?: BadgeStatus;
  /** Size */
  size?: BadgeSize;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

// Per-status raw hex pairs: [solid bg, text, tint bg, tint text, border]
const STATUS_COLORS: Record<BadgeStatus, {
  solid: string; solidText: string;
  tint: string;  tintText: string;
  border: string;
}> = {
  success: { solid: "#1B7A38", solidText: "#fff", tint: "#DCFCE7", tintText: "#1B7A38", border: "#1B7A38" },
  warning: { solid: "#D97706", solidText: "#fff", tint: "#FEF3C7", tintText: "#B45309", border: "#D97706" },
  error:   { solid: "#DC2626", solidText: "#fff", tint: "#FFE4E6", tintText: "#B91C1C", border: "#DC2626" },
  info:    { solid: "#0685FF", solidText: "#fff", tint: "#E8F3FF", tintText: "#0562C2", border: "#0685FF" },
  neutral: { solid: "#6B7280", solidText: "#fff", tint: "#F3F4F6", tintText: "#374151", border: "#9CA3AF" },
};

const SIZE_STYLES: Record<BadgeSize, React.CSSProperties> = {
  sm: { padding: "1px 6px",  fontSize: 10, lineHeight: "18px" },
  md: { padding: "2px 8px",  fontSize: 11, lineHeight: "20px" },
  lg: { padding: "3px 10px", fontSize: 12, lineHeight: "22px" },
};

/**
 * MedixDeck Badge
 *
 * Status indicator chip using exact MedixDeck brand colours.
 *
 * @example
 * ```tsx
 * <Badge status="success">Verified</Badge>
 * <Badge status="warning" variant="subtle">Pending</Badge>
 * <Badge status="error" variant="solid">Cancelled</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = "subtle", status = "neutral", size = "md", children, style, ...props }, ref) => {
    const c = STATUS_COLORS[status];
    const sz = SIZE_STYLES[size];

    let bg: string;
    let color: string;
    let border = "1px solid transparent";

    switch (variant) {
      case "solid":
        bg = c.solid; color = c.solidText; break;
      case "outline":
        bg = "transparent"; color = c.tintText; border = `1px solid ${c.border}`; break;
      case "surface":
        bg = c.tint; color = c.tintText; border = `1px solid ${c.border}20`; break;
      case "subtle":
      default:
        bg = c.tint; color = c.tintText; break;
    }

    const baseStyle: React.CSSProperties = {
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "var(--font-body)",
      fontWeight: 500,
      letterSpacing: "0.03em",
      textTransform: "none",
      borderRadius: 4,
      border,
      background: bg,
      color,
      whiteSpace: "nowrap",
      ...sz,
      ...style,
    };

    return (
      <span ref={ref} style={baseStyle} {...props}>
        {children}
      </span>
    );
  }
);

Badge.displayName = "MedixBadge";
