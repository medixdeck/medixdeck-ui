'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, type BoxProps } from '@chakra-ui/react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '../primitive/Button';
import { Logo } from '../primitive/Logo';

// ─── Bezier easing presets (Framer Motion v12 requires tuples, not strings) ───
const EASE_OUT = [0.0, 0.0, 0.2, 1.0] as [number, number, number, number];
const EASE_IN = [0.4, 0.0, 1.0, 1.0] as [number, number, number, number];
const EASE_SPRING = [0.22, 1, 0.36, 1] as [number, number, number, number];

// ─── Framer Motion variants ───────────────────────────────────────────────────

/** Mobile menu panel — slides down from the navbar edge */
const menuVariants: Variants = {
  hidden: { opacity: 0, y: -8, scaleY: 0.96, transformOrigin: 'top' },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transformOrigin: 'top',
    transition: { duration: 0.22, ease: EASE_SPRING },
  },
  exit: {
    opacity: 0,
    y: -6,
    scaleY: 0.97,
    transformOrigin: 'top',
    transition: { duration: 0.16, ease: EASE_IN },
  },
};

/** Stagger container for mobile nav links */
const linkListVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.06 } },
};

/** Each mobile nav link item */
const linkItemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.2, ease: EASE_OUT } },
};

/** Mobile CTA buttons — slide + fade up */
const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_OUT, delay: 0.18 } },
};

/** Desktop floating dropdown panel */
const dropdownVariants: Variants = {
  hidden: { opacity: 0, y: -6, scale: 0.98, transformOrigin: 'top' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transformOrigin: 'top',
    transition: { duration: 0.18, ease: EASE_SPRING },
  },
  exit: {
    opacity: 0,
    y: -4,
    scale: 0.98,
    transformOrigin: 'top',
    transition: { duration: 0.12, ease: EASE_IN },
  },
};

/** Mobile accordion sub-menu */
const mobileSubmenuVariants: Variants = {
  hidden: { opacity: 0, height: 0, overflow: 'hidden' },
  visible: {
    opacity: 1,
    height: 'auto',
    overflow: 'hidden',
    transition: { duration: 0.22, ease: EASE_SPRING },
  },
  exit: {
    opacity: 0,
    height: 0,
    overflow: 'hidden',
    transition: { duration: 0.16, ease: EASE_IN },
  },
};

// ─── Color scheme map ────────────────────────────────────────────────────────

export type NavbarColorScheme = 'blue' | 'purple';

const NAVBAR_COLORS: Record<
  NavbarColorScheme,
  {
    solid: string;
    hover: string;
    hoverBg: string;
    hoverBgDark: string;
    badgeBg: string;
    badgeColor: string;
    badgeBgDark: string;
    badgeColorDark: string;
  }
> = {
  blue: {
    solid: '#0685FF',
    hover: '#0685FF',
    hoverBg: 'blue.50',
    hoverBgDark: 'rgba(6,133,255,0.12)',
    badgeBg: '#EFF6FF',
    badgeColor: '#0685FF',
    badgeBgDark: 'rgba(6,133,255,0.20)',
    badgeColorDark: '#60A5FA',
  },
  purple: {
    solid: '#7700CC',
    hover: '#7700CC',
    hoverBg: 'purple.50',
    hoverBgDark: 'rgba(119,0,204,0.12)',
    badgeBg: '#FAF5FF',
    badgeColor: '#7700CC',
    badgeBgDark: 'rgba(119,0,204,0.20)',
    badgeColorDark: '#C084FC',
  },
};

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const ArrowIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="7" y1="17" x2="17" y2="7" />
    <polyline points="7 7 17 7 17 17" />
  </svg>
);

function ChevronDownIcon({ isOpen }: { isOpen?: boolean }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        transition: 'transform 0.2s cubic-bezier(0.22, 1, 0.36, 1)',
        transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ opacity: 0.65, flexShrink: 0 }}
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
}

function HamburgerIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill={color} />
      <path
        d="M9.25 10.75H22.75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 16H22.75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 21.25H22.75"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon({ color }: { color: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill={color} />
      <path
        d="M13.8801 16.71L8.93005 21.66L10.3401 23.07L13.1701 20.24L16.0001 17.41L18.1201 19.54L21.6601 23.07L23.0701 21.66L18.1201 16.71L17.4101 16L23.0701 10.34L21.6601 8.92999L16.0001 14.59L10.3401 8.92999L8.93005 10.34L14.5901 16L13.8801 16.71Z"
        fill="white"
      />
    </svg>
  );
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  /** The display label for the navigation item */
  label: string;

  /**
   * Destination URL. Optional when item is purely a dropdown trigger category.
   * @default "#"
   */
  href?: string;

  /** Marks the item as active for current route styling */
  isActive?: boolean;

  /**
   * Child items rendered inside a dropdown menu (Desktop) or accordion (Mobile).
   */
  children?: NavItem[];

  /**
   * Optional short description or subtitle rendered beneath the label in rich dropdown menus.
   */
  description?: string;

  /**
   * Optional leading icon (React element or SVG).
   */
  icon?: React.ReactNode;

  /**
   * Optional badge / tag text or element (e.g. "New", "Beta", 12).
   */
  badge?: string | number | React.ReactNode;

  /**
   * If true, opens in a new tab with rel="noopener noreferrer" and displays an external arrow indicator.
   */
  isExternal?: boolean;

  /** Link target attribute */
  target?: string;

  /** Link rel attribute */
  rel?: string;

  /** Optional custom click handler */
  onClick?: () => void;
}

export interface NavbarProps extends Omit<BoxProps, 'children'> {
  /** Logo element. Defaults to `<Logo />` when omitted. */
  logo?: React.ReactNode;

  /** Navigation items to display. Supports nested dropdowns via `children`. */
  navItems?: NavItem[];

  /**
   * Alignment of the navigation items on desktop.
   * @default "center"
   */
  navItemsAlign?: 'left' | 'center' | 'right';

  /**
   * Custom link renderer — lets you integrate React Router, Next.js `<Link>`, etc.
   *
   * @example
   * ```tsx
   * // Next.js
   * renderLink={(item, children) => <Link href={item.href ?? '#'}>{children}</Link>}
   * // React Router
   * renderLink={(item, children) => <RouterLink to={item.href ?? '#'}>{children}</RouterLink>}
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

  /**
   * Brand color scheme applied to CTAs, active links, and mobile icon accents.
   * @default "blue"
   */
  colorScheme?: NavbarColorScheme;

  /** Pin the navbar to the top of the viewport. */
  isSticky?: boolean;

  /**
   * Visual background treatment.
   * - `"solid"` — uses the surface background token (default)
   * - `"transparent"` — fully transparent (e.g. over a hero image)
   * - `"blur"` — frosted-glass dark overlay
   */
  variant?: 'solid' | 'transparent' | 'blur';
}

// ─── Default link renderer ────────────────────────────────────────────────────

const defaultRenderLink = (item: NavItem, children: React.ReactNode) => {
  const href = item.href ?? '#';
  const target = item.target ?? (item.isExternal ? '_blank' : undefined);
  const rel = item.rel ?? (item.isExternal ? 'noopener noreferrer' : undefined);

  if (href === '#' && !item.onClick) {
    return <span style={{ textDecoration: 'none', display: 'contents' }}>{children}</span>;
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      onClick={item.onClick}
      style={{ textDecoration: 'none', display: 'contents' }}
    >
      {children}
    </a>
  );
};

// ─── NavItem Badge Helper ─────────────────────────────────────────────────────

function ItemBadge({
  badge,
  scheme,
}: {
  badge?: string | number | React.ReactNode;
  scheme: (typeof NAVBAR_COLORS)[NavbarColorScheme];
}) {
  if (!badge) return null;
  if (React.isValidElement(badge)) return badge;

  return (
    <Box
      as="span"
      display="inline-flex"
      alignItems="center"
      px="1.5"
      py="0.5"
      fontSize="10px"
      fontWeight="semibold"
      lineHeight="1"
      borderRadius="badge"
      bg={scheme.badgeBg}
      color={scheme.badgeColor}
      _dark={{ bg: scheme.badgeBgDark, color: scheme.badgeColorDark }}
      border="1px solid"
      borderColor={scheme.badgeColor}
      style={{
        borderColor: 'currentColor',
        opacity: 0.9,
      }}
    >
      {badge}
    </Box>
  );
}

// ─── Desktop Nav Item Component ───────────────────────────────────────────────

