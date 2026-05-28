"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "../primitive/Button";
import { Logo } from "../primitive/Logo";
import { useIsDarkMode } from "../../hooks/useThemeMode";

// ─── Constants ──────────────────────────────────────────────────────────────────

const STORAGE_KEY = "medixdeck_pwa_dismissed";
const DEFAULT_COOLDOWN_DAYS = 14;

const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];
const EASE_IN_OUT = [0.4, 0.0, 0.2, 1.0] as [number, number, number, number];

// ─── Types ──────────────────────────────────────────────────────────────────────

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

export interface PWAInstallPromptProps {
  /** Title of the install banner. */
  title?: string;
  /** Body message explaining why the user should install. */
  description?: string;
  /** Label for the install button. */
  installLabel?: string;
  /** Label for the dismiss button. */
  dismissLabel?: string;
  /** Number of days to suppress the prompt after dismissal. @default 14 */
  cooldownDays?: number;
  /** Callback fired when the user accepts the install. */
  onInstall?: () => void;
  /** Callback fired when the user dismisses the prompt. */
  onDismiss?: () => void;
  /**
   * The app name used in iOS instructions (e.g. "MedixDeck").
   * @default "this app"
   */
  appName?: string;
  /**
   * Custom icon element (e.g. a `<Logo />` or an `<img />`).
   * When omitted, a default app icon is rendered.
   */
  icon?: React.ReactNode;
  /**
   * Position of the banner on screen.
   * @default "bottom"
   */
  position?: "top" | "bottom";
  /**
   * Number of seconds to delay the prompt after the conditions are met.
   * @default 0
   */
  delaySeconds?: number;
  /**
   * For documentation/storybook purposes. Forces the banner to be visible.
   */
  forceVisible?: boolean;
  /**
   * For documentation/storybook purposes. Forces the iOS rendering mode.
   */
  forceIOS?: boolean;
}

// ─── Helpers ────────────────────────────────────────────────────────────────────

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  const standaloneQuery = window.matchMedia("(display-mode: standalone)").matches;
  const iosStandalone = (window.navigator as any).standalone === true;
  return standaloneQuery || iosStandalone;
}

function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

function isDismissedRecently(cooldownDays: number): boolean {
  if (typeof localStorage === "undefined") return false;
  try {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) return false;
    const cooldownMs = cooldownDays * 24 * 60 * 60 * 1000;
    return Date.now() - Number(dismissed) < cooldownMs;
  } catch {
    return false;
  }
}

function saveDismissal(): void {
  try {
    localStorage.setItem(STORAGE_KEY, String(Date.now()));
  } catch {
    // localStorage not available — silently ignore
  }
}

// ─── iOS Share Icon ─────────────────────────────────────────────────────────────

function IOSShareIcon({ size = 18, color = "#0685FF" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" y1="2" x2="12" y2="15" />
    </svg>
  );
}

// ─── Default App Icon ───────────────────────────────────────────────────────────

function DefaultAppIcon() {
  return (
    <Box flexShrink={0}>
      <Logo type="icon" height={44} />
    </Box>
  );
}

// ─── Component ──────────────────────────────────────────────────────────────────

/**
 * MedixDeck PWAInstallPrompt
 *
 * A cross-platform Progressive Web App install nudge that handles both
 * Android/Chromium (via `beforeinstallprompt`) and iOS Safari (manual
 * "Add to Home Screen" instructions).
 *
 * Features:
 * - Respects user dismissals with a configurable cooldown (default 14 days)
 * - Auto-hides when the app is already in standalone / installed mode
 * - Smooth entrance / exit animations via Framer Motion
 * - Fully themed with MedixDeck design tokens
 *
 * @example
 * ```tsx
 * <PWAInstallPrompt
 *   appName="MedixDeck"
 *   title="Install MedixDeck"
 *   description="Get faster access and offline support."
 *   delaySeconds={5}
 * />
 * ```
 */
