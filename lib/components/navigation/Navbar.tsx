"use client";

import React from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Button } from "../primitive/Button";
import { Logo } from "../primitive/Logo";

// ─── Bezier easing presets (Framer Motion v12 requires tuples, not strings) ───
const EASE_OUT    = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];
const EASE_IN     = [0.4, 0.0, 1.0, 1.0] as [number, number, number, number];
const EASE_SPRING = [0.22, 1,  0.36, 1]  as [number, number, number, number];

// ─── Framer Motion variants ───────────────────────────────────────────────────

/** Mobile menu panel — slides down from the navbar edge */
const menuVariants: Variants = {
  hidden:  { opacity: 0, y: -8,  scaleY: 0.96, transformOrigin: "top" },
  visible: { opacity: 1, y: 0,   scaleY: 1,    transformOrigin: "top", transition: { duration: 0.22, ease: EASE_SPRING } },
  exit:    { opacity: 0, y: -6,  scaleY: 0.97, transformOrigin: "top", transition: { duration: 0.16, ease: EASE_IN } },
};

/** Stagger container for mobile nav links */
const linkListVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

/** Each mobile nav link item */
const linkItemVariants: Variants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0,  transition: { duration: 0.2, ease: EASE_OUT } },
};

/** Mobile CTA buttons — slide + fade up */
const ctaVariants: Variants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.22, ease: EASE_OUT, delay: 0.18 } },
};

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

const HamburgerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#0685FF" />
    <path d="M9.25 10.75H22.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.25 16H22.75"    stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M9.25 21.25H22.75" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="32" height="32" rx="8" fill="#0685FF" />
    <path
      d="M13.8801 16.71L8.93005 21.66L10.3401 23.07L13.1701 20.24L16.0001 17.41L18.1201 19.54L21.6601 23.07L23.0701 21.66L18.1201 16.71L17.4101 16L23.0701 10.34L21.6601 8.92999L16.0001 14.59L10.3401 8.92999L8.93005 10.34L14.5901 16L13.8801 16.71Z"
      fill="white"
    />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
  children?: NavItem[];
}

export interface NavbarProps extends Omit<BoxProps, "children"> {
  /** Logo element. Defaults to `<Logo />` when omitted. */
  logo?: React.ReactNode;

  /** Navigation items to display. */
  navItems?: NavItem[];

  /**
   * Alignment of the navigation items on desktop.
   * @default "center"
   */
  navItemsAlign?: "left" | "center" | "right";

  /**
   * Custom link renderer — lets you integrate React Router, Next.js `<Link>`, etc.
   *
   * @example
   * ```tsx
   * // Next.js
   * renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
   * // React Router
   * renderLink={(item, children) => <RouterLink to={item.href}>{children}</RouterLink>}
   * ```
   */
  renderLink?: (item: NavItem, children: React.ReactNode) => React.ReactNode;

  /**
   * Text shown in the primary CTA button (left of the `[label] [↗]` pair).
   * @default "Get Started"
   */
  ctaLabel?: string;

  /**
   * URL the primary CTA **label button** navigates to.
   * @example ctaHref="/consult"
   */
  ctaHref?: string;

  /**
   * Called when the primary CTA **label button** is clicked.
   * `ctaHref` (if provided) takes effect first; this fires in addition.
   */
  onCtaClick?: () => void;

  /**
   * URL the **↗ icon button** navigates to.
   * Falls back to `ctaHref` when not provided.
   * @example ctaIconHref="https://app.medixdeck.com"
   */
  ctaIconHref?: string;

  /**
   * Called when the **↗ icon button** is clicked.
   * Falls back to `onCtaClick` when not provided.
   */
  onCtaIconClick?: () => void;

  /** Text for the ghost "Sign In" button to the left of the primary CTA. */
  secondaryCtaLabel?: string;

  /** URL for the secondary CTA button. */
  secondaryCtaHref?: string;

  /** Called when the secondary CTA is clicked. */
  onSecondaryCtaClick?: () => void;

  /**
   * Fully replaces the default `[ctaLabel] [↗]` CTA area with any React element.
   * When set, all `cta*` / `secondaryCta*` props are ignored.
   *
   * @example
   * ```tsx
   * ctaSlot={
   *   <Box display="flex" gap="2">
   *     <Button variant="ghost"  colorScheme="blue"   onClick={() => router.push("/login")}>Sign In</Button>
   *     <Button variant="solid"  colorScheme="purple" onClick={() => router.push("/signup")}>Get Started</Button>
   *   </Box>
   * }
   * ```
   */
  ctaSlot?: React.ReactNode;

  /** Pin the navbar to the top of the viewport. */
  isSticky?: boolean;

  /**
   * Visual background treatment.
   * - `"solid"` — uses the surface background token (default)
   * - `"transparent"` — fully transparent (e.g. over a hero image)
   * - `"blur"` — frosted-glass dark overlay
   */
  variant?: "solid" | "transparent" | "blur";
}

