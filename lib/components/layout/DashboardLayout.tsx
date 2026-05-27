"use client";

import React, { useState, useRef, useEffect, useId } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useThemeMode, type ThemeModeSetting } from "../../hooks/useThemeMode";
import { Logo } from "../primitive/Logo";
import { Avatar } from "../primitive/Avatar";

// ─── Brand colours (native-first pattern per AGENTS.md §15) ──────────────────

export type DashboardColorScheme = "blue" | "purple";

const SCHEME_COLORS: Record<
  DashboardColorScheme,
  {
    solid: string;
    hoverBgLight: string;
    hoverBgDark: string;
    activeBgLight: string;
    activeBgDark: string;
    activeBgDarkStrong: string;
    chakraToken: string;
  }
> = {
  blue: {
    solid: "#0685FF",
    hoverBgLight: "rgba(6,133,255,0.08)",
    hoverBgDark: "rgba(6,133,255,0.12)",
    activeBgLight: "rgba(6,133,255,0.10)",
    activeBgDark: "rgba(6,133,255,0.15)",
    activeBgDarkStrong: "rgba(6,133,255,0.18)",
    chakraToken: "blue.500",
  },
  purple: {
    solid: "#7700CC",
    hoverBgLight: "rgba(119,0,204,0.08)",
    hoverBgDark: "rgba(119,0,204,0.12)",
    activeBgLight: "rgba(119,0,204,0.10)",
    activeBgDark: "rgba(119,0,204,0.15)",
    activeBgDarkStrong: "rgba(119,0,204,0.18)",
    chakraToken: "purple.500",
  },
};

const RED = "#EF4444";
const RED_HOVER_BG = "rgba(239,68,68,0.08)";

// ─── Inline SVG icons ─────────────────────────────────────────────────────────

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseMenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const ChevronDownIcon = ({ open }: { open: boolean }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const ProfileIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const SettingsIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

const SunIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="2" x2="12" y2="4" />
    <line x1="12" y1="20" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
    <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="4" y2="12" />
    <line x1="20" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
    <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
  </svg>
);

const MoonIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="12" rx="2" />
    <line x1="8" y1="20" x2="16" y2="20" />
    <line x1="12" y1="16" x2="12" y2="20" />
  </svg>
);

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DashboardNavItem {
  /** Display label for the nav item. */
  label: string;
  /** Identifier / href — used as a key and passed to `renderLink`. */
  href: string;
  /** Optional icon element (e.g. an inline SVG component). */
  icon?: React.ReactNode;
  /** Numeric count badge shown to the right of the label. */
  badge?: number;
  /** Red dot indicator (e.g. for unread notifications). */
  hasDot?: boolean;
  /** Mark this item as the currently active route. */
  isActive?: boolean;
  /** Optional nested sub-items (creates an expandable dropdown accordion). */
  subItems?: DashboardNavItem[];
}

export interface DashboardNavGroup {
  /** Optional uppercase section heading (e.g. "Account"). */
  groupLabel?: string;
  /** Nav items belonging to this group. */
  items: DashboardNavItem[];
}

export interface DashboardMobileNavItem {
  /** Label shown below the icon in the mobile bottom bar. */
  label: string;
  /** href used by `renderLink` and as a unique key. */
  href: string;
  /** Icon element rendered above the label (recommended: 22×22 SVG). */
  icon: React.ReactNode;
  /** Mark this tab as active. */
  isActive?: boolean;
  /** Numeric count badge shown on the icon (capped at 99+). */
  badge?: number;
}

/**
 * Data for the doctor identity card shown at the top of the sidebar.
 * Only rendered when this prop is supplied — intended for doctor-role users.
 */
export interface DashboardScoreCardData {
  /** Doctor's full name. */
  name: string;
  /** Doctor's specialty / role shown as the primary label (e.g. "Cardiologist"). */
  role: string;
  /** Optional avatar image URL. Falls back to initials. */
  avatarSrc?: string;
  /** Optional href to navigate to the doctor's profile when the card is clicked. */
  link?: string;
  /** Clinician tier — determines avatar ring colour and badge text colour. */
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  /** Numeric MedixScore displayed next to the tier label. */
  medixScore: number;
}

export interface DashboardUser {
  /** Display name shown in the top bar greeting and dropdown. */
  name: string;
  /** Email shown in the user dropdown. */
  email?: string;
  /** Optional avatar image src. Falls back to initials. */
  avatarSrc?: string;
}

export interface DashboardDropdownItem {
  /** Label shown in the dropdown menu. */
  label: string;
  /** Optional icon rendered to the left of the label. */
  icon?: React.ReactNode;
  /** Called when the item is clicked. */
  onClick?: () => void;
  /** Renders the item in a destructive/danger colour. */
  isDanger?: boolean;
}

export interface DashboardLayoutProps extends Omit<BoxProps, "children"> {
  /** Page content rendered inside the main area. */
  children: React.ReactNode;

  /**
   * Logo shown at the top of the sidebar.
   * Defaults to `<Logo height={26} />` when omitted.
   */
  logo?: React.ReactNode;

  /**
   * Navigation groups. Each group can have an optional section label and an
   * array of nav items. Items are rendered top-to-bottom with the group label
   * as a separator heading.
   *
   * @example
   * ```tsx
   * navGroups={[
   *   { items: [{ label: "Home", href: "/", icon: <HomeIcon />, isActive: true }] },
   *   { groupLabel: "Account", items: [{ label: "Profile", href: "/profile", icon: <ProfileIcon /> }] },
   * ]}
   * ```
   */
  navGroups: DashboardNavGroup[];