function DesktopNavItem({
  item,
  scheme,
  renderLink,
}: {
  item: NavItem;
  scheme: (typeof NAVBAR_COLORS)[NavbarColorScheme];
  renderLink: (item: NavItem, children: React.ReactNode) => React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLLIElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hasChildren = Boolean(item.children && item.children.length > 0);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    if (hasChildren) {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (hasChildren) {
      closeTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 150);
    }
  };

  // If item has no dropdown children, render a standard link
  if (!hasChildren) {
    return (
      <Box as="li" listStyleType="none">
        {renderLink(
          item,
          <Box
            as="span"
            display="inline-flex"
            alignItems="center"
            gap="1.5"
            px="3"
            py="2"
            fontSize="sm"
            fontWeight="medium"
            fontFamily="var(--font-body)"
            color={item.isActive ? scheme.hover : 'text.body'}
            _dark={{ color: item.isActive ? scheme.hover : 'text.body', _hover: { bg: scheme.hoverBgDark, color: scheme.hover } }}
            borderRadius="md"
            transition="all 0.15s"
            _hover={{ color: scheme.hover, bg: scheme.hoverBg }}
            cursor="pointer"
          >
            {item.icon && (
              <Box as="span" display="inline-flex" alignItems="center" flexShrink={0}>
                {item.icon}
              </Box>
            )}
            <span>{item.label}</span>
            <ItemBadge badge={item.badge} scheme={scheme} />
            {item.isExternal && <ExternalLinkIcon />}
          </Box>,
        )}
      </Box>
    );
  }

  // Dropdown parent item
  return (
    <Box
      as="li"
      ref={containerRef}
      listStyleType="none"
      position="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Box
        as="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        display="inline-flex"
        alignItems="center"
        gap="1.5"
        px="3"
        py="2"
        fontSize="sm"
        fontWeight="medium"
        fontFamily="var(--font-body)"
        color={item.isActive || isOpen ? scheme.hover : 'text.body'}
        bg={isOpen ? scheme.hoverBg : 'transparent'}
        _dark={{
          color: item.isActive || isOpen ? scheme.hover : 'text.body',
          bg: isOpen ? scheme.hoverBgDark : 'transparent',
          _hover: { color: scheme.hover, bg: scheme.hoverBgDark },
        }}
        borderRadius="md"
        border="none"
        cursor="pointer"
        transition="all 0.15s"
        _hover={{ color: scheme.hover, bg: scheme.hoverBg }}
      >
        {item.icon && (
          <Box as="span" display="inline-flex" alignItems="center" flexShrink={0}>
            {item.icon}
          </Box>
        )}
        <span>{item.label}</span>
        <ItemBadge badge={item.badge} scheme={scheme} />
        <ChevronDownIcon isOpen={isOpen} />
      </Box>

      {/* Floating Dropdown Menu Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              zIndex: 1000,
            }}
          >
            <Box
              bg="bg.surface"
              border="1px solid"
              borderColor="border"
              borderRadius="card"
              p="2"
              minW="260px"
              maxW="380px"
              display="flex"
              flexDirection="column"
              gap="1"
              role="menu"
              aria-label={item.label}
            >
              {item.children?.map((child, idx) => (
                <Box as="div" key={child.href || `${child.label}-${idx}`} role="none">
                  {renderLink(
                    child,
                    <Box
                      as="span"
                      role="menuitem"
                      display="flex"
                      alignItems="flex-start"
                      gap="3"
                      p="2.5"
                      borderRadius="md"
                      cursor="pointer"
                      transition="all 0.15s ease"
                      color="text.heading"
                      _hover={{
                        bg: scheme.hoverBg,
                        color: scheme.hover,
                      }}
                      _dark={{
                        color: 'text.heading',
                        _hover: {
                          bg: scheme.hoverBgDark,
                          color: scheme.hover,
                        },
                      }}
                      onClick={() => setIsOpen(false)}
                    >
                      {child.icon && (
                        <Box
                          as="span"
                          w="8"
                          h="8"
                          borderRadius="md"
                          bg="bg.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color={scheme.solid}
                          flexShrink={0}
                          mt="0.5"
                        >
                          {child.icon}
                        </Box>
                      )}
                      <Box flex="1" minW="0">
                        <Box display="flex" alignItems="center" gap="1.5" justifyContent="space-between">
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            gap="1.5"
                            fontSize="sm"
                            fontWeight="semibold"
                            fontFamily="var(--font-heading)"
                          >
                            <span>{child.label}</span>
                            {child.isExternal && <ExternalLinkIcon />}
                          </Box>
                          <ItemBadge badge={child.badge} scheme={scheme} />
                        </Box>
                        {child.description && (
                          <Box
                            as="span"
                            display="block"
                            fontSize="xs"
                            color="text.muted"
                            _dark={{ color: 'text.muted' }}
                            fontFamily="var(--font-body)"
                            mt="0.5"
                            lineHeight="1.4"
                          >
                            {child.description}
                          </Box>
                        )}
                      </Box>
                    </Box>,
                  )}
                </Box>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}

// ─── Mobile Nav Item Component (with accordion support) ───────────────────────

function MobileNavItem({
  item,
  scheme,
  renderLink,
  onCloseMenu,
}: {
  item: NavItem;
  scheme: (typeof NAVBAR_COLORS)[NavbarColorScheme];
  renderLink: (item: NavItem, children: React.ReactNode) => React.ReactNode;
  onCloseMenu: () => void;
}) {
  const [isSubOpen, setIsSubOpen] = useState(false);
  const hasChildren = Boolean(item.children && item.children.length > 0);

  if (!hasChildren) {
    return (
      <motion.li variants={linkItemVariants}>
        {renderLink(
          item,
          <Box
            as="span"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            px="3"
            py="2.5"
            fontSize="md"
            fontWeight="medium"
            fontFamily="var(--font-body)"
            color={item.isActive ? scheme.hover : 'text.body'}
            _dark={{ color: item.isActive ? scheme.hover : 'text.body', _hover: { color: scheme.hover, bg: 'bg.subtle' } }}
            borderRadius="md"
            _hover={{ color: scheme.hover, bg: 'bg.subtle' }}
            cursor="pointer"
            onClick={onCloseMenu}
          >
            <Box as="span" display="inline-flex" alignItems="center" gap="2">
              {item.icon && (
                <Box as="span" display="inline-flex" alignItems="center" color={scheme.solid}>
                  {item.icon}
                </Box>
              )}
              <span>{item.label}</span>
            </Box>
            <Box display="flex" alignItems="center" gap="1.5">
              <ItemBadge badge={item.badge} scheme={scheme} />
              {item.isExternal && <ExternalLinkIcon />}
            </Box>
          </Box>,
        )}
      </motion.li>
    );
  }

  // Accordion item for dropdowns
  return (
    <motion.li variants={linkItemVariants} style={{ listStyle: 'none' }}>
      <Box
        as="button"
        onClick={() => setIsSubOpen(!isSubOpen)}
        aria-expanded={isSubOpen}
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        width="100%"
        px="3"
        py="2.5"
        fontSize="md"
        fontWeight="medium"
        fontFamily="var(--font-body)"
        color={item.isActive || isSubOpen ? scheme.hover : 'text.body'}
        bg={isSubOpen ? 'bg.subtle' : 'transparent'}
        _dark={{
          color: item.isActive || isSubOpen ? scheme.hover : 'text.body',
          bg: isSubOpen ? 'bg.subtle' : 'transparent',
          _hover: { color: scheme.hover, bg: 'bg.subtle' },
        }}
        borderRadius="md"
        border="none"
        cursor="pointer"
        textAlign="left"
        transition="background 0.15s ease, color 0.15s ease"
        _hover={{ color: scheme.hover, bg: 'bg.subtle' }}
      >
        <Box as="span" display="inline-flex" alignItems="center" gap="2">
          {item.icon && (
            <Box as="span" display="inline-flex" alignItems="center" color={scheme.solid}>
              {item.icon}
            </Box>
          )}
          <span>{item.label}</span>
        </Box>
        <Box display="flex" alignItems="center" gap="2">
          <ItemBadge badge={item.badge} scheme={scheme} />
          <ChevronDownIcon isOpen={isSubOpen} />
        </Box>
      </Box>

      {/* Accordion Submenu */}
      <AnimatePresence>
        {isSubOpen && (
          <motion.div
            variants={mobileSubmenuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <Box
              pl="4"
              pr="2"
              py="1.5"
              display="flex"
              flexDirection="column"
              gap="1"
              borderLeft="2px solid"
              borderColor="border"
              ml="4"
              my="1"
            >
              {item.children?.map((child, idx) => (
                <Box as="div" key={child.href || `${child.label}-${idx}`}>
                  {renderLink(
                    child,
                    <Box
                      as="span"
                      display="flex"
                      alignItems="flex-start"
                      gap="2.5"
                      px="2.5"
                      py="2"
                      borderRadius="md"
                      color="text.body"
                      _dark={{ color: 'text.body', _hover: { color: scheme.hover, bg: 'bg.subtle' } }}
                      _hover={{ color: scheme.hover, bg: 'bg.subtle' }}
                      cursor="pointer"
                      onClick={onCloseMenu}
                    >
                      {child.icon && (
                        <Box
                          as="span"
                          w="6"
                          h="6"
                          borderRadius="md"
                          bg="bg.subtle"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          color={scheme.solid}
                          flexShrink={0}
                          mt="0.5"
                        >
                          {child.icon}
                        </Box>
                      )}
                      <Box flex="1" minW="0">
                        <Box display="flex" alignItems="center" justifyContent="space-between" gap="1">
                          <Box
                            as="span"
                            display="inline-flex"
                            alignItems="center"
                            gap="1"
                            fontSize="sm"
                            fontWeight="medium"
                            fontFamily="var(--font-heading)"
                          >
                            <span>{child.label}</span>
                            {child.isExternal && <ExternalLinkIcon />}
                          </Box>
                          <ItemBadge badge={child.badge} scheme={scheme} />
                        </Box>
                        {child.description && (
                          <Box
                            as="span"
                            display="block"
                            fontSize="xs"
                            color="text.muted"
                            _dark={{ color: 'text.muted' }}
                            fontFamily="var(--font-body)"
                            mt="0.5"
                            lineHeight="1.3"
                          >
                            {child.description}
                          </Box>
                        )}
                      </Box>
                    </Box>,
                  )}
                </Box>
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Navbar Component
// ─────────────────────────────────────────────────────────────────────────────

/**
 * MedixDeck Navbar
 *
 * Responsive navigation bar with multi-level dropdowns and smooth Framer Motion animations:
 * - Desktop hover/click dropdown panels with rich descriptions, icons, and badges
 * - Mobile menu accordion slide-down with nested expandable submenus
 * - Nav links stagger-fade on mobile open
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
 * ### With Dropdown Links
 * ```tsx
 * <Navbar
 *   navItems={[
 *     { label: "Home", href: "/" },
 *     {
 *       label: "Services",
 *       children: [
 *         { label: "Doctor Consultations", href: "/services/doctors", description: "Talk to top specialists online" },
 *         { label: "Homecare Visits", href: "/services/homecare", description: "Clinical nursing at your doorstep", badge: "Popular" },
 *         { label: "Medical Outreach", href: "/services/outreach", description: "Community healthcare programs" },
 *       ]
 *     },
 *     { label: "About Us", href: "/about" },
 *   ]}
 *   ctaLabel="Talk to a Doctor"
 *   ctaHref="/consult"
 *   isSticky
 * />
 * ```
 */
export function Navbar({
  logo,
  navItems = [],
  navItemsAlign = 'center',
  ctaLabel = 'Get Started',
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
  colorScheme = 'blue',
  variant = 'solid',
  ...props
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const scheme = NAVBAR_COLORS[colorScheme];

  // Icon button falls back to label button values
  const resolvedIconHref = ctaIconHref ?? ctaHref;
  const resolvedIconHandler = onCtaIconClick ?? onCtaClick;

  // Background style
  const bgStyle: React.CSSProperties =
    variant === 'blur' ? { background: 'rgba(10,18,32,0.85)', backdropFilter: 'blur(12px)' } : {};

  // ── Default CTA group ───────────────────────────────────────────────────────
  const DefaultCtaGroup = ({ mobile = false }: { mobile?: boolean }) => (
    <Box display="flex" gap="2" alignItems="center" flexDirection={mobile ? 'column' : 'row'}>
      {secondaryCtaLabel && (
        <Button
          as={secondaryCtaHref ? 'a' : 'button'}
          href={secondaryCtaHref}
          variant={mobile ? 'outline' : 'ghost'}
          colorScheme={colorScheme}
          size={mobile ? 'md' : 'sm'}
          onClick={() => {
            onSecondaryCtaClick?.();
            if (mobile) setIsOpen(false);
          }}
          style={mobile ? { width: '100%' } : undefined}
        >
          {secondaryCtaLabel}
        </Button>
      )}
      <Button
        as={ctaHref ? 'a' : 'button'}
        href={ctaHref}
        variant="solid"
        colorScheme={colorScheme}
        size={mobile ? 'md' : 'sm'}
        onClick={() => {
          onCtaClick?.();
          if (mobile) setIsOpen(false);
        }}
        style={mobile ? { width: '100%' } : undefined}
      >
        {ctaLabel}
      </Button>
      {!mobile && (
        <Button
          as={resolvedIconHref ? 'a' : 'button'}
          href={resolvedIconHref}
          target={resolvedIconHref && resolvedIconHref !== ctaHref ? '_blank' : undefined}
          rel={resolvedIconHref && resolvedIconHref !== ctaHref ? 'noopener noreferrer' : undefined}
          variant="solid"
          colorScheme={colorScheme}
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
      position={isSticky ? 'sticky' : 'relative'}
      top={isSticky ? '0' : undefined}
      zIndex={isSticky ? 'sticky' : 40}
      bg={variant === 'transparent' ? 'transparent' : variant === 'blur' ? undefined : 'bg'}
      style={bgStyle}
      borderBottom="1px solid"
      borderColor={variant === 'transparent' ? 'transparent' : 'border'}
      transition="background 0.2s ease, border-color 0.2s ease"
      {...props}
    >
      {/* ── Inner container ────────────────────────────────────────────────── */}
      <Box
        maxW="1280px"
        mx="auto"
        px={{ base: '4', md: '6', lg: '8' }}
        h="16"
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        gap="8"
      >
        {/* Logo */}
        <Box flexShrink={0}>
          {logo ?? <Logo variant={colorScheme === 'blue' ? 'blue' : 'purple'} height={28} />}
        </Box>

        {/* ── Desktop nav links ─────────────────────────────────────────────── */}
        <Box
          as="ul"
          display={{ base: 'none', md: 'flex' }}
          alignItems="center"
          justifyContent={
            navItemsAlign === 'left'
              ? 'flex-start'
              : navItemsAlign === 'right'
                ? 'flex-end'
                : 'center'
          }
          gap="1"
          listStyleType="none"
          m="0"
          p="0"
          flex="1"
        >
          {navItems.map((item, idx) => (
            <DesktopNavItem
              key={item.href || `${item.label}-${idx}`}
              item={item}
              scheme={scheme}
              renderLink={renderLink}
            />
          ))}
        </Box>

        {/* ── Desktop CTA ───────────────────────────────────────────────────── */}
        <Box display={{ base: 'none', md: 'flex' }} alignItems="center" flexShrink={0}>
          {ctaSlot ?? <DefaultCtaGroup />}
        </Box>

        {/* ── Mobile hamburger / close — animated crossfade ─────────────────── */}
        <Box
          as="button"
          display={{ base: 'flex', md: 'none' }}
          alignItems="center"
          justifyContent="center"
          border="none"
          bg="transparent"
          p="0"
          cursor="pointer"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          position="relative"
          width="32px"
          height="32px"
          flexShrink={0}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CloseIcon color={scheme.solid} />
              </motion.span>
            ) : (
              <motion.span
                key="hamburger"
                initial={{ opacity: 0, rotate: 45, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: -45, scale: 0.7 }}
                transition={{ duration: 0.18, ease: EASE_OUT }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <HamburgerIcon color={scheme.solid} />
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
            style={{ overflow: 'hidden' }}
          >
            <Box
              display={{ base: 'block', md: 'none' }}
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
                style={{
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 4,
                }}
              >
                {navItems.map((item, idx) => (
                  <MobileNavItem
                    key={item.href || `${item.label}-${idx}`}
                    item={item}
                    scheme={scheme}
                    renderLink={renderLink}
                    onCloseMenu={() => setIsOpen(false)}
                  />
                ))}
              </motion.ul>

              {/* Animated CTA area */}
              <motion.div variants={ctaVariants} initial="hidden" animate="visible">
                <Box mt="4">{ctaSlot ?? <DefaultCtaGroup mobile />}</Box>
              </motion.div>
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
}
