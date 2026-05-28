/**
 * MedixDeck Typography Tokens
 * Font: Satoshi (from Fontshare)
 * Scale derived from style guide.
 *
 * Font sizes use CSS clamp() for fluid, responsive scaling.
 * Formula: clamp(min-size, preferred-fluid, max-size)
 *   - min-size : smallest the text will ever be (mobile)
 *   - preferred : viewport-relative growth (vw + rem mix)
 *   - max-size : largest the text will ever be (desktop)
 *
 * Consuming components automatically get responsive text by
 * referencing any token — no media queries needed.
 */
export const typographyTokens = {
  fonts: {
    heading: { value: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    body: { value: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
    mono: { value: "'JetBrains Mono', 'Fira Code', 'Fira Mono', monospace" },
  },

  fontSizes: {
    //                  clamp(mobile-min,  fluid-preferred,        desktop-max)
    "2xs": { value: "clamp(0.5625rem,   0.5rem   + 0.2vw,  0.625rem)"   }, // 9–10px
    xs:   { value: "clamp(0.625rem,    0.5625rem + 0.25vw, 0.75rem)"    }, // 10–12px  Label
    sm:   { value: "clamp(0.6875rem,   0.625rem  + 0.3vw,  0.8125rem)"  }, // 11–13px  Small
    md:   { value: "clamp(0.8125rem,   0.75rem   + 0.35vw, 0.9375rem)"  }, // 13–15px  Body ★
    lg:   { value: "clamp(0.9375rem,   0.875rem  + 0.4vw,  1.0625rem)"  }, // 15–17px
    xl:   { value: "clamp(1rem,        0.9375rem + 0.5vw,  1.1875rem)"  }, // 16–19px
    "2xl": { value: "clamp(1.125rem,   1rem      + 0.6vw,  1.4375rem)"  }, // 18–23px  H3 ★
    "3xl": { value: "clamp(1.25rem,    1.125rem  + 0.75vw, 1.625rem)"   }, // 20–26px
    "4xl": { value: "clamp(1.5rem,     1.25rem   + 1vw,    2rem)"       }, // 24–32px  H2 ★
    "5xl": { value: "clamp(1.75rem,    1.5rem    + 1.5vw,  2.5rem)"     }, // 28–40px  H1 ★
    "6xl": { value: "clamp(2.25rem,    1.75rem   + 2.5vw,  3.5rem)"     }, // 36–56px  Display ★
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
