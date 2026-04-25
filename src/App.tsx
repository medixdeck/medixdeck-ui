"use client";
import React from "react";
import { Box, Link, Text } from "@chakra-ui/react";
import { useThemeMode } from "../lib";

const PREVIEW_COMPONENT_COUNT = 44;

// Primitives
import { Button } from "../lib/components/primitive/Button";
import { Badge } from "../lib/components/primitive/Badge";
import { Avatar, AvatarGroup } from "../lib/components/primitive/Avatar";
import { Tag } from "../lib/components/primitive/Tag";
import { Spinner } from "../lib/components/primitive/Spinner";
import { Divider } from "../lib/components/primitive/Divider";
import { Logo } from "../lib/components/primitive/Logo";

// Forms
import { Input, SearchInput } from "../lib/components/form/Input";
import { Textarea } from "../lib/components/form/Textarea";
import { Select } from "../lib/components/form/Select";
import { Checkbox, RadioGroup } from "../lib/components/form/CheckboxRadio";
import { Switch } from "../lib/components/form/Switch";
import { FormControl } from "../lib/components/form/FormControl";
import { OTPInput } from "../lib/components/form/OTPInput";
import { PhoneInput } from "../lib/components/form/PhoneInput";
import { DatePicker } from "../lib/components/form/DatePicker";
import { DateRangePicker } from "../lib/components/form/DateRangePicker";
import { Combobox } from "../lib/components/form/Combobox";
import { FileUpload } from "../lib/components/form/FileUpload";

// Layout
import { Card, CardHeader, CardBody, CardFooter } from "../lib/components/layout/Card";
import { StatCard } from "../lib/components/layout/StatCard";
import { Container, SectionHeader } from "../lib/components/layout/Container";
import { DashboardLayout } from "../lib/components/layout/DashboardLayout";

// Navigation
import { Navbar } from "../lib/components/navigation/Navbar";
import { Footer } from "../lib/components/layout/Footer";
import { Breadcrumb } from "../lib/components/navigation/Breadcrumb";
import { Tabs } from "../lib/components/navigation/Tabs";
import { Pagination } from "../lib/components/navigation/Pagination";
import { Stepper } from "../lib/components/navigation/Stepper";

// Feedback & Overlays
import { Alert } from "../lib/components/feedback/Alert";
import { Skeleton, SkeletonCard } from "../lib/components/feedback/Skeleton";
import { Progress } from "../lib/components/feedback/Progress";
import { Modal } from "../lib/components/feedback/Modal";
import { Drawer } from "../lib/components/feedback/Drawer";
import { Tooltip } from "../lib/components/feedback/Tooltip";
import { EmptyState } from "../lib/components/feedback/EmptyState";
import { Toaster, toast } from "../lib/components/feedback/Notification";

// Data Display
import { Accordion } from "../lib/components/data/Accordion";
import { TestimonialCard, BlogCard } from "../lib/components/data/Cards";
import { DataTable } from "../lib/components/data/DataTable";

// Healthcare
import { DoctorCard, VitalBadge, AppointmentCard } from "../lib/components/healthcare/DoctorCard";

