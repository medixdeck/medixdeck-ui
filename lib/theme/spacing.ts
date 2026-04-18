/**
 * MedixDeck Spacing & Radius Tokens
 * From style guide: Spacing scale 4, 8, 12, 16, 24, 32, 48, 64
 * Radius: Badge=4px, Button/Input=8px, Card=12px, Modal/Sheet=16px, Avatar=50%
 */
export const spacingTokens = {
  // Core spacing scale
  0: { value: "0px" },
  1: { value: "4px" },   // ★
  2: { value: "8px" },   // ★
  3: { value: "12px" },  // ★
  4: { value: "16px" },  // ★
  6: { value: "24px" },  // ★
  8: { value: "32px" },  // ★
  12: { value: "48px" }, // ★
  16: { value: "64px" }, // ★
  20: { value: "80px" },
  24: { value: "96px" },
  32: { value: "128px" },
  40: { value: "160px" },
  48: { value: "192px" },
} as const;

export const radiiTokens = {
  none: { value: "0px" },
  badge: { value: "4px" },    // Badge ★
  sm: { value: "4px" },
  md: { value: "8px" },       // Button / Input ★
  card: { value: "12px" },    // Card ★
  lg: { value: "12px" },
  modal: { value: "16px" },   // Modal / Sheet ★
  xl: { value: "16px" },
  "2xl": { value: "20px" },
  "3xl": { value: "24px" },
  full: { value: "9999px" },  // Pills / Tags
  circle: { value: "50%" },   // Avatar / FAB ★
} as const;

export const shadowTokens = {
  xs: { value: "0 1px 2px 0 rgba(0, 0, 0, 0.05)" },
  sm: { value: "0 1px 3px 0 rgba(0, 0, 0, 0.10), 0 1px 2px -1px rgba(0, 0, 0, 0.10)" },
  md: { value: "0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.10)" },
  lg: { value: "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 4px 6px -4px rgba(0, 0, 0, 0.10)" },
  xl: { value: "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 8px 10px -6px rgba(0, 0, 0, 0.10)" },
  "card-dark": { value: "0 4px 24px 0 rgba(0, 0, 0, 0.40)" },
  "card-light": { value: "0 2px 12px 0 rgba(17, 25, 38, 0.08)" },
  none: { value: "none" },
} as const;