export function PWAInstallPrompt({
  title = "Install this app",
  description = "Add this app to your home screen for faster access and a better experience.",
  installLabel = "Install",
  dismissLabel = "Not now",
  cooldownDays = DEFAULT_COOLDOWN_DAYS,
  onInstall,
  onDismiss,
  appName = "this app",
  icon,
  position = "bottom",
  delaySeconds = 0,
  forceVisible,
  forceIOS,
}: PWAInstallPromptProps) {
  const isDark = useIsDarkMode();
  const [visible, setVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Initialisation ──────────────────────────────────────────────────────────
  useEffect(() => {
    const showPrompt = () => {
      if (delaySeconds > 0) {
        timeoutRef.current = setTimeout(() => setVisible(true), delaySeconds * 1000);
      } else {
        setVisible(true);
      }
    };

    const cleanupTimeout = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };

    if (forceVisible) {
      if (forceIOS) setIsIOS(true);
      showPrompt();
      return cleanupTimeout;
    }

    // Already installed — never show
    if (isInStandaloneMode()) return cleanupTimeout;

    // User recently dismissed — respect cooldown
    if (isDismissedRecently(cooldownDays)) return cleanupTimeout;

    // iOS path
    if (isIOSDevice()) {
      setIsIOS(true);
      showPrompt();
      return cleanupTimeout;
    }

    // Chromium-based browsers (Desktop Chrome, Edge, Opera, Brave + Android)
    // The beforeinstallprompt event fires on all Chromium-based browsers.
    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      showPrompt();
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Also listen for the install completion to auto-hide
    const installed = () => setVisible(false);
    window.addEventListener("appinstalled", installed);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installed);
      cleanupTimeout();
    };
  }, [cooldownDays, delaySeconds, forceVisible, forceIOS]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const handleInstall = useCallback(async () => {
    if (deferredPromptRef.current) {
      try {
        await deferredPromptRef.current.prompt();
        const choice = await deferredPromptRef.current.userChoice;
        if (choice.outcome === "accepted") {
          onInstall?.();
        }
      } catch {
        // prompt() failed — some browsers throw on double-invoke
      }
      deferredPromptRef.current = null;
    }
    setVisible(false);
  }, [onInstall]);

  const handleDismiss = useCallback(() => {
    saveDismissal();
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  // ── Theme colours (exact hex, same pattern as CookieConsentBanner) ──────────
  const bgColor = isDark ? "#152035" : "#FFFFFF";
  const borderColor = isDark ? "#1E3050" : "#E4E8F0";
  const shadowColor = isDark ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.08)";

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: position === "bottom" ? 80 : -80, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: position === "bottom" ? 80 : -80, x: "-50%" }}
          transition={{ duration: 0.35, ease: EASE_IN_OUT }}
          style={{
            position: "fixed",
            [position]: 16,
            left: "50%",
            zIndex: 10000,
            width: "calc(100% - 32px)",
            maxWidth: 480,
            pointerEvents: "auto",
          }}
        >
          <Box
            borderRadius="16px"
            p={{ base: "4", md: "5" }}
            style={{
              background: bgColor,
              border: `1px solid ${borderColor}`,
              boxShadow: `0 8px 32px ${shadowColor}`,
            }}
          >
            <Flex gap="4" align="flex-start">
              {/* Icon */}
              {icon ?? <DefaultAppIcon />}

              {/* Content */}
              <Box flex="1" minW="0">
                <Text
                  fontWeight="700"
                  fontSize="md"
                  color="text.heading"
                  fontFamily="var(--font-heading)"
                  mb="1"
                >
                  {title}
                </Text>

                {isIOS ? (
                  <Box>
                    <Text fontSize="sm" color="text.muted" lineHeight="1.5" fontFamily="var(--font-body)" mb="3">
                      To install {appName}, tap the{" "}
                      <span style={{ display: "inline-flex", verticalAlign: "middle", margin: "0 2px" }}>
                        <IOSShareIcon size={16} color={isDark ? "#70B6FF" : "#0685FF"} />
                      </span>{" "}
                      Share button in Safari, then select{" "}
                      <span style={{ fontWeight: 700, color: isDark ? "#F0F6FF" : "#111926" }}>
                        "Add to Home Screen"
                      </span>.
                    </Text>

                    {/* Step indicators */}
                    <Flex gap="3" mb="3" flexWrap="wrap">
                      {[
                        { step: "1", text: "Tap Share" },
                        { step: "2", text: "Add to Home Screen" },
                      ].map((item) => (
                        <Flex
                          key={item.step}
                          align="center"
                          gap="2"
                          px="3"
                          py="1.5"
                          borderRadius="8px"
                          bg="bg.subtle"
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                            w="20px"
                            h="20px"
                            borderRadius="full"
                            flexShrink={0}
                            style={{
                              background: isDark ? "#0685FF" : "#0685FF",
                              color: "#FFFFFF",
                              fontSize: "11px",
                              fontWeight: 700,
                              fontFamily: "var(--font-body)",
                            }}
                          >
                            {item.step}
                          </Box>
                          <Text fontSize="xs" fontWeight="600" color="text.body" fontFamily="var(--font-body)">
                            {item.text}
                          </Text>
                        </Flex>
                      ))}
                    </Flex>
                  </Box>
                ) : (
                  <Text fontSize="sm" color="text.muted" lineHeight="1.5" fontFamily="var(--font-body)" mb="3">
                    {description}
                  </Text>
                )}

                {/* Buttons */}
                <Flex gap="3" align="center">
                  {!isIOS && (
                    <Button
                      variant="solid"
                      colorScheme="blue"
                      size="sm"
                      onClick={handleInstall}
                    >
                      {installLabel}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    colorScheme="gray"
                    size="sm"
                    onClick={handleDismiss}
                  >
                    {isIOS ? "Got it" : dismissLabel}
                  </Button>
                </Flex>
              </Box>

              {/* Close X button */}
              <Box
                as="button"
                aria-label="Close install prompt"
                onClick={handleDismiss}
                display="flex"
                alignItems="center"
                justifyContent="center"
                w="28px"
                h="28px"
                borderRadius="full"
                bg="bg.subtle"
                color="text.muted"
                flexShrink={0}
                cursor="pointer"
                _hover={{ color: "text.heading", bg: "bg.surface" }}
                style={{ border: "none", transition: "all 0.2s ease" }}
                mt="-1"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </Box>
            </Flex>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

PWAInstallPrompt.displayName = "MedixPWAInstallPrompt";
