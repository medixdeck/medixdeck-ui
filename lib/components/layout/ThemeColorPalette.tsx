import React from 'react';
import { Box, SimpleGrid, Text, type BoxProps } from '@chakra-ui/react';
import { colorTokens } from '../../theme/colors';

type PreviewMode = 'light' | 'dark';
type PreviewKind = 'fill' | 'text' | 'border';
type TokenScale = Readonly<Record<string, { value: string }>>;

interface SemanticTokenPreview {
  token: string;
  description: string;
  preview: PreviewKind;
  light: string;
  dark: string;
}

interface PrimitiveTokenPreview {
  token: string;
  value: string;
}

interface TokenGroup<TToken> {
  title: string;
  description: string;
  tokens: TToken[];
}

const previewModes: PreviewMode[] = ['light', 'dark'];

const modeSurfaces = {
  light: {
    label: 'Light mode',
    canvas: colorTokens.neutralLight.bg.value,
    surface: colorTokens.neutralLight.surface.value,
    border: colorTokens.neutralLight.border.value,
    text: colorTokens.neutralLight.heading.value,
    muted: colorTokens.neutralLight.body.value,
  },
  dark: {
    label: 'Dark mode',
    canvas: colorTokens.neutralDark.bg.value,
    surface: colorTokens.neutralDark.surface.value,
    border: colorTokens.neutralDark.border.value,
    text: colorTokens.neutralDark.heading.value,
    muted: colorTokens.neutralDark.body.value,
  },
} as const;

function buildScaleTokens(prefix: string, scale: TokenScale): PrimitiveTokenPreview[] {
  return Object.entries(scale).map(([step, value]) => ({
    token: `${prefix}.${step}`,
    value: value.value,
  }));
}

