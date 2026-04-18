import { createSystem, defaultConfig, defineConfig, type SystemStyleObject } from "@chakra-ui/react";
import { colorTokens } from "./colors";
import { typographyTokens, textStyleTokens } from "./typography";
import { spacingTokens, radiiTokens, shadowTokens } from "./spacing";

// Note: Satoshi font is loaded in the HTML <head> via Fontshare CDN link tag.

const medixConfig = defineConfig({
  globalCss: {
    "html, body": {
      fontFamily: "var(--font-body)",
    } as SystemStyleObject,
    "*": {
      boxSizing: "border-box",
    } as SystemStyleObject,
  },

  theme: {
    tokens: {
      colors: {
        brand: {
          blue: colorTokens.blue,
          purple: colorTokens.purple,
          green: colorTokens.green,
          amber: colorTokens.amber,
          red: colorTokens.red,
          neutralLight: colorTokens.neutralLight,
          neutralDark: colorTokens.neutralDark,
        },
      },

      fonts: typographyTokens.fonts,
      fontSizes: typographyTokens.fontSizes,
      fontWeights: typographyTokens.fontWeights,
      lineHeights: typographyTokens.lineHeights,
      letterSpacings: typographyTokens.letterSpacings,

      spacing: spacingTokens,
      radii: radiiTokens,
      shadows: shadowTokens,
    },

    semanticTokens: {
      colors: {
        "brand.solid": {
          value: { base: "{colors.brand.blue.500}", _dark: "{colors.brand.blue.500}" },
        },
        "brand.muted": {
          value: { base: "{colors.brand.blue.100}", _dark: "{colors.brand.blue.900}" },
        },
        "brand.contrast": {
          value: { base: "#FFFFFF", _dark: "#FFFFFF" },
        },
        bg: {
          value: {
            base: "{colors.brand.neutralLight.bg}",
            _dark: "{colors.brand.neutralDark.bg}",
          },
        },
        "bg.subtle": {
          value: {
            base: "{colors.brand.neutralLight.bg2}",
            _dark: "{colors.brand.neutralDark.bg2}",
          },
        },
        "bg.surface": {
          value: {
            base: "{colors.brand.neutralLight.surface}",
            _dark: "{colors.brand.neutralDark.surface}",
          },
        },
        "text.heading": {
          value: {
            base: "{colors.brand.neutralLight.heading}",
            _dark: "{colors.brand.neutralDark.heading}",
          },
        },
        "text.body": {
          value: {
            base: "{colors.brand.neutralLight.body}",
            _dark: "{colors.brand.neutralDark.body}",
          },
        },
        "text.muted": {
          value: {
            base: "{colors.brand.neutralLight.muted}",
            _dark: "{colors.brand.neutralDark.muted}",
          },
        },
        border: {
          value: {
            base: "{colors.brand.neutralLight.border}",
            _dark: "{colors.brand.neutralDark.border}",
          },
        },
        "status.success": {
          value: { base: "{colors.brand.green.500}", _dark: "{colors.brand.green.500}" },
        },
        "status.success.tint": {
          value: { base: "{colors.brand.green.100}", _dark: "rgba(27, 122, 56, 0.2)" },
        },
        "status.warning": {
          value: { base: "{colors.brand.amber.500}", _dark: "{colors.brand.amber.500}" },
        },
        "status.warning.tint": {
          value: { base: "{colors.brand.amber.100}", _dark: "rgba(217, 119, 6, 0.2)" },
        },
        "status.error": {
          value: { base: "{colors.brand.red.500}", _dark: "{colors.brand.red.500}" },
        },
        "status.error.tint": {
          value: { base: "{colors.brand.red.100}", _dark: "rgba(220, 38, 38, 0.2)" },
        },
        blue: {
          50: { value: { base: "{colors.brand.blue.50}" } },
          100: { value: { base: "{colors.brand.blue.100}" } },
          200: { value: { base: "{colors.brand.blue.200}" } },
          300: { value: { base: "{colors.brand.blue.300}" } },
          400: { value: { base: "{colors.brand.blue.400}" } },
          500: { value: { base: "{colors.brand.blue.500}" } },
          600: { value: { base: "{colors.brand.blue.600}" } },
          700: { value: { base: "{colors.brand.blue.700}" } },
          800: { value: { base: "{colors.brand.blue.800}" } },
          900: { value: { base: "{colors.brand.blue.900}" } },
          solid: { value: { base: "{colors.brand.blue.500}" } },
          contrast: { value: { base: "#FFFFFF" } },
          muted: { value: { base: "{colors.brand.blue.100}", _dark: "{colors.brand.blue.900}" } },
          subtle: { value: { base: "{colors.brand.blue.50}", _dark: "rgba(6, 133, 255, 0.1)" } },
          emphasized: { value: { base: "{colors.brand.blue.100}", _dark: "{colors.brand.blue.800}" } },
          fg: { value: { base: "{colors.brand.blue.700}", _dark: "{colors.brand.blue.300}" } },
          focusRing: { value: { base: "{colors.brand.blue.500}" } },
        },
        purple: {
          50: { value: { base: "{colors.brand.purple.50}" } },
          100: { value: { base: "{colors.brand.purple.100}" } },
          500: { value: { base: "{colors.brand.purple.500}" } },
          600: { value: { base: "{colors.brand.purple.600}" } },
          solid: { value: { base: "{colors.brand.purple.500}" } },
          contrast: { value: { base: "#FFFFFF" } },
          muted: { value: { base: "{colors.brand.purple.100}", _dark: "{colors.brand.purple.900}" } },
          subtle: { value: { base: "{colors.brand.purple.50}", _dark: "rgba(119, 0, 204, 0.1)" } },
          emphasized: { value: { base: "{colors.brand.purple.100}" } },
          fg: { value: { base: "{colors.brand.purple.700}", _dark: "{colors.brand.purple.300}" } },
          focusRing: { value: { base: "{colors.brand.purple.500}" } },
        },
      },
    },

    textStyles: textStyleTokens,
  },
});

export const system = createSystem(defaultConfig, medixConfig);
export { medixConfig };
