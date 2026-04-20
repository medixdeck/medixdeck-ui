"use client";

import React, { useState, useRef, useEffect } from "react";
import { Box, type BoxProps } from "@chakra-ui/react";
import { Logo } from "../primitive/Logo";
import { Avatar } from "../primitive/Avatar";

// ─── Brand colours (native-first pattern per AGENTS.md §15) ──────────────────

const BLUE = "#0685FF";
const BLUE_HOVER_BG_LIGHT = "rgba(6,133,255,0.08)";
const BLUE_HOVER_BG_DARK = "rgba(6,133,255,0.12)";
const BLUE_ACTIVE_BG_LIGHT = "rgba(6,133,255,0.10)";
const BLUE_ACTIVE_BG_DARK = "rgba(6,133,255,0.15)";
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
}

export interface DashboardNavGroup {
  /** Optional uppercase section heading (e.g. "Account"). */
  groupLabel?: string;
  /** Nav items belonging to this group. */
  items: DashboardNavItem[];
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

// ─── SidebarNavItem ───────────────────────────────────────────────────────────

function SidebarNavItem({
  item,
  renderLink: render,
  onClick,
}: {
  item: DashboardNavItem;
  renderLink: (item: DashboardNavItem, children: React.ReactNode) => React.ReactNode;
  onClick?: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const isActive = item.isActive ?? false;

  const content = (
    <Box
      display="flex"
      alignItems="center"
      gap="3"
      px="3"
      py="2.5"
      borderRadius="lg"
      borderLeftRadius="none"
      borderTopLeftRadius="none"
      borderBottomLeftRadius="none"
      position="relative"
      cursor="pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      style={{
        // Active: left accent bar + tinted bg
        background: isActive
          ? BLUE_ACTIVE_BG_LIGHT
          : hovered
            ? BLUE_HOVER_BG_LIGHT
            : "transparent",
        boxShadow: isActive ? `inset 3px 0 0 ${BLUE}` : undefined,
        transition: "background 0.15s ease, box-shadow 0.15s ease",
      }}
      // Dark mode overrides via data-theme
      _dark={{
        bg: isActive
          ? BLUE_ACTIVE_BG_DARK
          : hovered
          ? BLUE_HOVER_BG_DARK
          : "transparent",
      }}
    >
      {/* Icon */}
      {item.icon && (
        <Box
          flexShrink={0}
          style={{
            color: isActive ? BLUE : undefined,
            opacity: isActive ? 1 : hovered ? 0.85 : 0.6,
            transition: "color 0.15s ease, opacity 0.15s ease",
          }}
          color={isActive ? "blue.500" : "text.body"}
        >
          {item.icon}
        </Box>
      )}

      {/* Label */}
      <Box
        as="span"
        flex="1"
        fontSize="sm"
        fontWeight={isActive ? "600" : "500"}
        fontFamily="var(--font-body)"
        style={{
          color: isActive ? BLUE : undefined,
          transition: "color 0.15s ease",
        }}
        color={isActive ? "blue.500" : "text.body"}
      >
        {item.label}
      </Box>

      {/* Numeric badge */}
      {typeof item.badge === "number" && (
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
            background: BLUE,
            color: "#fff",
          }}
        >
          {item.badge}
        </Box>
      )}

      {/* Red dot badge */}
      {item.hasDot && (
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
    </Box>
  );

  return render(item, content);
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
}

function Sidebar({
  logo,
  navGroups,
  isOpen,
  onClose,
  onLogout,
  renderLink,
  sidebarWidth,
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
}: TopBarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
          fontWeight="500"
          fontFamily="var(--font-body)"
          color="text.body"
        >
          {greeting},{" "}
          <Box as="span" fontWeight="700" color="text.heading">
            {user.name}
          </Box>
        </Box>
      </Box>

      {/* Optional right slot */}
      {topBarSlot}

      {/* User menu */}
      <Box position="relative" ref={dropdownRef}>
        <Box
          as="button"
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
          aria-controls="user-dropdown-menu"
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
            id="user-dropdown-menu"
            role="menu"
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
                />
                <DropdownItem
                  icon={<SettingsIcon />}
                  label="Settings"
                  onClick={() => setDropdownOpen(false)}
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
}: {
  icon?: React.ReactNode;
  label: string;
  isDanger?: boolean;
  onClick?: () => void;
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
        background: hovered ? (isDanger ? RED_HOVER_BG : BLUE_HOVER_BG_LIGHT) : "transparent",
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
  ...rest
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const resolvedGreeting = greeting ?? autoGreeting();

  return (
    <Box
      display="flex"
      minH="100vh"
      bg="bg"
      {...rest}
    >
      {/* ── Sidebar ── */}
      <Sidebar
        logo={logo ?? <Logo height={26} />}
        navGroups={navGroups}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onLogout={onLogout}
        renderLink={renderLink}
        sidebarWidth={sidebarWidth}
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
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}

DashboardLayout.displayName = "MedixDashboardLayout";