const semanticColorGroups: TokenGroup<SemanticTokenPreview>[] = [
  {
    title: 'Foundation semantics',
    description:
      'Core app backgrounds, text, borders, and brand tokens that shift with light and dark mode.',
    tokens: [
      {
        token: 'bg',
        description: 'Page background',
        preview: 'fill',
        light: colorTokens.neutralLight.bg.value,
        dark: colorTokens.neutralDark.bg.value,
      },
      {
        token: 'bg.subtle',
        description: 'Subtle background',
        preview: 'fill',
        light: colorTokens.neutralLight.bg2.value,
        dark: colorTokens.neutralDark.bg2.value,
      },
      {
        token: 'bg.surface',
        description: 'Surface and card background',
        preview: 'fill',
        light: colorTokens.neutralLight.surface.value,
        dark: colorTokens.neutralDark.surface.value,
      },
      {
        token: 'text.heading',
        description: 'Primary heading text',
        preview: 'text',
        light: colorTokens.neutralLight.heading.value,
        dark: colorTokens.neutralDark.heading.value,
      },
      {
        token: 'text.body',
        description: 'Default body text',
        preview: 'text',
        light: colorTokens.neutralLight.body.value,
        dark: colorTokens.neutralDark.body.value,
      },
      {
        token: 'text.muted',
        description: 'Muted helper text',
        preview: 'text',
        light: colorTokens.neutralLight.muted.value,
        dark: colorTokens.neutralDark.muted.value,
      },
      {
        token: 'border',
        description: 'Default border color',
        preview: 'border',
        light: colorTokens.neutralLight.border.value,
        dark: colorTokens.neutralDark.border.value,
      },
      {
        token: 'brand.solid',
        description: 'Primary accent fill',
        preview: 'fill',
        light: colorTokens.blue[500].value,
        dark: colorTokens.blue[500].value,
      },
      {
        token: 'brand.muted',
        description: 'Muted brand accent',
        preview: 'fill',
        light: colorTokens.blue[100].value,
        dark: colorTokens.blue[900].value,
      },
      {
        token: 'brand.contrast',
        description: 'High-contrast brand foreground',
        preview: 'fill',
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
    ],
  },
  {
    title: 'Status semantics',
    description: 'System feedback colors used for success, warning, and error states.',
    tokens: [
      {
        token: 'status.success',
        description: 'Success foreground',
        preview: 'fill',
        light: colorTokens.green[500].value,
        dark: colorTokens.green[500].value,
      },
      {
        token: 'status.success.tint',
        description: 'Success tint background',
        preview: 'fill',
        light: colorTokens.green[100].value,
        dark: 'rgba(27, 122, 56, 0.2)',
      },
      {
        token: 'status.warning',
        description: 'Warning foreground',
        preview: 'fill',
        light: colorTokens.amber[500].value,
        dark: colorTokens.amber[500].value,
      },
      {
        token: 'status.warning.tint',
        description: 'Warning tint background',
        preview: 'fill',
        light: colorTokens.amber[100].value,
        dark: 'rgba(217, 119, 6, 0.2)',
      },
      {
        token: 'status.error',
        description: 'Error foreground',
        preview: 'fill',
        light: colorTokens.red[500].value,
        dark: colorTokens.red[500].value,
      },
      {
        token: 'status.error.tint',
        description: 'Error tint background',
        preview: 'fill',
        light: colorTokens.red[100].value,
        dark: 'rgba(220, 38, 38, 0.2)',
      },
    ],
  },
  {
    title: 'Blue semantic palette',
    description: 'Semantic blue scale and utility tokens used by Chakra-aware theme props.',
    tokens: [
      {
        token: 'blue.50',
        description: 'Blue scale 50',
        preview: 'fill',
        light: colorTokens.blue[50].value,
        dark: colorTokens.blue[50].value,
      },
      {
        token: 'blue.100',
        description: 'Blue scale 100',
        preview: 'fill',
        light: colorTokens.blue[100].value,
        dark: colorTokens.blue[100].value,
      },
      {
        token: 'blue.200',
        description: 'Blue scale 200',
        preview: 'fill',
        light: colorTokens.blue[200].value,
        dark: colorTokens.blue[200].value,
      },
      {
        token: 'blue.300',
        description: 'Blue scale 300',
        preview: 'fill',
        light: colorTokens.blue[300].value,
        dark: colorTokens.blue[300].value,
      },
      {
        token: 'blue.400',
        description: 'Blue scale 400',
        preview: 'fill',
        light: colorTokens.blue[400].value,
        dark: colorTokens.blue[400].value,
      },
      {
        token: 'blue.500',
        description: 'Blue scale 500',
        preview: 'fill',
        light: colorTokens.blue[500].value,
        dark: colorTokens.blue[500].value,
      },
      {
        token: 'blue.600',
        description: 'Blue scale 600',
        preview: 'fill',
        light: colorTokens.blue[600].value,
        dark: colorTokens.blue[600].value,
      },
      {
        token: 'blue.700',
        description: 'Blue scale 700',
        preview: 'fill',
        light: colorTokens.blue[700].value,
        dark: colorTokens.blue[700].value,
      },
      {
        token: 'blue.800',
        description: 'Blue scale 800',
        preview: 'fill',
        light: colorTokens.blue[800].value,
        dark: colorTokens.blue[800].value,
      },
      {
        token: 'blue.900',
        description: 'Blue scale 900',
        preview: 'fill',
        light: colorTokens.blue[900].value,
        dark: colorTokens.blue[900].value,
      },
      {
        token: 'blue.solid',
        description: 'Default solid blue accent',
        preview: 'fill',
        light: colorTokens.blue[500].value,
        dark: colorTokens.blue[500].value,
      },
      {
        token: 'blue.contrast',
        description: 'High-contrast content on blue',
        preview: 'fill',
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      {
        token: 'blue.muted',
        description: 'Muted blue background',
        preview: 'fill',
        light: colorTokens.blue[100].value,
        dark: colorTokens.blue[900].value,
      },
      {
        token: 'blue.subtle',
        description: 'Subtle blue background',
        preview: 'fill',
        light: colorTokens.blue[50].value,
        dark: 'rgba(6, 133, 255, 0.1)',
      },
      {
        token: 'blue.emphasized',
        description: 'Emphasized blue background',
        preview: 'fill',
        light: colorTokens.blue[100].value,
        dark: colorTokens.blue[800].value,
      },
      {
        token: 'blue.fg',
        description: 'Readable blue foreground',
        preview: 'text',
        light: colorTokens.blue[700].value,
        dark: colorTokens.blue[300].value,
      },
      {
        token: 'blue.focusRing',
        description: 'Blue focus ring',
        preview: 'border',
        light: colorTokens.blue[500].value,
        dark: colorTokens.blue[500].value,
      },
    ],
  },
  {
    title: 'Purple semantic palette',
    description: 'Semantic purple scale and utility tokens used by Chakra-aware theme props.',
    tokens: [
      {
        token: 'purple.50',
        description: 'Purple scale 50',
        preview: 'fill',
        light: colorTokens.purple[50].value,
        dark: colorTokens.purple[50].value,
      },
      {
        token: 'purple.100',
        description: 'Purple scale 100',
        preview: 'fill',
        light: colorTokens.purple[100].value,
        dark: colorTokens.purple[100].value,
      },
      {
        token: 'purple.500',
        description: 'Purple scale 500',
        preview: 'fill',
        light: colorTokens.purple[500].value,
        dark: colorTokens.purple[500].value,
      },
      {
        token: 'purple.600',
        description: 'Purple scale 600',
        preview: 'fill',
        light: colorTokens.purple[600].value,
        dark: colorTokens.purple[600].value,
      },
      {
        token: 'purple.solid',
        description: 'Default solid purple accent',
        preview: 'fill',
        light: colorTokens.purple[500].value,
        dark: colorTokens.purple[500].value,
      },
      {
        token: 'purple.contrast',
        description: 'High-contrast content on purple',
        preview: 'fill',
        light: '#FFFFFF',
        dark: '#FFFFFF',
      },
      {
        token: 'purple.muted',
        description: 'Muted purple background',
        preview: 'fill',
        light: colorTokens.purple[100].value,
        dark: colorTokens.purple[900].value,
      },
      {
        token: 'purple.subtle',
        description: 'Subtle purple background',
        preview: 'fill',
        light: colorTokens.purple[50].value,
        dark: 'rgba(119, 0, 204, 0.1)',
      },
      {
        token: 'purple.emphasized',
        description: 'Emphasized purple background',
        preview: 'fill',
        light: colorTokens.purple[100].value,
        dark: colorTokens.purple[100].value,
      },
      {
        token: 'purple.fg',
        description: 'Readable purple foreground',
        preview: 'text',
        light: colorTokens.purple[700].value,
        dark: colorTokens.purple[300].value,
      },
      {
        token: 'purple.focusRing',
        description: 'Purple focus ring',
        preview: 'border',
        light: colorTokens.purple[500].value,
        dark: colorTokens.purple[500].value,
      },
    ],
  },
];

const primitiveColorGroups: TokenGroup<PrimitiveTokenPreview>[] = [
  {
    title: 'Brand blue tokens',
    description: 'Raw MedixDeck primary blue scale.',
    tokens: buildScaleTokens('brand.blue', colorTokens.blue),
  },
  {
    title: 'Brand purple tokens',
    description: 'Raw MedixDeck secondary purple scale.',
    tokens: buildScaleTokens('brand.purple', colorTokens.purple),
  },
  {
    title: 'Status green tokens',
    description: 'Raw success scale tokens.',
    tokens: buildScaleTokens('brand.green', colorTokens.green),
  },
  {
    title: 'Status amber tokens',
    description: 'Raw warning scale tokens.',
    tokens: buildScaleTokens('brand.amber', colorTokens.amber),
  },
  {
    title: 'Status red tokens',
    description: 'Raw error scale tokens.',
    tokens: buildScaleTokens('brand.red', colorTokens.red),
  },
  {
    title: 'Neutral light tokens',
    description: 'Raw light-mode neutrals.',
    tokens: buildScaleTokens('brand.neutralLight', colorTokens.neutralLight),
  },
  {
    title: 'Neutral dark tokens',
    description: 'Raw dark-mode neutrals.',
    tokens: buildScaleTokens('brand.neutralDark', colorTokens.neutralDark),
  },
];

function SemanticPreview({ mode, token }: { mode: PreviewMode; token: SemanticTokenPreview }) {
  const surface = modeSurfaces[mode];
  const value = mode === 'light' ? token.light : token.dark;
  const sharedPanelStyles = {
    minH: '88px',
    borderRadius: 'md',
    border: '1px solid',
    borderColor: surface.border,
    bg: surface.canvas,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    px: '4',
  } as const;

  return (
    <Box
      border="1px solid"
      borderColor={surface.border}
      borderRadius="lg"
      bg={surface.surface}
      p="3"
    >
      <Text
        fontSize="xs"
        fontWeight="600"
        color={surface.text}
        fontFamily="var(--font-heading)"
        mb="2"
      >
        {surface.label}
      </Text>
      {token.preview === 'text' ? (
        <Box {...sharedPanelStyles}>
          <Text color={value} fontSize="sm" fontWeight="600" fontFamily="var(--font-heading)">
            Aa MedixDeck
          </Text>
        </Box>
      ) : token.preview === 'border' ? (
        <Box {...sharedPanelStyles}>
          <Box
            w="100%"
            maxW="140px"
            h="48px"
            borderRadius="md"
            border="2px solid"
            borderColor={value}
            bg={surface.canvas}
          />
        </Box>
      ) : (
        <Box
          {...sharedPanelStyles}
          bg={value}
          borderColor={
            value === surface.canvas
              ? surface.border
              : value === '#FFFFFF'
                ? surface.border
                : 'transparent'
          }
        />
      )}
      <Text mt="2" fontSize="xs" color={surface.muted} fontFamily="var(--font-mono)">
        {value}
      </Text>
    </Box>
  );
}

/**
 * MedixDeck ThemeColorPalette
 *
 * Visual reference for the library's semantic tokens and raw color scales.
 *
 * @example
 * ```tsx
 * <ThemeColorPalette />
 * ```
 */
export const ThemeColorPalette = React.forwardRef<HTMLDivElement, ThemeColorPaletteProps>(
  ({ showSemanticTokens = true, showPrimitiveTokens = true, ...props }, ref) => {
    return (
      <Box ref={ref} display="flex" flexDirection="column" gap="8" {...props}>
        <Box>
          <Text fontSize="sm" color="text.body" fontFamily="var(--font-body)" maxW="4xl">
            Browse the full MedixDeck color system in one place. Semantic tokens are rendered side
            by side for light and dark mode, while raw palettes expose every underlying brand and
            status scale used by the theme.
          </Text>
        </Box>

        {showSemanticTokens && (
          <Box display="flex" flexDirection="column" gap="6">
            {semanticColorGroups.map((group) => (
              <Box key={group.title}>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color="text.heading"
                  fontFamily="var(--font-heading)"
                >
                  {group.title}
                </Text>
                <Text mt="1" fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                  {group.description}
                </Text>
                <SimpleGrid columns={{ base: 1, xl: 2 }} gap="4" mt="4">
                  {group.tokens.map((token) => (
                    <Box
                      key={token.token}
                      border="1px solid"
                      borderColor="border"
                      borderRadius="xl"
                      bg="bg.surface"
                      p="4"
                    >
                      <Text
                        fontSize="sm"
                        fontWeight="700"
                        color="text.heading"
                        fontFamily="var(--font-heading)"
                      >
                        {token.token}
                      </Text>
                      <Text mt="1" fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                        {token.description}
                      </Text>
                      <SimpleGrid columns={{ base: 1, md: 2 }} gap="3" mt="4">
                        {previewModes.map((mode) => (
                          <SemanticPreview
                            key={`${token.token}-${mode}`}
                            mode={mode}
                            token={token}
                          />
                        ))}
                      </SimpleGrid>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        )}

        {showPrimitiveTokens && (
          <Box display="flex" flexDirection="column" gap="6">
            {primitiveColorGroups.map((group) => (
              <Box key={group.title}>
                <Text
                  fontSize="lg"
                  fontWeight="600"
                  color="text.heading"
                  fontFamily="var(--font-heading)"
                >
                  {group.title}
                </Text>
                <Text mt="1" fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
                  {group.description}
                </Text>
                <SimpleGrid columns={{ base: 1, sm: 2, lg: 3, xl: 4 }} gap="4" mt="4">
                  {group.tokens.map((token) => (
                    <Box
                      key={token.token}
                      border="1px solid"
                      borderColor="border"
                      borderRadius="xl"
                      overflow="hidden"
                      bg="bg.surface"
                    >
                      <Box
                        h="72px"
                        bg={token.value}
                        borderBottom="1px solid"
                        borderColor={
                          token.value === '#FFFFFF' ||
                          token.value === colorTokens.neutralLight.bg.value
                            ? 'border'
                            : 'transparent'
                        }
                      />
                      <Box p="4">
                        <Text
                          fontSize="sm"
                          fontWeight="600"
                          color="text.heading"
                          fontFamily="var(--font-heading)"
                        >
                          {token.token}
                        </Text>
                        <Text mt="1" fontSize="xs" color="text.muted" fontFamily="var(--font-mono)">
                          {token.value}
                        </Text>
                      </Box>
                    </Box>
                  ))}
                </SimpleGrid>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    );
  },
);

export interface ThemeColorPaletteProps extends Omit<BoxProps, 'children'> {
  /** Show the semantic token groups with light and dark comparisons. */
  showSemanticTokens?: boolean;
  /** Show the raw brand, status, and neutral token scales. */
  showPrimitiveTokens?: boolean;
}

ThemeColorPalette.displayName = 'MedixThemeColorPalette';
