/**
 * MedixDeck Typography Tokens
 * Font: Satoshi (from Fontshare)
 * Scale derived from style guide.
 */
export const typographyTokens = {
  fonts: {
    heading: { value: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    body: { value: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    mono: { value: "'JetBrains Mono', 'Fira Code', 'Fira Mono', monospace" },
  },

  fontSizes: {
    "2xs": { value: "0.625rem" },   // 10px
    xs: { value: "0.6875rem" },     // 11px – Label
    sm: { value: "0.75rem" },       // 12px – Small
    md: { value: "0.875rem" },      // 14px – Body ★
    lg: { value: "1rem" },          // 16px
    xl: { value: "1.125rem" },      // 18px
    "2xl": { value: "1.3125rem" },  // 21px – H3 ★
    "3xl": { value: "1.5rem" },     // 24px
    "4xl": { value: "1.75rem" },    // 28px – H2 ★
    "5xl": { value: "2.25rem" },    // 36px – H1 ★
    "6xl": { value: "3.25rem" },    // 52px – Display ★
  },

  fontWeights: {
    normal: { value: "400" },
    medium: { value: "500" },
    semibold: { value: "600" },
    bold: { value: "700" },
  },

  lineHeights: {
    none: { value: "1" },
    tight: { value: "1.1" },   // Display
    snug: { value: "1.2" },    // H1
    normal: { value: "1.3" },  // H2
    relaxed: { value: "1.4" }, // H3
    loose: { value: "1.6" },   // Body ★
  },

  letterSpacings: {
    tight: { value: "-0.01em" },
    normal: { value: "0em" },
    wide: { value: "0.05em" },  // Label caps
    wider: { value: "0.1em" },
  },
} as const;

/**
 * Text style compositions
 */
export const textStyleTokens = {
  display: {
    value: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--font-size-6xl)",
      fontWeight: "var(--font-weight-bold)",
      lineHeight: "var(--line-height-tight)",
      letterSpacing: "var(--letter-spacing-tight)",
    },
  },
  h1: {
    value: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--font-size-5xl)",
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: "var(--line-height-snug)",
      letterSpacing: "var(--letter-spacing-tight)",
    },
  },
  h2: {
    value: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--font-size-4xl)",
      fontWeight: "var(--font-weight-semibold)",
      lineHeight: "var(--line-height-normal)",
    },
  },
  h3: {
    value: {
      fontFamily: "var(--font-heading)",
      fontSize: "var(--font-size-2xl)",
      fontWeight: "var(--font-weight-medium)",
      lineHeight: "var(--line-height-relaxed)",
    },
  },
  body: {
    value: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--font-size-md)",
      fontWeight: "var(--font-weight-normal)",
      lineHeight: "var(--line-height-loose)",
    },
  },
  small: {
    value: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--font-size-sm)",
      fontWeight: "var(--font-weight-normal)",
      lineHeight: "var(--line-height-normal)",
    },
  },
  label: {
    value: {
      fontFamily: "var(--font-body)",
      fontSize: "var(--font-size-xs)",
      fontWeight: "var(--font-weight-medium)",
      letterSpacing: "var(--letter-spacing-wide)",
      textTransform: "uppercase" as const,
    },
  },
  mono: {
    value: {
      fontFamily: "var(--font-mono)",
      fontSize: "var(--font-size-md)",
      fontWeight: "var(--font-weight-normal)",
    },
  },
} as const;