  /** Authenticated user displayed in the top-bar user menu. */
  user: DashboardUser;

  /**
   * Override the auto-computed greeting ("Good morning / afternoon / evening").
   * @example greeting="Welcome back"
   */
  greeting?: string;

  /** Called when the sidebar logout button is clicked. */
  onLogout?: () => void;

  /**
   * Custom link renderer — mirrors the Navbar `renderLink` API.
   * Use this to integrate Next.js `<Link>`, React Router `<Link>`, or TanStack
   * Router without importing those packages inside the library.
   *
   * @example
   * ```tsx
   * // Next.js
   * renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
   * // TanStack Router
   * renderLink={(item, children) => <RouterLink to={item.href}>{children}</RouterLink>}
   * ```
   */
  renderLink?: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;

  /**
   * Additional items shown in the user dropdown menu above the built-in
   * Log out option. Use this to add Profile, Settings, etc.
   */
  dropdownItems?: DashboardDropdownItem[];

  /**
   * Slot rendered on the right-hand side of the top bar, next to the user
   * avatar. Use for global search, notification bell, etc.
   */
  topBarSlot?: React.ReactNode;

  /**
   * Width of the sidebar in pixels.
   * @default 220
   */
  sidebarWidth?: number;

  /**
   * Brand accent applied to active nav items, logo, badge backgrounds, and the
   * theme toggle active state.
   * @default "blue"
   */
  colorScheme?: DashboardColorScheme;

  /**
   * Optional flat list of up to 5 items for the mobile bottom navigation bar.
   * When provided, a fixed bottom tab bar is shown on mobile (hidden on md+).
   * Each item requires an `icon` and a `label`. Set `isActive` on the current
   * route's item to highlight it.
   *
   * The same `renderLink` prop is used to wrap each tab, so router integration
   * works out-of-the-box.
   *
   * @example
   * ```tsx
   * mobileNavItems={[
   *   { label: "Home",     href: "/",          icon: <HomeIcon />,    isActive: true },
   *   { label: "Messages", href: "/messages",  icon: <ChatIcon />,   badge: 3 },
   *   { label: "Profile",  href: "/profile",   icon: <UserIcon /> },
   * ]}
   * ```
   */
  mobileNavItems?: DashboardMobileNavItem[];

  /**
   * Optional doctor identity / score card shown at the top of the sidebar
   * (desktop only). Pass this when the authenticated user is a doctor.
   *
   * @example
   * ```tsx
   * scoreCard={{
   *   name: "Okedi Williams",
   *   role: "Cardiologist",
   *   avatarSrc: "/dr-okedi.jpg",
   *   tier: "gold",
   *   medixScore: 847,
   *   link: "/doctor/profile",
   * }}
   * ```
   */
  scoreCard?: DashboardScoreCardData;
}

// ─── Helper: default link renderer ───────────────────────────────────────────

const defaultRenderLink = (item: DashboardNavItem, children: React.ReactNode) => (
  <a href={item.href} style={{ textDecoration: "none", display: "block" }}>
    {children}
  </a>
);

// ─── Helper: auto greeting ────────────────────────────────────────────────────

function autoGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const themeOptions: Array<{
  value: ThemeModeSetting;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}> = [
    { value: "light", label: "Light mode", shortLabel: "Light", icon: <SunIcon /> },
    { value: "dark", label: "Dark mode", shortLabel: "Dark", icon: <MoonIcon /> },
    { value: "system", label: "System theme", shortLabel: "System", icon: <SystemIcon /> },
  ];