// ─── Storybook base URL (from .env) ─────────────────────────────────────────
// @ts-expect-error unknown import error
const STORYBOOK_URL = import.meta.env.VITE_STORYBOOK_URL ?? "http://localhost:6006";

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ title, id, storybookPath, children }: {
  title: string;
  id: string;
  /** The Storybook story/docs path, e.g. "?path=/docs/primitives-button--docs" */
  storybookPath?: string;
  children: React.ReactNode;
}) {
  return (
    <Box as="section" mb="14" id={id} scrollMarginTop="80px">
      <Box
        display="flex"
        alignItems="center"
        gap="3"
        mb="6"
        pb="3"
        borderBottom="2px solid"
        borderColor="blue.500"
      >
        <Text
          as="h2"
          fontSize="xl"
          fontWeight="bold"
          color="text.heading"
          fontFamily="var(--font-heading)"
          flex="1"
        >
          {title}
        </Text>
        {storybookPath && (
          <a
            href={`${STORYBOOK_URL}/${storybookPath}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              fontFamily: "var(--font-body)",
              color: "#0685FF",
              background: "rgba(6,133,255,0.08)",
              border: "1px solid rgba(6,133,255,0.2)",
              borderRadius: 20,
              padding: "3px 10px",
              textDecoration: "none",
              whiteSpace: "nowrap",
              fontWeight: 500,
              letterSpacing: "0.01em",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            Storybook
          </a>
        )}
      </Box>
      <Box display="flex" flexWrap="wrap" gap="4" alignItems="flex-start">
        {children}
      </Box>
    </Box>
  );
}

function Chip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      style={{
        fontSize: 12,
        padding: "4px 12px",
        borderRadius: 20,
        border: "1px solid var(--chakra-colors-border, #E2E8F0)",
        color: "var(--chakra-colors-text-body, #374151)",
        textDecoration: "none",
        fontFamily: "var(--font-body)",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </a>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const { mounted, themeMode, themeSetting, setThemeMode, toggleThemeMode } = useThemeMode();
  const [showDashboard, setShowDashboard] = React.useState(false);
  const [page, setPage] = React.useState(3);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [otpValue, setOtpValue] = React.useState("");
  const [phoneValue, setPhoneValue] = React.useState("");
  const [appointmentDate, setAppointmentDate] = React.useState("");

  const patientRows = [
    { id: "1", name: "Ngozi Adeyemi", age: 34, specialty: "Cardiology", status: "Active", date: "Apr 18, 2026" },
    { id: "2", name: "Emeka Okafor", age: 52, specialty: "Neurology", status: "Pending", date: "Apr 17, 2026" },
    { id: "3", name: "Fatima Bello", age: 28, specialty: "Pediatrics", status: "Completed", date: "Apr 15, 2026" },
    { id: "4", name: "Chidi Eze", age: 45, specialty: "Psychiatry", status: "Active", date: "Apr 14, 2026" },
    { id: "5", name: "Amaka Igwe", age: 31, specialty: "Dermatology", status: "Cancelled", date: "Apr 12, 2026" },
  ];

  const statusColor: Record<string, string> = {
    Active: "#1B7A38",
    Pending: "#D97706",
    Completed: "#0685FF",
    Cancelled: "#DC2626",
  };

  if (showDashboard) {
    return (
      <DashboardLayout
        user={{ name: "Daniel", email: "daniel@medixdeck.com" }}
        navGroups={[
          {
            items: [
              { label: 'Home', href: '#home', isActive: true },
              { label: 'Consult', href: '#consult' },
              { label: 'Records', href: '#records' },
              { label: 'Messages', href: '#messages', badge: 6 },
            ]
          },
          {
            groupLabel: 'Account',
            items: [
              { label: 'Profile', href: '#profile' },
              { label: 'Notifications', href: '#notifications', hasDot: true },
            ]
          }
        ]}
      >
        <Box h="full">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap="4">
            <Box>
              <Text color="text.heading" fontWeight="600" fontSize="lg">Welcome to your dashboard</Text>
              <Text mt="1" color="text.body" fontSize="sm">This is the full-screen dashboard preview.</Text>
            </Box>
            <Button onClick={() => setShowDashboard(false)} variant="solid" colorScheme="blue">
              Exit Dashboard
            </Button>
          </Box>
          <Box mt="6" h="800px" bg="bg" borderRadius="card" border="1px dashed" borderColor="border" />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Toaster />

      {/* ── Navbar — default CTA pattern: [Talk to a doctor] [↗] ── */}
      <Navbar
        navItems={[
          { label: "Logo", href: "#logo" },
          { label: "Buttons", href: "#buttons" },
          { label: "Forms", href: "#forms" },
          { label: "Navigation", href: "#navigation" },
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

      {/* ── Main container ── */}
      <Box
        as="main"
        bg="bg"
        minH="100vh"
        pt="6"
        pb="24"
        transition="background 0.3s ease"
      >
        <Container maxWidth="xl">

          {/* ── Header ── */}
          <Box as="header" display="flex" justifyContent="space-between" alignItems="flex-start" mb="6" flexWrap="wrap" gap="4">
            <Box>
              <Text as="h1" fontSize="3xl" fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">
                <Link
                  href="https://www.npmjs.com/package/@medixdeck/ui"
                >
                  @medixdeck/ui
                </Link>
              </Text>
              <Text fontSize="md" color="text.muted" mt="1" fontFamily="var(--font-body)">
                Component Library Preview · v0.1.8 · {PREVIEW_COMPONENT_COUNT} components
              </Text>
              <Text fontSize="sm" color="text.muted" mt="2" fontFamily="var(--font-body)">
                Theme hooks: resolved <strong>{mounted ? themeMode : "light"}</strong> · preference{" "}
                <strong>{themeSetting ?? "system"}</strong>
              </Text>
            </Box>
            <Box display="flex" gap="3" alignItems="center" flexWrap="wrap">
              <Box display="flex" gap="2" alignItems="center" flexWrap="wrap">
                {(["light", "dark", "system"] as const).map((mode) => (
                  <Box
                    key={mode}
                    as="button"
                    onClick={() => setThemeMode(mode)}
                    px="3" py="2"
                    bg={themeSetting === mode ? "bg.subtle" : "bg.surface"}
                    color={themeSetting === mode ? "text.heading" : "text.body"}
                    borderRadius="md"
                    border="1px solid"
                    borderColor={themeSetting === mode ? "blue.500" : "border"}
                    fontSize="sm"
                    fontFamily="var(--font-body)"
                    cursor="pointer"
                    textTransform="capitalize"
                    _hover={{ borderColor: "blue.400" }}
                  >
                    {mode}
                  </Box>
                ))}
              </Box>
              <Box
                as="button"
                onClick={() => setModalOpen(true)}
                px="3" py="2"
                bg="bg.surface" color="text.body"
                borderRadius="md" border="1px solid" borderColor="border"
                fontSize="sm" fontFamily="var(--font-body)"
                cursor="pointer"
                _hover={{ borderColor: "blue.400" }}
              >
                Open Modal ↗
              </Box>
              <Box
                as="button"
                onClick={() => setDrawerOpen(true)}
                px="3" py="2"
                bg="bg.surface" color="text.body"
                borderRadius="md" border="1px solid" borderColor="border"
                fontSize="sm" fontFamily="var(--font-body)"
                cursor="pointer"
                _hover={{ borderColor: "blue.400" }}
              >
                Open Drawer ↗
              </Box>
              <Box
                as="button"
                onClick={toggleThemeMode}
                px="4" py="2"
                bg="blue.500" color="white"
                borderRadius="md" border="none"
                fontSize="sm" fontWeight="medium"
                cursor="pointer"
                fontFamily="var(--font-body)"
                _hover={{ bg: "blue.600" }}
              >
                {themeMode === "light" ? "🌙 Dark" : "☀️ Light"}
              </Box>
            </Box>
          </Box>

          {/* Quick-jump chips */}
          <Box display="flex" flexWrap="wrap" gap="2" mb="10">
            {[
              { href: "#logo", label: "Logo" },
              { href: "#buttons", label: "Buttons" },
              { href: "#primitives", label: "Primitives" },
              { href: "#forms", label: "Forms" },
              { href: "#otp", label: "OTP Input" },
              { href: "#phone", label: "Phone Input" },
              { href: "#datepicker", label: "Date Picker" },
              { href: "#layout", label: "Layout" },
              { href: "#navbar", label: "Navbar" },
              { href: "#navigation", label: "Tabs & More" },
              { href: "#feedback", label: "Feedback" },
              { href: "#notifications", label: "Notifications" },
              { href: "#drawer", label: "Drawer" },
              { href: "#datatable", label: "DataTable" },
              { href: "#healthcare", label: "Healthcare" },
            ].map((c) => <Chip key={c.href} {...c} />)}
          </Box>

          <Section title="Breadcrumb" id="breadcrumb">
            <Breadcrumb
              items={[{ label: "Home", href: "#" }, { label: "Components", href: "#" }, { label: "Preview" }]}
              mb="10"
            />
          </Section>

          {/* ────────────────────────────────────────────────────
              LOGO
          ──────────────────────────────────────────────────── */}
          <Section title="Logo" id="logo" storybookPath="?path=/docs/primitives-logo--docs">
            {/* Full variants */}
            <Box display="flex" flexDirection="column" gap="6" w="100%">
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Full logo — all color variants
                </Text>
                <Box display="flex" flexWrap="wrap" gap="6" alignItems="center">
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="blue" type="full" height={32} />
                  </Box>
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="purple" type="full" height={32} />
                  </Box>
                  <Box bg="#111926" p="4" borderRadius="card">
                    <Logo variant="white" type="full" height={32} />
                  </Box>
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="black" type="full" height={32} />
                  </Box>
                </Box>
              </Box>

              {/* Icon-only variants */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Icon-only — all color variants
                </Text>
                <Box display="flex" flexWrap="wrap" gap="4" alignItems="center">
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="blue" type="icon" height={40} />
                  </Box>
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="purple" type="icon" height={40} />
                  </Box>
                  <Box bg="#111926" p="4" borderRadius="card">
                    <Logo variant="white" type="icon" height={40} />
                  </Box>
                  <Box bg="bg.surface" p="4" borderRadius="card" border="1px solid" borderColor="border">
                    <Logo variant="black" type="icon" height={40} />
                  </Box>
                </Box>
              </Box>

              {/* Different sizes */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Sizes — full blue logo
                </Text>
                <Box display="flex" flexWrap="wrap" gap="6" alignItems="center">
                  <Logo variant="blue" height={20} />
                  <Logo variant="blue" height={28} />
                  <Logo variant="blue" height={36} />
                  <Logo variant="blue" height={48} />
                  <Logo variant="blue" height={64} />
                </Box>
              </Box>
            </Box>
          </Section>

          {/* ────────────────────────────────────────────────────
              NAVIGATION
          ──────────────────────────────────────────────────── */}

          {/* ── Navbar variants ── */}
          <Section title="Navbar" id="navbar">
            <Box w="100%" display="flex" flexDirection="column" gap="8">

              {/* 1 — href navigation */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="1"
                  textTransform="uppercase" letterSpacing="0.06em">1 — href navigation</Text>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3">
                  ctaHref="/consult" — both buttons act as standard anchor links (no JS handler needed).
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    navItems={[
                      { label: "Logo", href: "#logo" },
                      { label: "Buttons", href: "#buttons" },
                      { label: "Forms", href: "#forms" },
                      { label: "Navigation", href: "#navigation" },
                    ]}
                    ctaLabel="Talk to a doctor"
                    ctaHref="#"
                    position="relative"
                  />
                </Box>
              </Box>

              {/* 2 — click handler */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="1"
                  textTransform="uppercase" letterSpacing="0.06em">2 — click handlers (label + icon separate)</Text>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3">
                  onCtaClick opens a modal. onCtaIconClick opens the external app (different destination).
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    navItems={[
                      { label: "Logo", href: "#logo" },
                      { label: "Buttons", href: "#buttons" },
                      { label: "Forms", href: "#forms" },
                    ]}
                    ctaLabel="View on GitHub"
                    onCtaClick={() => window.open("https://github.com/medixdeck/medixdeck-ui", "_blank")}
                    ctaIconHref="https://github.com/medixdeck/medixdeck-ui"
                    onCtaIconClick={() => window.open("https://github.com/medixdeck/medixdeck-ui", "_blank")}
                    position="relative"
                  />
                </Box>
              </Box>

              {/* 3 — with secondary CTA */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="1"
                  textTransform="uppercase" letterSpacing="0.06em">3 — with secondary CTA</Text>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3">
                  secondaryCtaLabel + secondaryCtaHref + onSecondaryCtaClick — ghost "Sign In" to the left.
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    navItems={[
                      { label: "Logo", href: "#logo" },
                      { label: "Buttons", href: "#buttons" },
                      { label: "Forms", href: "#forms" },
                    ]}
                    ctaLabel="Talk to a doctor"
                    ctaHref="#"
                    secondaryCtaLabel="Sign In"
                    secondaryCtaHref="#"
                    onSecondaryCtaClick={() => alert("Sign In clicked")}
                    position="relative"
                  />
                </Box>
              </Box>

              {/* 4 — custom ctaSlot */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="1"
                  textTransform="uppercase" letterSpacing="0.06em">4 — custom ctaSlot (full control)</Text>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3">
                  Pass any ReactNode — replaces the default CTA area entirely.
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    navItems={[
                      { label: "Logo", href: "#logo" },
                      { label: "Buttons", href: "#buttons" },
                    ]}
                    ctaSlot={
                      <Box display="flex" gap="2" alignItems="center">
                        <Button variant="ghost" colorScheme="blue" size="sm"
                          onClick={() => alert("Sign In clicked")}>Sign In</Button>
                        <Button variant="solid" colorScheme="purple" size="sm"
                          onClick={() => alert("Get Started clicked")}
                          rightIcon={
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                          }
                        >
                          Get Started
                        </Button>
                      </Box>
                    }
                    position="relative"
                  />
                </Box>
              </Box>

              {/* Navbar with custom logo override */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Navbar default (no logo prop — auto Logo component)
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    navItems={[{ label: "Home", href: "#" }, { label: "About", href: "#" }]}
                    isSticky={false}
                    secondaryCtaLabel=""
                  />
                </Box>
              </Box>

              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Navbar with custom logo prop override
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
                  <Navbar
                    logo={<Logo variant="purple" height={28} />}
                    navItems={[{ label: "Home", href: "#" }, { label: "About", href: "#" }]}
                    isSticky={false}
                    secondaryCtaLabel=""
                  />
                </Box>
              </Box>

              {/* 5 — DashboardLayout Pattern */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="1"
                  textTransform="uppercase" letterSpacing="0.06em">Dashboard Layout Shell</Text>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3">
                  A responsive dashboard shell with a fixed sidebar, top bar, and main content area.
                </Text>
                <Box border="1px solid" borderColor="border" borderRadius="card" overflow="hidden" p="10" display="flex" alignItems="center" justifyContent="center">
                  <Button onClick={() => setShowDashboard(true)} variant="solid" colorScheme="purple">
                    Launch Full-Screen Dashboard Layout
                  </Button>
                </Box>
              </Box>

            </Box>

          </Section>

          {/* ────────────────────────────────────────────────────
              BUTTONS — comprehensive showcase
          ──────────────────────────────────────────────────── */}
          <Section title="Buttons" id="buttons" storybookPath="?path=/docs/primitives-button--docs">
            <Box display="flex" flexDirection="column" gap="8" w="100%">

              {/* Row label helper */}
              {/* ── Variants × default blue ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Variants — colorScheme="blue" (default)</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="solid" colorScheme="blue">Solid</Button>
                  <Button variant="outline" colorScheme="blue">Outline</Button>
                  <Button variant="ghost" colorScheme="blue">Ghost</Button>
                  <Button variant="secondary" colorScheme="blue">Secondary</Button>
                  <Button variant="link" colorScheme="blue">Link</Button>
                </Box>
              </Box>

              {/* ── Color schemes × solid ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Color schemes — variant="solid"</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="solid" colorScheme="blue">Blue (primary)</Button>
                  <Button variant="solid" colorScheme="purple">Purple (secondary)</Button>
                  <Button variant="solid" colorScheme="green">Green (success)</Button>
                  <Button variant="solid" colorScheme="red">Red (danger)</Button>
                  <Button variant="solid" colorScheme="amber">Amber (warning)</Button>
                </Box>
              </Box>

              {/* ── Color schemes × outline ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Color schemes — variant="outline"</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="outline" colorScheme="blue">Blue</Button>
                  <Button variant="outline" colorScheme="purple">Purple</Button>
                  <Button variant="outline" colorScheme="green">Green</Button>
                  <Button variant="outline" colorScheme="red">Red</Button>
                  <Button variant="outline" colorScheme="amber">Amber</Button>
                </Box>
              </Box>

              {/* ── Color schemes × ghost ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Color schemes — variant="ghost"</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="ghost" colorScheme="blue">Blue</Button>
                  <Button variant="ghost" colorScheme="purple">Purple</Button>
                  <Button variant="ghost" colorScheme="green">Green</Button>
                  <Button variant="ghost" colorScheme="red">Red</Button>
                  <Button variant="ghost" colorScheme="amber">Amber</Button>
                </Box>
              </Box>

              {/* ── Sizes ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Sizes — variant="solid" colorScheme="blue"</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="solid" colorScheme="blue" size="xs">XSmall</Button>
                  <Button variant="solid" colorScheme="blue" size="sm">Small</Button>
                  <Button variant="solid" colorScheme="blue" size="md">Medium (default)</Button>
                  <Button variant="solid" colorScheme="blue" size="lg">Large</Button>
                </Box>
              </Box>

              {/* ── With icons ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">With left / right icons</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  {/* Left icon */}
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    leftIcon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.86a16 16 0 0 0 6 6l.95-.95a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7a2 2 0 0 1 1.72 2.02z" /></svg>}
                  >
                    Book a Call
                  </Button>

                  {/* Right icon — matches the Navbar CTA pattern in the screenshot */}
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    rightIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" /></svg>}
                  >
                    Talk to a doctor
                  </Button>

                  {/* Icon-only — the square ↗ button from the Navbar screenshot */}
                  <Button
                    id="btn-icon-arrow"
                    variant="solid"
                    colorScheme="blue"
                    aria-label="Open link"
                    style={{ width: 40, height: 40, padding: 0, borderRadius: 8, flexShrink: 0 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Button>

                  {/* Outline + right icon */}
                  <Button
                    variant="outline"
                    colorScheme="purple"
                    rightIcon={<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>}
                  >
                    Learn More
                  </Button>
                </Box>
              </Box>

              {/* ── Navbar CTA pattern (label + icon-only beside it) ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">Navbar CTA pattern — label button + icon-only button</Text>
                <Box display="flex" gap="2" alignItems="center">
                  <Button variant="solid" colorScheme="blue" size="md">Talk to a doctor</Button>
                  <Button
                    variant="solid"
                    colorScheme="blue"
                    size="md"
                    aria-label="Open in new tab"
                    style={{ width: 40, height: 40, padding: 0, borderRadius: 8 }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="7" y1="17" x2="17" y2="7" /><polyline points="7 7 17 7 17 17" />
                    </svg>
                  </Button>
                </Box>
              </Box>

              {/* ── States ── */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3"
                  textTransform="uppercase" letterSpacing="0.06em">States</Text>
                <Box display="flex" flexWrap="wrap" gap="3" alignItems="center">
                  <Button variant="solid" colorScheme="blue" isLoading>Loading</Button>
                  <Button variant="outline" colorScheme="blue" isLoading>Loading</Button>
                  <Button variant="solid" colorScheme="blue" disabled>Disabled solid</Button>
                  <Button variant="outline" colorScheme="purple" disabled>Disabled outline</Button>
                  <Button variant="ghost" colorScheme="red" disabled>Disabled ghost</Button>
                </Box>
              </Box>

            </Box>
          </Section>

          {/* ────────────────────────────────────────────────────
              PRIMITIVES
          ──────────────────────────────────────────────────── */}

          <Section title="Badges & Tags" id="badges" storybookPath="?path=/docs/primitives-badge--docs">
            <Badge status="success">Verified</Badge>
            <Badge status="warning" variant="subtle">Pending</Badge>
            <Badge status="error" variant="solid">Cancelled</Badge>
            <Badge status="info">New</Badge>
            <Badge status="neutral" variant="outline">Draft</Badge>
            <Divider label="Tags" w="100%" />
            <Tag colorScheme="blue" variant="subtle">Cardiology</Tag>
            <Tag colorScheme="purple" variant="solid">Psychiatry</Tag>
            <Tag colorScheme="green" onClose={() => { }}>Pediatrics ×</Tag>
            <Tag colorScheme="gray" variant="outline">General Practice</Tag>
          </Section>

          <Section title="Avatars" id="avatars" storybookPath="?path=/docs/primitives-avatar--docs">
            <Avatar name="Dr. Amaka Okonkwo" size="xs" />
            <Avatar name="Dr. Tunde Bello" size="sm" />
            <Avatar name="Ngozi A." size="md" showStatus statusColor="green.500" />
            <Avatar name="Emeka O." size="lg" />
            <Avatar name="Dr. Fatima Hassan" size="xl" />
            <Divider label="AvatarGroup" w="100%" />
            <AvatarGroup max={3} size="md">
              <Avatar name="Dr. Amaka" />
              <Avatar name="Dr. Tunde" />
              <Avatar name="Ngozi" />
              <Avatar name="Emeka" />
              <Avatar name="Fatima" />
            </AvatarGroup>
          </Section>

          <Section title="Spinner" id="spinners">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" label="Fetching doctors…" />
            <Spinner size="lg" color="purple.500" />
          </Section>

          {/* ────────────────────────────────────────────────────
              FORMS
          ──────────────────────────────────────────────────── */}
          <Section title="Form Components" id="forms">
            <Box w="100%" display="flex" flexDirection="column" gap="4" maxW="500px">
              <FormControl label="Full Name" isRequired>
                <Input placeholder="Enter your full name" />
              </FormControl>
              <FormControl label="Email Address" errorMessage="Please enter a valid email.">
                <Input type="email" placeholder="you@example.com" isInvalid />
              </FormControl>
              <FormControl label="Search Doctors">
                <SearchInput placeholder="Search by name or specialty…" />
              </FormControl>
              <FormControl label="Specialty" helperText="Select your preferred medical specialty">
                <Select
                  placeholder="Select specialty"
                  options={[
                    { value: "cardiology", label: "Cardiology" },
                    { value: "pediatrics", label: "Pediatrics" },
                    { value: "neurology", label: "Neurology" },
                    { value: "psychiatry", label: "Psychiatry" },
                  ]}
                />
              </FormControl>
              <FormControl label="Hospital Branch">
                <Combobox
                  placeholder="Search branches..."
                  options={[
                    { value: "lagos-main", label: "Lagos Main Branch" },
                    { value: "lekki", label: "Lekki Phase 1 Clinic" },
                    { value: "ikeja", label: "Ikeja General" },
                    { value: "abuja", label: "Abuja Central" },
                    { value: "ph", label: "Port Harcourt Base" },
                  ]}
                />
              </FormControl>
              <FormControl label="Patient Notes">
                <Textarea placeholder="Describe your symptoms…" rows={3} maxLength={300} showCount />
              </FormControl>
              <Checkbox colorScheme="blue">I agree to share my medical records</Checkbox>
              <RadioGroup
                name="appointment-type"
                options={[
                  { value: "video", label: "Video Consultation", description: "From anywhere" },
                  { value: "in-person", label: "In-Person Visit", description: "At the clinic" },
                ]}
              />
              <Switch label="Email notifications" description="Get reminders for upcoming appointments" />
            </Box>
          </Section>

          {/* ── OTP Input ─ */}
          <Section title="OTP / Pin Input" id="otp" storybookPath="?path=/docs/form-otpinput--docs">
            <Box display="flex" flexDirection="column" gap="6">
              <OTPInput
                length={6}
                label="Enter verification code"
                helperText="We sent a 6-digit code to your phone"
                value={otpValue}
                onChange={setOtpValue}
                onComplete={(val) => console.log("OTP complete:", val)}
              />
              <OTPInput
                length={4}
                label="Enter PIN"
                mask
                isInvalid={otpValue.length > 0 && otpValue.length < 4}
                errorMessage="PIN must be 4 digits"
              />
            </Box>
          </Section>

          {/* ── Phone Input ── */}
          <Section title="Phone Input" id="phone" storybookPath="?path=/docs/form-phoneinput--docs">
            <Box maxW="380px" w="100%">
              <PhoneInput
                label="Phone number"
                placeholder="80 000 0000"
                defaultCountryCode="+234"
                value={phoneValue}
                onChange={setPhoneValue}
                helperText="We'll send your appointment confirmation here"
              />
            </Box>
          </Section>

          {/* ── Date Picker ── */}
          <Section title="Date Picker" id="datepicker" storybookPath="?path=/docs/form-datepicker--docs">
            <Box display="flex" flexDirection="column" gap="4" maxW="380px" w="100%">
              <DatePicker
                label="Appointment Date"
                value={appointmentDate}
                onChange={setAppointmentDate}
                min={new Date().toISOString().split("T")[0]}
                helperText="Select a future date"
              />
              <DatePicker
                label="Appointment Date & Time"
                includeTime
                helperText="Select date and time for your appointment"
              />

              <DateRangePicker
                label="Leave/Absence Period"
                startPlaceholder="Start Date"
                endPlaceholder="End Date"
                helperText="Select the start and end dates"
              />
            </Box>
          </Section>

          {/* ── File Upload ── */}
          <Section title="File Upload" id="upload" storybookPath="?path=/docs/form-fileupload--docs">
            <Box maxW="500px" w="100%">
              <FileUpload
                label="Medical Records & Scans"
                accept=".pdf, .png, .jpg"
                multiple
                maxSize={5 * 1024 * 1024} // 5MB
                helperText="Upload any necessary documents (Max 5MB each)"
                onChange={(files) => console.log("Files uploaded:", files)}
              />
            </Box>
          </Section>

          {/* ────────────────────────────────────────────────────
              LAYOUT
          ──────────────────────────────────────────────────── */}
          <Section title="Stat Cards" id="layout" storybookPath="?path=/docs/layout-statcard--docs">
            <StatCard value="25K+" label="Happy Patients" change={12.5} />
            <StatCard value="200+" label="Expert Doctors" change={-2} />
            <StatCard value="98%" label="Satisfaction Rate" trend="neutral" />
            <StatCard value="₦2.4B" label="Consultations" change={8.3} />
          </Section>

          <Section title="Cards" id="cards" storybookPath="?path=/docs/layout-card--docs">
            <Card w="300px">
              <CardHeader title="Patient Overview" subtitle="Last updated 2 hours ago" />
              <CardBody>
                <Text color="text.body" fontFamily="var(--font-body)" fontSize="sm">
                  Patient vitals checked and recorded. All readings are within acceptable range.
                </Text>
              </CardBody>
              <CardFooter justifyContent="flex-end">
                <Button size="sm" variant="outline">View Records</Button>
              </CardFooter>
            </Card>

            <Card w="300px" hoverable>
              <CardBody>
                <VitalBadge label="Blood Pressure" value="138/89" unit="mmHg" status="warning" mb="3" />
                <VitalBadge label="SpO₂" value="98%" unit="" status="normal" mb="3" />
                <VitalBadge label="Heart Rate" value="82" unit="bpm" status="normal" />
              </CardBody>
            </Card>
          </Section>

          <Section title="Section Header" id="sectionheader">
            <Box w="100%" maxW="600px">
              <SectionHeader
                eyebrow="Our Services"
                title="Healthcare Built Around You"
                description="Connect with MDCN-verified doctors in minutes. Get quality care from the comfort of your home."
                align="left"
              />
            </Box>
          </Section>

          {/* ── Notifications ── */}
          <Section title="Notifications & Toasts" id="notifications" storybookPath="?path=/docs/feedback-notification-toast--docs">
            <Box display="flex" flexWrap="wrap" gap="4">
              <Button
                variant="solid"
                colorScheme="blue"
                onClick={() => toast.success("Appointment Confirmed", { description: "Your booking for April 24 has been successfully scheduled." })}
              >
                Success Toast
              </Button>
              <Button
                variant="outline"
                colorScheme="blue"
                onClick={() => toast.info("New Message", { description: "You have a new message from Dr. Okonkwo." })}
              >
                Info Toast
              </Button>
              <Button
                variant="solid"
                colorScheme="black"
                onClick={() => toast.warning("Connection Unstable", { description: "Please check your internet connection and try again." })}
              >
                Warning Toast
              </Button>
              <Button
                variant="solid"
                colorScheme="red"
                onClick={() => toast.error("Booking Failed", { description: "The selected time slot is no longer available." })}
              >
                Error Toast
              </Button>
            </Box>
          </Section>

          <Section title="Tabs" id="navigation" storybookPath="?path=/docs/navigation-tabs--docs">
            <Box w="100%">
              <Tabs
                tabs={[
                  { id: "overview", label: "Overview", content: <Box p="2" color="text.body" fontFamily="var(--font-body)">Patient overview content…</Box> },
                  { id: "records", label: "Records", badge: "3", content: <Box p="2" color="text.body">Medical records…</Box> },
                  { id: "appointments", label: "Appointments", content: <Box p="2" color="text.body">Upcoming appointments…</Box> },
                ]}
              />
            </Box>
            <Box w="100%" mt="4">
              <Tabs
                variant="pill"
                tabs={[
                  { id: "patients", label: "Patients" },
                  { id: "doctors", label: "Doctors" },
                  { id: "admins", label: "Admins" },
                ]}
              />
            </Box>
          </Section>

          <Section title="Stepper" id="stepper" storybookPath="?path=/docs/navigation-stepper--docs">
            <Box w="100%" display="flex" flexDirection="column" gap="6">

              {/* Booking flow — step 2 active (step 1 done) */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Appointment Booking — Step 2 of 4
                </Text>
                <Stepper
                  steps={[
                    { id: 1, title: "Verified" },
                    { id: 2, title: "Personal Info" },
                    { id: 3, title: "Health Info" },
                    { id: 4, title: "Confirm" },
                  ]}
                  currentStep={2}
                />
              </Box>

              {/* Registration flow — step 3 active */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Registration — Step 3 of 4
                </Text>
                <Stepper
                  steps={[
                    { id: 1, title: "Account" },
                    { id: 2, title: "Profile" },
                    { id: 3, title: "Verification" },
                    { id: 4, title: "Done" },
                  ]}
                  currentStep={3}
                />
              </Box>

              {/* Purple variant */}
              <Box>
                <Text fontSize="xs" color="text.muted" fontFamily="var(--font-body)" mb="3" textTransform="uppercase" letterSpacing="0.06em">
                  Purple — Step 1 of 3 (active)
                </Text>
                <Stepper
                  steps={[
                    { id: 1, title: "Find Doctor" },
                    { id: 2, title: "Book Slot" },
                    { id: 3, title: "Confirm" },
                  ]}
                  currentStep={1}
                  colorScheme="purple"
                />
              </Box>

            </Box>
          </Section>

          <Section title="Pagination" id="pagination" storybookPath="?path=/docs/navigation-pagination--docs">
            <Pagination total={245} pageSize={10} currentPage={page} onChange={setPage} />
            <Pagination total={50} pageSize={10} currentPage={2} compact />
          </Section>

          {/* ────────────────────────────────────────────────────
              FEEDBACK
          ──────────────────────────────────────────────────── */}
          <Section title="Alerts" id="feedback" storybookPath="?path=/docs/feedback-alert--docs">
            <Alert status="success" title="Appointment confirmed!" description="Dr. Okonkwo will see you at 2:00 PM today." closable w="400px" />
            <Alert status="warning" title="Incomplete profile" description="Please complete your medical history." w="400px" />
            <Alert status="error" title="Payment failed" description="Your card was declined. Please try another method." closable w="400px" />
            <Alert status="info" variant="left-accent" title="New feature" description="Video consultations are now available 24/7." w="400px" />
          </Section>

          <Section title="Tooltip" id="tooltip" storybookPath="?path=/docs/feedback-tooltip--docs">
            <Tooltip label="MDCN Verified — This doctor is licensed and verified">
              <Button variant="outline" colorScheme="blue">Hover me</Button>
            </Tooltip>
            <Tooltip label="Copy patient ID" placement="bottom">
              <Button variant="ghost" colorScheme="blue">📋 Copy ID</Button>
            </Tooltip>
          </Section>

          <Section title="Skeleton Loading" id="skeleton" storybookPath="?path=/docs/feedback-skeleton--docs">
            <SkeletonCard w="280px" />
            <Box w="280px" p="4" bg="bg.surface" border="1px solid" borderColor="border" borderRadius="card">
              <Skeleton h="4" w="60%" borderRadius="full" mb="3" />
              <Skeleton h="3" w="100%" borderRadius="full" mb="2" />
              <Skeleton h="3" w="80%" borderRadius="full" mb="2" />
              <Skeleton h="3" w="45%" borderRadius="full" />
            </Box>
          </Section>

          <Section title="Progress" id="progress" storybookPath="?path=/docs/feedback-progress--docs">
            <Box w="100%" display="flex" flexDirection="column" gap="4">
              <Progress value={75} colorScheme="blue" size="md" showLabel />
              <Progress value={45} colorScheme="purple" size="sm" />
              <Progress value={90} colorScheme="green" size="lg" />
              <Progress value={0} isIndeterminate colorScheme="blue" size="md" />
            </Box>
          </Section>

          {/* ── Modal & Drawer triggers ── */}
          <Section title="Modal & Drawer" id="drawer" storybookPath="?path=/docs/feedback-modal--docs">
            <Box display="flex" gap="3" flexWrap="wrap">
              <Button variant="solid" onClick={() => setModalOpen(true)}>Open Modal</Button>
              <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Right Drawer</Button>
            </Box>
          </Section>

          <Section title="Empty State" id="emptystate" storybookPath="?path=/docs/feedback-emptystate--docs">
            <Box w="100%" bg="bg.surface" border="1px solid" borderColor="border" borderRadius="card">
              <EmptyState
                icon="📋"
                title="No appointments scheduled"
                description="You don't have any upcoming appointments. Book a consultation with one of our licensed doctors."
                actionLabel="Find a Doctor"
                secondaryLabel="Learn how it works"
              />
            </Box>
          </Section>

          {/* ────────────────────────────────────────────────────
              DATA
          ──────────────────────────────────────────────────── */}
          <Section title="DataTable" id="datatable">
            <Box w="100%">
              <DataTable
                caption="Patient records"
                columns={[
                  { key: "name", label: "Patient Name", sortable: true, minWidth: "160px" },
                  { key: "age", label: "Age", sortable: true, align: "center" },
                  { key: "specialty", label: "Specialty", sortable: true },
                  {
                    key: "status",
                    label: "Status",
                    render: (val) => (
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: 20,
                          fontSize: 12,
                          fontWeight: 600,
                          background: `${statusColor[val as string]}18`,
                          color: statusColor[val as string] ?? "#374151",
                          fontFamily: "var(--font-body)",
                        }}
                      >
                        {String(val)}
                      </span>
                    ),
                  },
                  { key: "date", label: "Date", sortable: true },
                ]}
                data={patientRows}
                rowKey="id"
                striped
                onRowClick={(row) => alert(`Patient: ${row.name}`)}
              />
            </Box>
          </Section>

          <Section title="Accordion / FAQ" id="accordion" storybookPath="?path=/docs/data-accordion--docs">
            <Box w="100%" maxW="640px">
              <Accordion
                items={[
                  { id: "q1", question: "What is MedixDeck?", answer: "MedixDeck is a digital health platform that connects patients with licensed Nigerian doctors for video and in-person consultations." },
                  { id: "q2", question: "Are the doctors on MedixDeck qualified?", answer: "Yes. Every doctor on MedixDeck is MDCN (Medical and Dental Council of Nigeria) verified before being listed on the platform." },
                  { id: "q3", question: "What do I need to get started?", answer: "Simply create an account, complete your health profile, and you can begin searching for doctors immediately — no waitlist." },
                  { id: "q4", question: "Is my medical data safe?", answer: "Absolutely. MedixDeck uses end-to-end encryption and complies with Nigerian data protection regulations (NDPR) to keep your health data private." },
                ]}
              />
            </Box>
          </Section>

          {/* ────────────────────────────────────────────────────
              HEALTHCARE
          ──────────────────────────────────────────────────── */}
          <Section title="Doctor Cards" id="healthcare" storybookPath="?path=/docs/healthcare-doctorcard--docs">
            <DoctorCard
              name="Dr. Amaka Okonkwo"
              specialty="Cardiologist"
              location="Lagos, Nigeria"
              rating={4.9}
              reviewCount={128}
              consultationFee="₦5,000"
              isVerified
              isAvailable
              onBookClick={() => alert("Booking!")}
              onViewClick={() => alert("View profile")}
              w="300px"
            />
            <DoctorCard
              name="Dr. Emmanuel Ibrahim"
              specialty="Pediatrician"
              rating={4.7}
              reviewCount={89}
              consultationFee="₦3,500"
              isVerified
              w="300px"
            />
          </Section>

          <Section title="Appointment Cards" id="appointments" storybookPath="?path=/docs/healthcare-doctorcard--docs">
            <AppointmentCard
              doctorName="Dr. Amaka Okonkwo"
              doctorSpecialty="Cardiologist"
              date="Monday, 21 April 2026"
              time="2:00 PM – 2:30 PM"
              type="video"
              status="upcoming"
              onJoin={() => alert("Joining call…")}
              onReschedule={() => alert("Rescheduling…")}
              onCancel={() => alert("Cancelling…")}
              w="400px"
            />
            <AppointmentCard
              doctorName="Dr. Emmanuel Ibrahim"
              doctorSpecialty="Pediatrician"
              date="Friday, 11 April 2026"
              time="10:00 AM"
              type="in-person"
              status="completed"
              w="400px"
            />
          </Section>

          <Section title="Vital Badges" id="vitals" storybookPath="?path=/docs/healthcare-doctorcard--docs">
            <VitalBadge label="Blood Pressure" value="138/89" unit="mmHg" status="warning" />
            <VitalBadge label="SpO₂" value="98%" unit="" status="normal" />
            <VitalBadge label="Heart Rate" value="105" unit="bpm" status="critical" />
            <VitalBadge label="Temperature" value="36.6" unit="°C" status="normal" />
          </Section>

          <Section title="Testimonial Cards" id="testimonials">
            {[
              { name: "Rachael Ayo", title: "Patient", quote: "Getting medical help used to be incredibly stressful. Now I can consult with a qualified doctor in minutes.", rating: 5 },
              { name: "Dr. H. Adeyemi", title: "Family Practitioner", quote: "MedixDeck simplifies everything from patient summaries to prescriptions. I can focus on healing, not paperwork.", rating: 5 },
              { name: "Omoye D.", title: "Diabetic Patient", quote: "What stood out for me is the follow-up system. My doctor didn't just treat me — they kept checking in.", rating: 4 },
            ].map((t) => (
              <TestimonialCard key={t.name} authorName={t.name} authorTitle={t.title} quote={t.quote} rating={t.rating} w="280px" />
            ))}
          </Section>

          <Section title="Blog Cards" id="blog">
            {[
              { title: "Recognizing Critical Moments: Key Indicators for Emergency Room Visits", date: "2025-11-20" },
              { title: "How to Choose the Right Specialist for Your Condition", date: "2025-11-18" },
              { title: "5 Signs You Should See a Doctor Today", date: "2025-11-15" },
            ].map((item, i) => (
              <BlogCard
                key={i}
                coverImage="https://healthcareoffers.in/wp-content/uploads/2025/09/Blog-Posting-on-Healthcare-1280x669.jpg"
                title={item.title}
                excerpt="Learn key signs and symptoms that warrant immediate medical attention, plus tips on navigating Nigeria's healthcare options effectively."
                category="Medical Support"
                date={item.date}
                w="280px"
              />
            ))}
          </Section>

          {/* Footer Showcase */}
          <Section title="Footer" id="footer" storybookPath="?path=/docs/layout-footer--docs">
            <Box w="100%" border="1px solid" borderColor="border" borderRadius="card" overflow="hidden">
              <Footer />
            </Box>
          </Section>

          {/* Actual Site Footer */}
          <Footer mt={16} />
        </Container>
      </Box>

      {/* Footer */}
      <Box as="footer" mt="16" pt="8" borderTop="1px solid" borderColor="border" textAlign="center">
        <Text fontSize="sm" color="text.muted" fontFamily="var(--font-body)">
          <Link href="https://x.com/medixdeck">@medixdeck/ui</Link> · v0.1.8 · Built with Chakra UI v3 + Vite · Satoshi font · {PREVIEW_COMPONENT_COUNT} components · With ⚡ by <Link href="https://x.com/eunit99">Eunit</Link>
        </Text>
      </Box>

      {/* ── Modal ── */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Book an Appointment"
        description="Fill in your details to schedule a consultation with a licensed doctor."
        footer={
          <>
            <Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button variant="solid" colorScheme="blue" onClick={() => setModalOpen(false)}>Confirm Booking</Button>
          </>
        }
      >
        <Box display="flex" flexDirection="column" gap="4">
          <FormControl label="Full Name" isRequired>
            <Input placeholder="Enter your name" />
          </FormControl>
          <FormControl label="Appointment Date">
            <DatePicker helperText="Select a future date" min={new Date().toISOString().split("T")[0]} />
          </FormControl>
          <FormControl label="Specialty">
            <Select placeholder="Select specialty" options={[{ value: "cardiology", label: "Cardiology" }, { value: "pediatrics", label: "Pediatrics" }]} />
          </FormControl>
        </Box>
      </Modal>

      {/* ── Drawer ── */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title="Patient Details"
        placement="right"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDrawerOpen(false)}>Close</Button>
            <Button variant="solid" colorScheme="blue">Save Changes</Button>
          </>
        }
      >
        <Box display="flex" flexDirection="column" gap="4">
          <Avatar name="Ngozi Adeyemi" size="xl" showStatus statusColor="green.500" />
          <Box>
            <Text fontWeight="bold" color="text.heading" fontFamily="var(--font-heading)">Ngozi Adeyemi</Text>
            <Text fontSize="sm" color="text.muted" fontFamily="var(--font-body)">Patient ID: MX-2026-0047</Text>
          </Box>
          <Divider />
          <VitalBadge label="Blood Pressure" value="120/80" unit="mmHg" status="normal" />
          <VitalBadge label="Heart Rate" value="72" unit="bpm" status="normal" />
          <VitalBadge label="SpO₂" value="97%" unit="" status="normal" />
          <Divider label="Upcoming Appointments" />
          <AppointmentCard
            doctorName="Dr. Okonkwo"
            doctorSpecialty="Cardiologist"
            date="Apr 21, 2026"
            time="2:00 PM"
            type="video"
            status="upcoming"
          />
        </Box>
      </Drawer>
    </>
  );
}