// ─── Default link renderer ────────────────────────────────────────────────────

const defaultRenderLink = (item: NavItem, children: React.ReactNode) => (
  <a href={item.href} style={{ textDecoration: "none" }}>
    {children}
  </a>
);

// ─── MaybeLink helper ─────────────────────────────────────────────────────────

function MaybeLink({
  href,
  children,
  target,
  rel,
}: {
  href?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}) {
  if (!href) return <>{children}</>;
  return (
    <a href={href} target={target} rel={rel} style={{ textDecoration: "none", display: "contents" }}>
      {children}
    </a>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MedixDeck Navbar
 *
 * Responsive navigation bar with smooth Framer Motion animations:
 * - Mobile menu slides + fades in/out
 * - Nav links stagger-fade on open
 * - CTA buttons slide up after links
 * - Hamburger ↔ Close icon crossfades
 *
 * ## CTA actions
 *
 * | Prop | Controls |
 * |---|---|
 * | `ctaLabel` + `ctaHref` + `onCtaClick` | Primary label button |
 * | `ctaIconHref` + `onCtaIconClick` | ↗ icon button (falls back to primary values) |
 * | `secondaryCtaLabel` + `secondaryCtaHref` + `onSecondaryCtaClick` | Ghost "Sign In" button |
 * | `ctaSlot` | Replaces the entire CTA area |
 *
 * ## Examples
 *
 * ### Href navigation (Next.js / plain links)
 * ```tsx
 * <Navbar ctaLabel="Talk to a Doctor" ctaHref="/consult" isSticky />
 * ```
 *
 * ### Click-handler (SPA / modal trigger)
 * ```tsx
 * <Navbar ctaLabel="Talk to a Doctor" onCtaClick={() => router.push("/consult")} isSticky />
 * ```
 *
 * ### Different destinations for label vs icon button
 * ```tsx
 * <Navbar
 *   ctaLabel="Talk to a Doctor"
 *   ctaHref="/consult"
 *   ctaIconHref="https://app.medixdeck.com"
 *   onCtaIconClick={() => analytics.track("app_opened")}
 * />
 * ```
 *
 * ### With Sign In secondary CTA
 * ```tsx
 * <Navbar
 *   ctaLabel="Talk to a Doctor" ctaHref="/consult"
 *   secondaryCtaLabel="Sign In"  secondaryCtaHref="/login"
 * />
 * ```
 *
 * ### Custom CTA slot
 * ```tsx
 * <Navbar
 *   ctaSlot={
 *     <Box display="flex" gap="2">
 *       <Button variant="ghost" colorScheme="blue" onClick={() => router.push("/login")}>Sign In</Button>
 *       <Button variant="solid" colorScheme="purple" onClick={() => router.push("/signup")}>Get Started</Button>
 *     </Box>
 *   }
 * />
 * ```
 *
 * ### React Router / Next.js link integration
 * ```tsx
 * <Navbar
 *   renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
 *   navItems={[...]}
 * />
 * ```
 */
export function Navbar({
  logo,
  navItems = [],
  navItemsAlign = "center",
  ctaLabel = "Get Started",
  ctaHref,
  onCtaClick,
  ctaIconHref,
  onCtaIconClick,
  secondaryCtaLabel,
  secondaryCtaHref,
  onSecondaryCtaClick,
  ctaSlot,
  renderLink = defaultRenderLink,
  isSticky = false,
  variant = "solid",
  ...props
}: NavbarProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Icon button falls back to label button values
  const resolvedIconHref    = ctaIconHref    ?? ctaHref;
  const resolvedIconHandler = onCtaIconClick ?? onCtaClick;

  // Background
  const bgStyle: React.CSSProperties =
    variant === "blur"
      ? { background: "rgba(10,18,32,0.85)", backdropFilter: "blur(12px)" }
      : {};

  // ── Default CTA group ───────────────────────────────────────────────────────
  const DefaultCtaGroup = ({ mobile = false }: { mobile?: boolean }) => (
    <Box
      display="flex"
      gap="2"
      alignItems="center"
      flexDirection={mobile ? "column" : "row"}
    >
      {secondaryCtaLabel && (
        <Button
          as={secondaryCtaHref ? "a" : "button"}
          href={secondaryCtaHref}
          variant={mobile ? "outline" : "ghost"}
          colorScheme="blue"
          size={mobile ? "md" : "sm"}
          onClick={() => { onSecondaryCtaClick?.(); if (mobile) setIsOpen(false); }}
          style={mobile ? { width: "100%" } : undefined}
        >
          {secondaryCtaLabel}
        </Button>
      )}
      <Button
        as={ctaHref ? "a" : "button"}
        href={ctaHref}
        variant="solid"
        colorScheme="blue"
        size={mobile ? "md" : "sm"}
        onClick={() => { onCtaClick?.(); if (mobile) setIsOpen(false); }}
        style={mobile ? { width: "100%" } : undefined}
      >
        {ctaLabel}
      </Button>
      {!mobile && (
        <Button
          as={resolvedIconHref ? "a" : "button"}
          href={resolvedIconHref}
          target={resolvedIconHref && resolvedIconHref !== ctaHref ? "_blank" : undefined}
          rel={resolvedIconHref && resolvedIconHref !== ctaHref ? "noopener noreferrer" : undefined}
          variant="solid"
          colorScheme="blue"
          size="sm"
          onClick={resolvedIconHandler}
          aria-label="Open"
          style={{ width: 34, height: 34, padding: 0, borderRadius: 8, flexShrink: 0 }}
        >
          <ArrowIcon />
        </Button>
      )}
    </Box>
  );

  return (
    <Box
      as="nav"
      role="navigation"
      aria-label="Main navigation"
      position={isSticky ? "sticky" : "relative"}
      top={isSticky ? "0" : undefined}
      zIndex={isSticky ? "sticky" : undefined}
      bg={variant === "transparent" ? "transparent" : variant === "blur" ? undefined : "bg"}
      style={bgStyle}
      borderBottom="1px solid"
      borderColor={variant === "transparent" ? "transparent" : "border"}
      transition="background 0.2s ease, border-color 0.2s ease"
      {...props}
    >
      {/* ── Inner container ────────────────────────────────────────────────── */}
      <Box
        maxW="1280px"
        mx="auto"
        px={{ base: "4", md: "6", lg: "8" }}
        h="16"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="8"
      >
        {/* Logo */}
        <Box flexShrink={0}>
          {logo ?? <Logo height={28} />}
        </Box>

        {/* ── Desktop nav links ─────────────────────────────────────────────── */}
        <Box
          as="ul"
          display={{ base: "none", md: "flex" }}
          alignItems="center"
          justifyContent={
            navItemsAlign === "left" ? "flex-start" : navItemsAlign === "right" ? "flex-end" : "center"
          }
          gap="1"
          listStyleType="none"
          m="0"
          p="0"
          flex="1"
        >
          {navItems.map((item) => (
            <Box as="li" key={item.href}>
              {renderLink(
                item,
                <Box
                  as="span"
                  display="block"
                  px="3"
                  py="2"
                  fontSize="sm"
                  fontWeight="medium"
                  fontFamily="var(--font-body)"
                  color={item.isActive ? "blue.500" : "text.body"}
                  borderRadius="md"
                  transition="all 0.15s"
                  _hover={{ color: "blue.500", bg: "blue.50" }}
                  _dark={{ _hover: { bg: "rgba(6,133,255,0.10)" } }}
                  cursor="pointer"
                >
                  {item.label}
                </Box>
              )}
            </Box>
          ))}
        </Box>

        {/* ── Desktop CTA ───────────────────────────────────────────────────── */}
        <Box display={{ base: "none", md: "flex" }} alignItems="center" flexShrink={0}>
          {ctaSlot ?? <DefaultCtaGroup />}
        </Box>

        {/* ── Mobile hamburger / close — animated crossfade ─────────────────── */}
        <Box
          as="button"
          display={{ base: "flex", md: "none" }}
          alignItems="center"
          justifyContent="center"
          border="none"
          bg="transparent"
          p="0"
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          style={{ flexShrink: 0, position: "relative", width: 32, height: 32 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <CloseIcon />
              </motion.span>
            ) : (
              <motion.span
                key="hamburger"
                initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <HamburgerIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </Box>
      </Box>

      {/* ── Mobile menu — animated slide-down panel ───────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            <Box
              display={{ base: "block", md: "none" }}
              bg="bg"
              borderTop="1px solid"
              borderColor="border"
              py="4"
              px="4"
            >
              {/* Staggered nav links */}
              <motion.ul
                variants={linkListVariants}
                initial="hidden"
                animate="visible"
                style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 }}
              >
                {navItems.map((item) => (
                  <motion.li key={item.href} variants={linkItemVariants}>
                    {renderLink(
                      item,
                      <Box
                        as="span"
                        display="block"
                        px="3"
                        py="2.5"
                        fontSize="md"
                        fontWeight="medium"
                        fontFamily="var(--font-body)"
                        color={item.isActive ? "blue.500" : "text.body"}
                        borderRadius="md"
                        _hover={{ color: "blue.500", bg: "bg.subtle" }}
                        cursor="pointer"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Box>
                    )}
                  </motion.li>
                ))}
              </motion.ul>

              {/* Animated CTA area */}
              <motion.div variants={ctaVariants} initial="hidden" animate="visible">
                <Box mt="4">
                  {ctaSlot ?? <DefaultCtaGroup mobile />}
                </Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