function ThemeToggleGroup({ scheme }: { scheme: (typeof SCHEME_COLORS)[DashboardColorScheme] }) {
  const { mounted, themeMode, themeSetting, setThemeMode } = useThemeMode();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeMode = mounted ? themeSetting : undefined;
  const activeOption = themeOptions.find((o) => o.value === activeMode) || themeOptions[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Shared inner content for the horizontal pill
  const desktopPill = (
    <Box
      display={{ base: "none", md: "flex" }}
      alignItems="center"
      gap="1"
      bg="bg.surface"
      border="1px solid"
      borderColor="border"
      borderRadius="full"
      p="1"
      aria-label="Theme mode switcher"
    >
      {themeOptions.map((option) => {
        const isActive = activeMode === option.value;
        const activeFill = option.value === "dark"
          ? scheme.activeBgDarkStrong
          : option.value === "system"
            ? scheme.hoverBgDark
            : scheme.hoverBgLight;

        return (
          <Box
            key={option.value}
            as="button"
            onClick={() => {
              if (!mounted) return;
              setThemeMode(option.value);
            }}
            aria-pressed={isActive}
            aria-label={option.label}
            title={mounted && option.value === "system" ? `System theme (currently ${themeMode})` : option.label}
            display="inline-flex"
            alignItems="center"
            gap="2"
            h="9"
            px="3"
            borderRadius="full"
            border="none"
            bg={isActive ? activeFill : "transparent"}
            color={isActive ? scheme.chakraToken : "text.muted"}
            opacity={mounted ? 1 : 0.6}
            cursor={mounted ? "pointer" : "default"}
            transition="background 0.18s ease, color 0.18s ease, opacity 0.18s ease"
            _hover={mounted ? { bg: isActive ? activeFill : "bg", color: "text.heading" } : undefined}
            _focusVisible={{ outline: "2px solid", outlineColor: scheme.chakraToken, outlineOffset: "2px" }}
          >
            <Box display="inline-flex" alignItems="center" justifyContent="center" flexShrink={0}>
              {option.icon}
            </Box>
            <Box
              as="span"
              fontSize="xs"
              fontWeight={isActive ? "700" : "600"}
              fontFamily="var(--font-body)"
              whiteSpace="nowrap"
            >
              {option.shortLabel}
            </Box>
          </Box>
        );
      })}
    </Box>
  );

  // Mobile dropdown
  const mobileDropdown = (
    <Box display={{ base: "block", md: "none" }} position="relative" ref={dropdownRef}>
      <Box
        as="button"
        display="flex"
        alignItems="center"
        justifyContent="center"
        w="10"
        h="10"
        borderRadius="full"
        bg="bg.surface"
        border="1px solid"
        borderColor="border"
        color={scheme.chakraToken}
        cursor={mounted ? "pointer" : "default"}
        opacity={mounted ? 1 : 0.6}
        _hover={mounted ? { bg: "bg" } : undefined}
        onClick={() => {
          if (!mounted) return;
          setDropdownOpen((o) => !o);
        }}
        aria-label="Theme mode switcher"
        aria-expanded={dropdownOpen}
        aria-haspopup="menu"
      >
        {activeOption.icon}
      </Box>

      {dropdownOpen && mounted && (
        <Box
          role="menu"
          position="absolute"
          top="calc(100% + 8px)"
          right="0"
          minW="150px"
          bg="bg"
          border="1px solid"
          borderColor="border"
          borderRadius="xl"
          boxShadow="0 8px 32px rgba(0,0,0,0.12)"
          zIndex="popover"
          overflow="hidden"
          py="1"
        >
          {themeOptions.map((option) => {
            const isActive = activeMode === option.value;
            return (
              <Box
                key={option.value}
                as="button"
                role="menuitem"
                display="flex"
                alignItems="center"
                gap="2.5"
                w="full"
                px="4"
                py="2.5"
                border="none"
                bg={isActive ? scheme.hoverBgLight : "transparent"}
                color={isActive ? scheme.chakraToken : "text.body"}
                cursor="pointer"
                textAlign="left"
                onClick={() => {
                  setThemeMode(option.value);
                  setDropdownOpen(false);
                }}
                _hover={{ bg: scheme.hoverBgLight, color: scheme.chakraToken }}
                _dark={{
                  bg: isActive ? scheme.hoverBgDark : "transparent",
                  _hover: { bg: scheme.hoverBgDark },
                }}
              >
                <Box flexShrink={0}>
                  {option.icon}
                </Box>
                <Box
                  as="span"
                  fontSize="sm"
                  fontWeight={isActive ? "600" : "500"}
                  fontFamily="var(--font-body)"
                >
                  {option.label}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {desktopPill}
      {mobileDropdown}
    </>
  );
}

// ─── SidebarNavItem ───────────────────────────────────────────────────────────

function SidebarNavItem({
  item,
  renderLink: render,
  onClick,
  scheme,
}: {
  item: DashboardNavItem;
  renderLink: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;
  onClick?: () => void;
  scheme: (typeof SCHEME_COLORS)[DashboardColorScheme];
}) {
  const [hovered, setHovered] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const isActive = item.isActive ?? false;
  const hasActiveSubItem = item.subItems?.some((sub) => sub.isActive) ?? false;
  const [expanded, setExpanded] = useState(isActive || hasActiveSubItem);
  const hasSubItems = !!(item.subItems && item.subItems.length > 0);
  const subMenuId = useId();

  // Sync expanded when active state changes from outside (e.g. route change).
  // But do NOT keep expanded=true after navigating away — only expand when
  // this item (or one of its children) is actually the active route.
  useEffect(() => {
    setExpanded(isActive || hasActiveSubItem);
  }, [isActive, hasActiveSubItem]);

  // Use isActive for colour; use (isActive || expanded) only for the chevron
  // direction so that manually-opened accordions don't inherit the brand colour.
  const isColoured = isActive;

  // Visual row — pure styling, no interactive semantics
  const rowContent = (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="2.5"
      borderRadius="lg"
      borderLeftRadius={hasSubItems ? "lg" : "none"}
      borderTopLeftRadius={hasSubItems ? "lg" : "none"}
      borderBottomLeftRadius={hasSubItems ? "lg" : "none"}
      position="relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      // For leaf items, propagate the onClick (e.g. close mobile sidebar) via
      // the wrapped link element produced by render().
      onClick={!hasSubItems ? onClick : undefined}
      style={{
        background: isActive
          ? scheme.activeBgLight
          : hovered
            ? scheme.hoverBgLight
            : "transparent",
        boxShadow: isActive && !hasSubItems ? `inset 3px 0 0 ${scheme.solid}` : undefined,
        outline: focusVisible ? `2px solid ${scheme.solid}` : undefined,
        outlineOffset: focusVisible ? "2px" : undefined,
        transition: "background 0.15s ease, box-shadow 0.15s ease",
      }}
      _dark={{
        bg: isActive
          ? scheme.activeBgDark
          : hovered
            ? scheme.hoverBgDark
            : "transparent",
      }}
    >
      {/* Icon */}
      {item.icon && (
        <Box
          flexShrink={0}
          style={{
            color: isColoured ? scheme.solid : undefined,
            opacity: isColoured ? 1 : hovered ? 0.85 : 0.6,
            transition: "color 0.15s ease, opacity 0.15s ease",
          }}
          color={isColoured ? scheme.chakraToken : "text.body"}
        >
          {item.icon}
        </Box>
      )}

      {/* Label */}
      <Box
        as="span"
        flex="1"
        fontSize="sm"
        fontWeight={isColoured ? "600" : "500"}
        fontFamily="var(--font-body)"
        style={{
          color: isColoured ? scheme.solid : undefined,
          transition: "color 0.15s ease",
        }}
        color={isColoured ? scheme.chakraToken : "text.body"}
      >
        {item.label}
      </Box>

      {/* Numeric badge */}
      {typeof item.badge === "number" && !hasSubItems && (
        <Box
          as="span"
          display="inline-flex"
          alignItems="center"
          justifyContent="center"
          minW="20px"
          h="20px"
          px="1"
          borderRadius="full"
          fontSize="xs"
          fontWeight="700"
          lineHeight="1"
          style={{
            background: scheme.solid,
            color: "#fff",
          }}
        >
          {item.badge}
        </Box>
      )}

      {/* Red dot badge */}
      {item.hasDot && !hasSubItems && (
        <Box
          as="span"
          display="inline-block"
          w="7px"
          h="7px"
          borderRadius="full"
          flexShrink={0}
          style={{ background: RED }}
          aria-label="New notification"
        />
      )}

      {/* Chevron for sub-items */}
      {hasSubItems && (
        <Box
          flexShrink={0}
          color="text.muted"
        >
          <ChevronDownIcon open={expanded} />
        </Box>
      )}
    </Box>
  );

  return (
    <>
      {hasSubItems ? (
        // Render as a native <button> so keyboard users can toggle via Enter/Space
        // and assistive tech can announce aria-expanded / aria-controls.
        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={subMenuId}
          onClick={() => setExpanded((e) => !e)}
          onFocus={(e) => {
            setFocusVisible(e.currentTarget.matches(":focus-visible"));
          }}
          onBlur={() => setFocusVisible(false)}
          style={{
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            textAlign: "left",
          }}
        >
          {rowContent}
        </button>
      ) : (
        render(item, rowContent)
      )}

      {/* Sub-items dropdown list — always in DOM so aria-controls resolves */}
      {hasSubItems && (
        <motion.div
          id={subMenuId}
          initial={false}
          animate={expanded ? { height: "auto", opacity: 1 } : { height: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: [0.0, 0.0, 0.2, 1.0] }}
          style={{ overflow: "hidden" }}
          aria-hidden={!expanded}
        >
          <Box
            display="flex"
            flexDirection="column"
            gap="0.5"
            pl="9" // Indent to align with text of parent item
            mt="0.5"
            mb="1"
          >
            {item.subItems!.map((subItem) => (
              <SidebarNavItem
                key={subItem.href}
                item={subItem}
                renderLink={render}
                onClick={onClick}
                scheme={scheme}
              />
            ))}
          </Box>
        </motion.div>
      )}
    </>
  );
}

// ─── MobileBottomNav ─────────────────────────────────────────────────────────

interface MobileBottomNavProps {
  items: DashboardMobileNavItem[];
  renderLink: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;
  scheme: (typeof SCHEME_COLORS)[DashboardColorScheme];
}

// ─── Keyframe singleton injector ────────────────────────────────────────────────────

let mobileNavKfInjected = false;
function injectMobileNavKeyframe() {
  if (typeof document === "undefined" || mobileNavKfInjected) return;
  const s = document.createElement("style");
  s.setAttribute("data-medixdeck", "mobile-nav");
  s.textContent = `
    @keyframes medixMobileNavIn {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
  `;
  document.head.appendChild(s);
  mobileNavKfInjected = true;
}

function MobileBottomNav({ items, renderLink, scheme }: MobileBottomNavProps) {
  React.useEffect(() => { injectMobileNavKeyframe(); }, []);

  return (
    <Box
      as="nav"
      aria-label="Mobile bottom navigation"
      // Responsive: visible on mobile, hidden on md+
      display={{ base: "flex", md: "none" }}
      position="fixed"
      bottom="0"
      left="0"
      right="0"
      zIndex="docked"
      bg="bg"
      borderTop="1px solid"
      borderColor="border"
      alignItems="center"
      style={{
        height: 64,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.10), 0 -1px 0 rgba(0,0,0,0.04)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        animation: "medixMobileNavIn 0.42s cubic-bezier(0.22,1,0.36,1) both",
      }}
    >
      {items.slice(0, 5).map((item) => {
        const isActive = item.isActive ?? false;

        const tabContent = (
          <motion.div
            whileTap={{ scale: 0.82 }}
            transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.7 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              flex: 1,
              height: "100%",
              padding: "6px 4px 4px",
              cursor: "pointer",
              position: "relative",
              gap: 4,
              textDecoration: "none",
              WebkitTapHighlightColor: "transparent",
            }}
          >
            {/* Animated pill capsule — scales in behind the active icon */}
            <div
              aria-hidden="true"
              style={{
                position: "absolute",
                top: 7,
                left: "50%",
                width: 44,
                height: 28,
                borderRadius: 14,
                background: scheme.activeBgLight,
                transform: `translateX(-50%) scaleX(${isActive ? 1 : 0})`,
                opacity: isActive ? 1 : 0,
                transition: "transform 0.3s cubic-bezier(0.22,1,0.36,1), opacity 0.2s ease",
                pointerEvents: "none",
              }}
            />

            {/* Icon — relative wrapper so the badge bubble can be absolutely positioned */}
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              position="relative"
              zIndex={1}
              color={isActive ? scheme.chakraToken : "text.muted"}
              style={{
                transition: "color 0.18s ease",
                opacity: isActive ? 1 : 0.6,
              }}
            >
              {item.icon}

              {/* Badge bubble */}
              {typeof item.badge === "number" && item.badge > 0 && (
                <span
                  aria-label={`${item.badge} unread`}
                  style={{
                    position: "absolute",
                    top: -5,
                    right: -6,
                    minWidth: 16,
                    height: 16,
                    borderRadius: 8,
                    background: scheme.solid,
                    color: "#fff",
                    fontSize: 9,
                    fontWeight: 700,
                    fontFamily: "var(--font-body)",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                    lineHeight: 1,
                    boxShadow: "0 0 0 2px var(--chakra-colors-bg, #fff)",
                    pointerEvents: "none",
                  }}
                >
                  {item.badge > 99 ? "99+" : item.badge}
                </span>
              )}
            </Box>

            {/* Label */}
            <Box
              as="span"
              fontSize="2xs"
              fontWeight={isActive ? "700" : "500"}
              fontFamily="var(--font-body)"
              textAlign="center"
              lineHeight="1"
              position="relative"
              zIndex={1}
              color={isActive ? scheme.chakraToken : "text.muted"}
              style={{
                transition: "color 0.18s ease",
                letterSpacing: isActive ? "-0.01em" : "0",
              }}
            >
              {item.label}
            </Box>
          </motion.div>
        );

        const navItem: DashboardNavItem = { label: item.label, href: item.href, isActive: item.isActive };

        return (
          <Box
            key={item.href}
            flex="1"
            display="flex"
            alignItems="stretch"
            justifyContent="center"
            h="16"
            style={{ textDecoration: "none" }}
          >
            {renderLink(navItem, tabContent)}
          </Box>
        );
      })}
    </Box>
  );
}

// ─── MedixScoreCard (internal sidebar component) ─────────────────────────────

const TIER_CONFIG = {
  bronze: { label: "Bronze Clinician", color: "#92400E", ring: "#D97706", bg: "rgba(217,119,6,0.10)" },
  silver: { label: "Silver Clinician", color: "#475569", ring: "#94A3B8", bg: "rgba(148,163,184,0.10)" },
  gold: { label: "Gold Clinician", color: "#D97706", ring: "#F59E0B", bg: "rgba(245,158,11,0.10)" },
  platinum: { label: "Platinum Clinician", color: "#0284C7", ring: "#38BDF8", bg: "rgba(56,189,248,0.10)" },
  diamond: { label: "Diamond Clinician", color: "#7C3AED", ring: "#A78BFA", bg: "rgba(167,139,250,0.10)" },
} as const;

const AwardIcon = ({ color }: { color: string }) => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

function SidebarScoreCard({
  data,
  renderLink,
}: {
  data: DashboardScoreCardData;
  renderLink: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;
}) {
  const tier = TIER_CONFIG[data.tier];
  const initials = data.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const cardInner = (
    <Box
      mx="3"
      my="4"
      borderRadius="card"
      border="1px solid"
      borderColor="border"
      bg="bg"
      overflow="hidden"
      style={{ cursor: data.link ? "pointer" : "default" }}
      _hover={data.link ? { borderColor: tier.ring, boxShadow: `0 0 0 1px ${tier.ring}40` } : undefined}
      transition="border-color 0.15s ease, box-shadow 0.15s ease"
    >
      {/* ── Top row: avatar + role/name + chevron ── */}
      <Box display="flex" alignItems="center" gap="3" px="3" pt="3" pb="2.5">
        {/* Avatar with tier-coloured gradient ring */}
        <div
          style={{
            flexShrink: 0,
            padding: 2,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${tier.ring}, ${tier.color})`,
          }}
        >
          {data.avatarSrc ? (
            <img
              src={data.avatarSrc}
              alt={data.name}
              style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <div
              style={{
                width: 40, height: 40, borderRadius: "50%",
                background: tier.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700,
                color: tier.color,
                fontFamily: "var(--font-heading)",
              }}
            >
              {initials}
            </div>
          )}
        </div>

        {/* Text */}
        <Box flex="1" minW="0">
          <Box
            fontSize="sm"
            fontWeight="700"
            fontFamily="var(--font-heading)"
            color="text.heading"
            lineHeight="1.2"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {data.role}
          </Box>
          <Box
            fontSize="xs"
            color="text.muted"
            fontFamily="var(--font-body)"
            lineHeight="1.3"
            mt="0.5"
            style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
          >
            {data.name}
          </Box>
        </Box>

        {/* Chevron */}
        {data.link && (
          <Box color="text.muted" flexShrink={0}>
            <ChevronRightIcon />
          </Box>
        )}
      </Box>

      {/* ── Divider ── */}
      <Box borderTop="1px solid" borderColor="border" />

      {/* ── Score row ── */}
      <Box px="3" pt="2" pb="2.5">
        <Box
          fontSize="10px"
          fontWeight="600"
          letterSpacing="wider"
          color="text.muted"
          fontFamily="var(--font-body)"
          mb="1"
        >
          MedixScore
        </Box>
        <Box display="flex" alignItems="center" gap="2" flexWrap="nowrap">
          <AwardIcon color={tier.color} />
          <Box
            fontSize="sm"
            fontWeight="500"
            fontFamily="var(--font-body)"
            style={{ color: tier.color, whiteSpace: "nowrap" }}
          >
            {tier.label}
          </Box>
          <Box
            fontSize="sm"
            fontWeight="500"
            color="text.heading"
            fontFamily="var(--font-body)"
            ml="1"
            style={{ whiteSpace: "nowrap" }}
          >
            {data.medixScore.toLocaleString()} {Number(data.medixScore) > 2 ? 'pts' : 'pt'}
          </Box>
        </Box>
      </Box>
    </Box>
  );

  if (data.link) {
    return <>{renderLink({ label: data.role, href: data.link }, cardInner)}</>;
  }
  return <>{cardInner}</>;
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

interface SidebarProps {
  logo: React.ReactNode;
  navGroups: DashboardNavGroup[];
  isOpen: boolean;
  onClose: () => void;
  onLogout?: () => void;
  renderLink: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;
  sidebarWidth: number;
  scheme: (typeof SCHEME_COLORS)[DashboardColorScheme];
  /** Optional doctor score card rendered below the logo on desktop only. */
  scoreCard?: DashboardScoreCardData;
}

function Sidebar({
  logo,
  navGroups,
  isOpen,
  onClose,
  onLogout,
  renderLink,
  sidebarWidth,
  scheme,
  scoreCard,
}: SidebarProps) {
  const [logoutHovered, setLogoutHovered] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <Box
          display={{ base: "block", md: "none" }}
          position="fixed"
          inset="0"
          zIndex="overlay"
          bg="blackAlpha.500"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <Box
        as="aside"
        aria-label="Main navigation"
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        w={`${sidebarWidth}px`}
        zIndex={{ base: "modal", md: "sticky" }}
        bg="bg"
        borderRight="1px solid"
        borderColor="border"
        display="flex"
        flexDirection="column"
        // Mobile: slide in/out
        transform={{
          base: isOpen ? "translateX(0)" : `translateX(-${sidebarWidth + 10}px)`,
          md: "translateX(0)",
        }}
        transition="transform 0.25s cubic-bezier(0.22,1,0.36,1)"
      >
        {/* ── Logo ── */}
        <Box
          px="5"
          pt="5"
          pb="4"
          flexShrink={0}
          borderBottom="1px solid"
          borderColor="border"
          display="flex"
          alignItems="center"
        >
          {logo}
        </Box>

        {/* ── Doctor score card (desktop only, optional) ── */}
        {scoreCard && (
          <Box
            display={{ base: "none", md: "block" }}
            flexShrink={0}
            pt="3"
          >
            <SidebarScoreCard data={scoreCard} renderLink={renderLink} />
          </Box>
        )}

        {/* ── Nav groups ── */}
        <Box flex="1" overflowY="auto" py="3" px="3">
          {navGroups.map((group, gi) => (
            <Box key={gi} mb="4">
              {group.groupLabel && (
                <Box
                  px="3"
                  pb="2"
                  pt={gi > 0 ? "2" : undefined}
                  fontSize="10px"
                  fontWeight="700"
                  letterSpacing="widest"
                  textTransform="uppercase"
                  color="text.muted"
                  fontFamily="var(--font-body)"
                >
                  {group.groupLabel}
                </Box>
              )}
              <Box display="flex" flexDirection="column" gap="0.5">
                {group.items.map((item) => (
                  <SidebarNavItem
                    key={item.href}
                    item={item}
                    renderLink={renderLink}
                    onClick={onClose}
                    scheme={scheme}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>

        {/* ── Logout ── */}
        <Box
          px="3"
          pb="4"
          pt="2"
          flexShrink={0}
          borderTop="1px solid"
          borderColor="border"
        >
          <Box
            as="button"
            display="flex"
            alignItems="center"
            gap="3"
            w="full"
            px="3"
            py="2.5"
            borderRadius="lg"
            border="none"
            bg="transparent"
            cursor="pointer"
            onMouseEnter={() => setLogoutHovered(true)}
            onMouseLeave={() => setLogoutHovered(false)}
            onClick={() => {
              onClose();
              onLogout?.();
            }}
            style={{
              background: logoutHovered ? RED_HOVER_BG : "transparent",
              color: RED,
              transition: "background 0.15s ease",
            }}
          >
            <Box flexShrink={0} style={{ color: RED }}>
              <LogoutIcon />
            </Box>
            <Box
              as="span"
              fontSize="sm"
              fontWeight="500"
              fontFamily="var(--font-body)"
              style={{ color: RED }}
            >
              Log out
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

// ─── TopBar ───────────────────────────────────────────────────────────────────

interface TopBarProps {
  user: DashboardUser;
  greeting: string;
  isSidebarOpen: boolean;
  onMenuToggle: () => void;
  sidebarWidth: number;
  topBarSlot?: React.ReactNode;
  dropdownItems?: DashboardDropdownItem[];
  onLogout?: () => void;
  scheme: (typeof SCHEME_COLORS)[DashboardColorScheme];
}

function TopBar({
  user,
  greeting,
  isSidebarOpen,
  onMenuToggle,
  sidebarWidth,
  topBarSlot,
  dropdownItems,
  onLogout,
  scheme,
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const menuButtonId = `user-menu-button-${uid}`;
  const menuDropdownId = `user-menu-dropdown-${uid}`;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Box
      as="header"
      role="banner"
      position="sticky"
      top="0"
      zIndex="docked"
      bg="bg"
      borderBottom="1px solid"
      borderColor="border"
      h="16"
      display="flex"
      alignItems="center"
      px={{ base: "4", md: "6" }}
      gap="4"
    >
      {/* Mobile hamburger */}
      <Box
        as="button"
        display={{ base: "flex", md: "none" }}
        alignItems="center"
        justifyContent="center"
        border="none"
        bg="transparent"
        p="1"
        cursor="pointer"
        color="text.body"
        borderRadius="md"
        _hover={{ bg: "bg.subtle" }}
        onClick={onMenuToggle}
        aria-label={isSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isSidebarOpen}
      >
        {isSidebarOpen ? <CloseMenuIcon /> : <MenuIcon />}
      </Box>

      {/* Greeting */}
      <Box flex="1">
        <Box
          as="p"
          fontSize={{ base: "sm", md: "md" }}
          fontWeight="700"
          fontFamily="var(--font-body)"
          color="text.heading"
        >
          {greeting},{" "}
          <Box as="span" fontWeight="700" color="text.heading">
            {user.name}
          </Box>
        </Box>
      </Box>

      {/* Optional right slot */}
      {topBarSlot}

      <ThemeToggleGroup scheme={scheme} />

      {/* User menu */}
      <Box position="relative" ref={dropdownRef}>
        <Box
          as="button"
          id={menuButtonId}
          display="flex"
          alignItems="center"
          gap="2"
          bg="transparent"
          border="none"
          cursor="pointer"
          borderRadius="full"
          p="1"
          _hover={{ bg: "bg.subtle" }}
          onClick={() => setDropdownOpen((o) => !o)}
          aria-haspopup="menu"
          aria-expanded={dropdownOpen}
          aria-controls={dropdownOpen ? menuDropdownId : undefined}
          aria-label="User menu"
        >
          <Avatar
            name={user.name}
            src={user.avatarSrc}
            size="sm"
          />
          <Box color="text.muted">
            <ChevronDownIcon open={dropdownOpen} />
          </Box>
        </Box>

        {/* Dropdown */}
        {dropdownOpen && (
          <Box
            role="menu"
            aria-labelledby={menuButtonId}
            id={menuDropdownId}
            position="absolute"
            top="calc(100% + 8px)"
            right="0"
            minW="200px"
            bg="bg"
            border="1px solid"
            borderColor="border"
            borderRadius="xl"
            boxShadow="0 8px 32px rgba(0,0,0,0.12)"
            zIndex="popover"
            overflow="hidden"
            py="1"
          >
            {/* Header */}
            <Box px="4" py="3" borderBottom="1px solid" borderColor="border">
              <Box
                fontSize="sm"
                fontWeight="700"
                color="text.heading"
                fontFamily="var(--font-body)"
              >
                {user.name}
              </Box>
              {user.email && (
                <Box
                  fontSize="xs"
                  color="text.muted"
                  fontFamily="var(--font-body)"
                  mt="0.5"
                >
                  {user.email}
                </Box>
              )}
            </Box>

            {/* Built-in items */}
            {!dropdownItems && (
              <>
                <DropdownItem
                  icon={<ProfileIcon />}
                  label="My Profile"
                  onClick={() => setDropdownOpen(false)}
                  scheme={scheme}
                />
                <DropdownItem
                  icon={<SettingsIcon />}
                  label="Settings"
                  onClick={() => setDropdownOpen(false)}
                  scheme={scheme}
                />
              </>
            )}

            {/* Custom items */}
            {dropdownItems?.map((di, i) => (
              <DropdownItem
                key={i}
                icon={di.icon}
                label={di.label}
                isDanger={di.isDanger}
                onClick={() => {
                  setDropdownOpen(false);
                  di.onClick?.();
                }}
                scheme={scheme}
              />
            ))}

            {/* Divider + logout */}
            <Box borderTop="1px solid" borderColor="border" my="1" />
            <DropdownItem
              icon={<LogoutIcon />}
              label="Log out"
              isDanger
              onClick={() => {
                setDropdownOpen(false);
                onLogout?.();
              }}
              scheme={scheme}
            />
          </Box>
        )}
      </Box>
    </Box>
  );
}

// ─── DropdownItem (internal helper) ──────────────────────────────────────────

function DropdownItem({
  icon,
  label,
  isDanger,
  onClick,
  scheme,
}: {
  icon?: React.ReactNode;
  label: string;
  isDanger?: boolean;
  onClick?: () => void;
  scheme: (typeof SCHEME_COLORS)[DashboardColorScheme];
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <Box
      as="button"
      role="menuitem"
      display="flex"
      alignItems="center"
      gap="2.5"
      w="full"
      px="4"
      py="2.5"
      border="none"
      bg="transparent"
      cursor="pointer"
      textAlign="left"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        background: hovered ? (isDanger ? RED_HOVER_BG : scheme.hoverBgLight) : "transparent",
        color: isDanger ? RED : undefined,
        transition: "background 0.12s ease",
      }}
    >
      {icon && (
        <Box flexShrink={0} style={{ color: isDanger ? RED : undefined }} color="text.muted">
          {icon}
        </Box>
      )}
      <Box
        as="span"
        fontSize="sm"
        fontWeight="500"
        fontFamily="var(--font-body)"
        style={{ color: isDanger ? RED : undefined }}
        color={isDanger ? undefined : "text.body"}
      >
        {label}
      </Box>
    </Box>
  );
}

// ─── DashboardLayout ──────────────────────────────────────────────────────────

/**
 * MedixDeck DashboardLayout
 *
 * A full-page authenticated shell with a fixed sidebar, sticky top bar, and
 * scrollable main content area. Fully responsive — the sidebar is hidden on
 * mobile and revealed via a hamburger toggle.
 *
 * ### Router integration
 * Pass `renderLink` to use your router's `<Link>` component without bringing
 * router dependencies into the library (mirrors the `Navbar` pattern).
 *
 * ### Active state
 * Set `isActive: true` on the `DashboardNavItem` that represents the current
 * route. The active item gets a blue left-accent bar and a tinted background
 * in both light and dark modes.
 *
 * @example
 * ```tsx
 * import { DashboardLayout } from "@medixdeck/ui";
 * import { Link, useLocation } from "react-router-dom";
 *
 * const NAV_GROUPS = [
 *   {
 *     items: [
 *       { label: "Home",     href: "/",        icon: <HomeIcon /> },
 *       { label: "Messages", href: "/messages", icon: <MsgIcon />, badge: 4 },
 *     ],
 *   },
 *   {
 *     groupLabel: "Account",
 *     items: [
 *       { label: "Profile", href: "/profile", icon: <ProfileIcon />, hasDot: true },
 *     ],
 *   },
 * ];
 *
 * export function Layout({ children }) {
 *   const { pathname } = useLocation();
 *
 *   const groups = NAV_GROUPS.map((g) => ({
 *     ...g,
 *     items: g.items.map((item) => ({
 *       ...item,
 *       isActive: item.href === "/" ? pathname === "/" : pathname.startsWith(item.href),
 *     })),
 *   }));
 *
 *   return (
 *     <DashboardLayout
 *       navGroups={groups}
 *       user={{ name: "Daniel", email: "daniel@medixdeck.com" }}
 *       onLogout={() => auth.signOut()}
 *       renderLink={(item, children) => <Link to={item.href}>{children}</Link>}
 *     >
 *       {children}
 *     </DashboardLayout>
 *   );
 * }
 * ```
 */
export function DashboardLayout({
  children,
  logo,
  navGroups,
  user,
  greeting,
  onLogout,
  renderLink = defaultRenderLink,
  dropdownItems,
  topBarSlot,
  sidebarWidth = 220,
  colorScheme = "blue",
  mobileNavItems,
  scoreCard,
  ...rest
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scheme = SCHEME_COLORS[colorScheme];
  const hasMobileNav = !!(mobileNavItems && mobileNavItems.length > 0);

  const resolvedGreeting = greeting ?? autoGreeting();
  const resolvedLogo = logo ?? <Logo variant={colorScheme} height={26} />;

  return (
    <Box
      display="flex"
      minH="100vh"
      bg="bg"
      {...rest}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        logo={resolvedLogo}
        navGroups={navGroups}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        renderLink={renderLink}
        sidebarWidth={sidebarWidth}
        scheme={scheme}
        scoreCard={scoreCard}
      />

      {/* ── Main content area (offset by sidebar width on desktop) ── */}
      <Box
        flex="1"
        display="flex"
        flexDirection="column"
        minW="0"
        ml={{ base: "0", md: `${sidebarWidth}px` }}
        transition="margin-left 0.25s cubic-bezier(0.22,1,0.36,1)"
      >
        {/* Top bar */}
        <TopBar
          user={user}
          greeting={resolvedGreeting}
          isSidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
          sidebarWidth={sidebarWidth}
          topBarSlot={topBarSlot}
          dropdownItems={dropdownItems}
          onLogout={onLogout}
          scheme={scheme}
        />

        {/* Page content */}
        <Box
          as="main"
          id="main-content"
          role="main"
          flex="1"
          overflowY="auto"
          bg="bg.subtle"
          p={{ base: "4", md: "6", lg: "8" }}
          // Add bottom padding on mobile when bottom nav is present so content
          // is never hidden behind the fixed bar (h=16 = 4rem, +1rem clearance)
          pb={hasMobileNav ? { base: "20", md: "6", lg: "8" } : { base: "4", md: "6", lg: "8" }}
        >
          {children}
        </Box>
      </Box>

      {/* ── Mobile bottom navigation ── */}
      {hasMobileNav && (
        <MobileBottomNav
          items={mobileNavItems!}
          renderLink={renderLink}
          scheme={scheme}
        />
      )}
    </Box>
  );
}

DashboardLayout.displayName = "MedixDashboardLayout";
