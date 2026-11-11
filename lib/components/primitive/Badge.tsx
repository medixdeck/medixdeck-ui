import React from 'react';

// ─── Badge color map — using exact MedixDeck brand hex ───────────────────────
// For display-only status badges we use hardcoded inline styles rather than
// Chakra's colorPalette system, ensuring the brand blue (#0685FF) is used
// instead of Chakra's default blue (#3B82F6).

export type BadgeVariant = 'solid' | 'subtle' | 'outline' | 'surface';
export type BadgeStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Visual style — controls opacity/border treatment */
  variant?: BadgeVariant;
  /** Semantic status — determines the colour */
  status?: BadgeStatus;
  /** Size */
  size?: BadgeSize;
  /** Whether to apply a fully rounded (100px) pill border radius vs the standard 4px */
  rounded?: boolean;
  /** Show a leading status dot. Dotted badges are the default. */
  showDot?: boolean;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
}

// Per-status raw hex pairs: [solid bg, text, tint bg, tint text, border]
const STATUS_COLORS: Record<
  BadgeStatus,
  {
    solid: string;
    solidText: string;
    tint: string;
    tintText: string;
    border: string;
  }
> = {
  success: {
    solid: '#1B7A38',
    solidText: '#fff',
    tint: '#DCFCE7',
    tintText: '#1B7A38',
    border: '#1B7A38',
  },
  warning: {
    solid: '#D97706',
    solidText: '#fff',
    tint: '#FEF3C7',
    tintText: '#B45309',
    border: '#D97706',
  },
  error: {
    solid: '#DC2626',
    solidText: '#fff',
    tint: '#FFE4E6',
    tintText: '#B91C1C',
    border: '#DC2626',
  },
  info: {
    solid: '#0685FF',
    solidText: '#fff',
    tint: '#E8F3FF',
    tintText: '#0562C2',
    border: '#0685FF',
  },
  neutral: {
    solid: '#6B7280',
    solidText: '#fff',
    tint: '#F3F4F6',
    tintText: '#374151',
    border: '#9CA3AF',
  },
};

const SIZE_STYLES: Record<
  BadgeSize,
  { padding: string; fontSize: number; lineHeight: string; dotSize: number; gap: number }
> = {
  sm: { padding: '1px 6px', fontSize: 10, lineHeight: '18px', dotSize: 6, gap: 4 },
  md: { padding: '2px 8px', fontSize: 11, lineHeight: '20px', dotSize: 7, gap: 5 },
  lg: { padding: '3px 10px', fontSize: 12, lineHeight: '22px', dotSize: 8, gap: 6 },
};

/**
 * MedixDeck Badge
 *
 * Status indicator chip using exact MedixDeck brand colours.
 * Includes a leading status dot by default for quick visual scanning.
 *
 * @example
 * ```tsx
 * <Badge rounded status="success">Verified</Badge>
 * <Badge rounded status="warning" variant="subtle">Pending</Badge>
 * <Badge rounded status="error" variant="solid">Cancelled</Badge>
 * <Badge status="info" showDot={false}>No dot</Badge>
 * ```
 */
export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      variant = 'subtle',
      status = 'neutral',
      size = 'md',
      rounded,
      showDot = true,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const c = STATUS_COLORS[status];
    const sz = SIZE_STYLES[size];

    let bg: string;
    let color: string;
    let border = '1px solid transparent';

    switch (variant) {
      case 'solid':
        bg = c.solid;
        color = c.solidText;
        break;
      case 'outline':
        bg = 'transparent';
        color = c.tintText;
        border = `1px solid ${c.border}`;
        break;
      case 'surface':
        bg = c.tint;
        color = c.tintText;
        border = `1px solid ${c.border}20`;
        break;
      case 'subtle':
      default:
        bg = c.tint;
        color = c.tintText;
        break;
    }

    // Dot must remain distinguishable from the badge background in every variant.
    const dotColor = variant === 'solid' ? c.solidText : c.solid;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: showDot ? sz.gap : 0,
      fontFamily: 'var(--font-body)',
      fontWeight: 500,
      letterSpacing: '0.03em',
      textTransform: 'none',
      borderRadius: rounded ? '100px' : 4,
      border,
      background: bg,
      color,
      whiteSpace: 'nowrap',
      padding: sz.padding,
      fontSize: sz.fontSize,
      lineHeight: sz.lineHeight,
      ...style,
    };

    return (
      <span ref={ref} style={baseStyle} {...props}>
        {showDot && (
          <span
            aria-hidden="true"
            style={{
              width: sz.dotSize,
              height: sz.dotSize,
              borderRadius: '50%',
              background: dotColor,
              flexShrink: 0,
              display: 'inline-block',
            }}
          />
        )}
        {children}
      </span>
    );
  },
);

Badge.displayName = 'MedixBadge';
