/**
 * MedixDeck Brand Color Tokens
 * These are raw (primitive) color values from the MedixDeck style guide.
 * Use semanticTokens to assign meaning (light/dark mode).
 */
export const colorTokens = {
  // ─── Brand Blue scale ──────────────────────────────────────────────────────
  blue: {
    50: { value: "#E8F3FF" },
    100: { value: "#D6EEFF" },   // Primary Tint / Sky
    200: { value: "#A8D4FF" },
    300: { value: "#70B6FF" },
    400: { value: "#3D98FF" },
    500: { value: "#0685FF" },   // Primary Blue ★
    600: { value: "#0066CC" },
    700: { value: "#004D99" },
    800: { value: "#003366" },
    900: { value: "#001A33" },
    gradient: { value: "#1A8FFF" }, // Gradient Blue
  },

  // ─── Secondary Purple scale ────────────────────────────────────────────────
  purple: {
    50: { value: "#F9F0FF" },
    100: { value: "#EDD6FF" },   // Secondary Tint / Lavender ★
    200: { value: "#D9AAFF" },
    300: { value: "#BB77FF" },
    400: { value: "#9933FF" },
    500: { value: "#7700CC" },   // Brand Purple ★
    600: { value: "#5C00A3" },
    700: { value: "#44007A" },
    800: { value: "#2D0052" },
    900: { value: "#160029" },
  },

  // ─── Neutral / Light Mode ──────────────────────────────────────────────────
  neutralLight: {
    bg: { value: "#FEFEFE" },       // Page Background ★
    bg2: { value: "#F6F6F6" },      // Background 2 ★
    surface: { value: "#F6F6F6" },  // Card / Surface ★
    white: { value: "#FFFFFF" },    // Universal White
    border: { value: "#E4E8F0" },   // Border
    muted: { value: "#9AAAB8" },    // Muted text
    heading: { value: "#111926" },  // Heading ★
    body: { value: "#3D4F63" },     // Body text ★
  },

  // ─── Neutral / Dark Mode ──────────────────────────────────────────────────
  neutralDark: {
    bg: { value: "#0A1220" },       // Page Background (dark) ★
    bg2: { value: "#182337" },      // Background 2 (dark) ★
    surface: { value: "#152035" },  // Card / Surface (dark) ★
    black: { value: "#000000" },    // Universal Black
    border: { value: "#1E3050" },   // Dark Border
    muted: { value: "#4A6480" },    // Dark Muted
    heading: { value: "#F0F6FF" },  // Dark Heading
    body: { value: "#ABC0D6" },     // Dark Body text
  },

  // ─── Status Colors ────────────────────────────────────────────────────────
  green: {
    50: { value: "#F0FDF4" },
    100: { value: "#DCFCE7" },   // Green tint ★
    500: { value: "#1B7A38" },   // Green ★
    600: { value: "#166534" },
  },
  amber: {
    50: { value: "#FFFBEB" },
    100: { value: "#FEF3C7" },   // Amber tint ★
    500: { value: "#D97706" },   // Amber ★
    600: { value: "#B45309" },
  },
  red: {
    50: { value: "#FFF1F2" },
    100: { value: "#FFE4E6" },   // Red tint ★
    200: { value: "#FECDD3" },
    500: { value: "#DC2626" },   // Red / Critical ★
    600: { value: "#B91C1C" },
  },
} as const;
