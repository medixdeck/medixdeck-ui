"use client";

import { Box, Link, Text } from "@chakra-ui/react";
import { useThemeMode } from "../lib";
import { Button } from "../lib/components/primitive/Button";
import { Container } from "../lib/components/layout/Container";
import { ThemeColorPalette } from "../lib/components/layout/ThemeColorPalette";
import { Navbar } from "../lib/components/navigation/Navbar";

// @ts-expect-error unknown import error
const STORYBOOK_URL = import.meta.env.VITE_STORYBOOK_URL ?? "http://localhost:6006";

export default function ThemeColorsPage() {
  const { mounted, themeMode, themeSetting, setThemeMode, toggleThemeMode } = useThemeMode();

  return (
    <>
      <Navbar
        navItems={[
          { label: "Preview Home", href: "/" },
          { label: "Theme Colors", href: "/theme-colors" },
        ]}
        ctaLabel="View on GitHub"
        onCtaClick={() => window.open("https://github.com/medixdeck/medixdeck-ui", "_blank")}
        ctaIconHref="https://github.com/medixdeck/medixdeck-ui"
        onCtaIconClick={() => window.open("https://github.com/medixdeck/medixdeck-ui", "_blank")}
        secondaryCtaLabel="Storybook Docs"
        secondaryCtaHref={STORYBOOK_URL}
        onSecondaryCtaClick={() => window.open(STORYBOOK_URL, "_blank")}
        isSticky
      />

      <Box as="main" bg="bg" minH="100vh" pt="6" pb="24" transition="background 0.3s ease">
        <Container maxWidth="xl">
          <Box
            as="header"
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb="8"
            flexWrap="wrap"
            gap="4"
          >
            <Box>
              <Text as="h1" fontSize="3xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                <Link href="https://www.npmjs.com/package/@medixdeck/ui">
                  @medixdeck/ui Theme Colors
                </Link>
              </Text>
              <Text fontSize="md" color="text.muted" mt="1" fontFamily="var(--font-body)">
                Dedicated design-token reference for MedixDeck light and dark mode palettes.
              </Text>
              <Text fontSize="sm" color="text.muted" mt="2" fontFamily="var(--font-body)">
                Theme hooks: resolved <strong>{mounted ? themeMode : "light"}</strong> · preference{" "}
                <strong>{themeSetting}</strong>
              </Text>
            </Box>

            <Box display="flex" gap="3" alignItems="center" flexWrap="wrap">
              <Box display="flex" gap="2" alignItems="center" flexWrap="wrap">
                {(["light", "dark", "system"] as const).map((mode) => (
                  <Box
                    key={mode}
                    as="button"
                    aria-pressed={themeSetting === mode}
                    onClick={() => setThemeMode(mode)}
                    px="3"
                    py="2"
                    bg={themeSetting === mode ? "bg.subtle" : "bg.surface"}
                    color={themeSetting === mode ? "text.heading" : "text.body"}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={themeSetting === mode ? "blue.focusRing" : "border"}
                    fontSize="sm"
                    fontFamily="var(--font-body)"
                    cursor="pointer"
                    textTransform="capitalize"
                    _hover={{ borderColor: "blue.emphasized" }}
                    _focusVisible={{ outline: "2px solid", outlineColor: "blue.focusRing", outlineOffset: "2px" }}
                  >
                    {mode}
                  </Box>
                ))}
              </Box>
              <Button as="a" href="/" variant="outline" colorScheme="blue">
                Back to Preview
              </Button>
              <Box
                as="button"
                onClick={toggleThemeMode}
                px="4"
                py="2"
                bg="brand.solid"
                color="brand.contrast"
                borderRadius="md"
                border="none"
                fontSize="sm"
                fontWeight="medium"
                cursor="pointer"
                fontFamily="var(--font-body)"
                _hover={{ bg: "blue.600" }}
              >
                {themeMode === "light" ? "🌙 Dark" : "☀️ Light"}
              </Box>
            </Box>
          </Box>

          <ThemeColorPalette w="100%" />
        </Container>
      </Box>
    </>
  );
}
