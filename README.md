# @medixdeck/ui

> Shared React UI component library for MedixDeck, published as `@medixdeck/ui`.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-v3-teal)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

`@medixdeck/ui` is a Vite library-mode package built with React 18, TypeScript 5, Chakra UI v3, semantic design tokens, and dual ESM/CJS output for npm publishing.

## Install

```bash
npm install @medixdeck/ui @chakra-ui/react react react-dom
```

## Quick start

```tsx
import {
  Button,
  Logo,
  MedixProvider,
  Navbar,
  useThemeMode,
} from "@medixdeck/ui";

// Next.js App Router: mark this component "use client" when using hooks.
function ThemeToggle() {
  const { mounted, themeMode, toggleThemeMode } = useThemeMode();

  // Avoid hydration mismatch: next-themes resolves the theme after mount.
  if (!mounted) return null;

  return (
    <Button variant="solid" colorScheme="blue" onClick={toggleThemeMode}>
      Switch to {themeMode === "dark" ? "light" : "dark"} mode
    </Button>
  );
}

export function App() {
  return (
    <MedixProvider defaultColorMode="light">
      <Navbar
        navItems={[{ label: "Docs", href: "#docs" }]}
        ctaLabel="Talk to a Doctor"
        ctaHref="/consult"
      />
      <ThemeToggle />
      <Logo variant="purple" height={28} />
    </MedixProvider>
  );
}
```

## Public API index

| Area | Exports |
| --- | --- |
| Provider + theme | `MedixProvider`, `useThemeMode`, `useIsDarkMode`, `useColorScheme`, `system`, `medixConfig`, token exports |
| Primitive | `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`, `Spinner`, `FullPageSpinner`, `Tag`, `Divider`, `Logo` |
| Form | `Input`, `SearchInput`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormControl`, `OTPInput`, `PinInput`, `PhoneInput`, `DatePicker`, `DateRangePicker`, `Calendar`, `Combobox`, `FileUpload` |
| Layout | `Card`, `CardHeader`, `CardBody`, `CardFooter`, `StatCard`, `Container`, `SectionHeader`, `ThemeColorPalette`, `DashboardLayout`, `Footer` |
| Navigation | `Navbar`, `Breadcrumb`, `Tabs`, `Pagination`, `Stepper` |
| Feedback | `Alert`, `Skeleton`, `SkeletonText`, `SkeletonCard`, `Progress`, `Modal`, `Drawer`, `Tooltip`, `EmptyState`, `Toaster`, `toast`, `dismissToast`, `CookieConsentBanner` |
| Data display | `Accordion`, `TestimonialCard`, `BlogCard`, `DataTable` |
| Healthcare | `DoctorCard`, `VitalBadge`, `AppointmentCard` |
| Chakra re-exports | `Box`, `Flex`, `Grid`, `Stack`, `Text`, `Heading`, `Link`, `Image`, `Icon`, `Center`, `Wrap`, `WrapItem`, others in `lib/index.ts` |

## Design-system rules

- Use Chakra UI **v3** APIs only.
- All library source lives in `lib\`; `src\` is dev-preview only.
- Use semantic tokens such as `bg.surface`, `text.heading`, and `border` instead of raw hex for normal component styling.
- For color-critical interactive controls, prefer the repo's native-first pattern instead of Chakra recipes.
- Apply dark mode on `document.documentElement`, not an inner container.

## Theme hooks

```tsx
import { useIsDarkMode, useThemeMode } from "@medixdeck/ui";

function ThemeStatus() {
  const { themeMode, themeSetting, setThemeMode, toggleThemeMode } = useThemeMode();
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <p>Resolved mode: {themeMode}</p>
      <p>Following: {themeSetting ?? "system"}</p>
      <p>Dark mode active: {String(isDarkMode)}</p>
      <button onClick={() => setThemeMode("dark")}>Dark</button>
      <button onClick={() => setThemeMode("light")}>Light</button>
      <button onClick={() => setThemeMode("system")}>System</button>
      <button onClick={toggleThemeMode}>Toggle</button>
    </>
  );
}
```

## Color scheme theming

Five components — `Navbar`, `Footer`, `Accordion`, `BlogCard`, and `DashboardLayout` — accept a `colorScheme` prop that switches every brand accent between MedixDeck blue (`#0685FF`) and purple (`#7700CC`).

```tsx
import {
  Navbar,
  Footer,
  Accordion,
  BlogCard,
  DashboardLayout,
} from "@medixdeck/ui";

<Navbar          colorScheme="purple" navItems={[...]} ctaLabel="Talk to a Doctor" />
<Footer          colorScheme="purple" />
<Accordion       colorScheme="purple" items={[...]} />
<BlogCard        colorScheme="purple" title="..." />
<DashboardLayout colorScheme="purple">{/* ... */}</DashboardLayout>
```

Use the `useColorScheme` hook to manage the active scheme in state and keep multiple components in sync:

```tsx
import { useColorScheme, Navbar, Footer, Accordion } from "@medixdeck/ui";

function Page() {
  const { colorScheme, toggleColorScheme } = useColorScheme(); // defaults to "blue"

  return (
    <>
      <button onClick={toggleColorScheme}>
        Switch to {colorScheme === "blue" ? "purple" : "blue"}
      </button>
      <Navbar    colorScheme={colorScheme} navItems={[...]} />
      <Accordion colorScheme={colorScheme} items={[...]} />
      <Footer    colorScheme={colorScheme} />
    </>
  );
}
```

`useColorScheme(initialScheme?)` returns:

| Field | Type | Description |
| --- | --- | --- |
| `colorScheme` | `"blue" \| "purple"` | Currently active scheme |
| `setColorScheme` | `(scheme) => void` | Explicit setter |
| `toggleColorScheme` | `() => void` | Flips blue ↔ purple |
| `isBlue` | `boolean` | `true` when scheme is `"blue"` |
| `isPurple` | `boolean` | `true` when scheme is `"purple"` |

## DashboardLayout

The full-screen authenticated application shell. Renders a fixed sidebar, sticky top bar, and an optional mobile bottom nav.

### Basic usage

```tsx
import { DashboardLayout } from "@medixdeck/ui";

<DashboardLayout
  colorScheme="purple"
  user={{ name: "Dr. Okedi Williams", email: "williams@medixdeck.com" }}
  navGroups={[
    {
      items: [
        { label: "Home",     href: "/",         isActive: true },
        { label: "Messages", href: "/messages", badge: 6 },
      ],
    },
    {
      groupLabel: "Account",
      items: [
        { label: "Profile",       href: "/profile" },
        { label: "Notifications", href: "/notifications", hasDot: true },
      ],
    },
  ]}
  onLogout={() => auth.signOut()}
  renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
>
  {/* page content */}
</DashboardLayout>
```

### Mobile bottom navigation (`mobileNavItems`)

A fixed bottom tab bar (mobile only, hidden on `md+`). Uses `react-icons/lu` or any icon component.

```tsx
import { LuHouse, LuMessageCircle, LuUser } from "react-icons/lu";

<DashboardLayout
  mobileNavItems={[
    { label: "Home",     href: "/",         icon: <LuHouse size={22} />,         isActive: true },
    { label: "Messages", href: "/messages", icon: <LuMessageCircle size={22} />, badge: 6 },
    { label: "Profile",  href: "/profile",  icon: <LuUser size={22} /> },
  ]}
>
  {/* ... */}
</DashboardLayout>
```

`DashboardMobileNavItem` props:

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `label` | `string` | ✓ | Text below the icon |
| `href` | `string` | ✓ | Unique key + navigation target |
| `icon` | `ReactNode` | ✓ | Icon (22 × 22 px recommended) |
| `isActive` | `boolean` | — | Highlights the active tab |
| `badge` | `number` | — | Count bubble on icon (capped at `99+`) |

### Doctor score card (`scoreCard`)

Shown above the sidebar nav on **desktop only**. Only pass this prop for doctor-role users.

```tsx
<DashboardLayout
  scoreCard={{
    name: "Dr. Okedi Williams",
    role: "Cardiologist",
    avatarSrc: "/dr-okedi.jpg",   // optional — initials fallback
    tier: "gold",                  // "bronze" | "silver" | "gold" | "platinum" | "diamond"
    medixScore: 847,
    link: "/doctor/profile",       // optional — makes the card clickable
  }}
>
  {/* ... */}
</DashboardLayout>
```

Tier colours:

| Tier | Label colour | Avatar ring |
| --- | --- | --- |
| `bronze` | `#92400E` | `#D97706` |
| `silver` | `#475569` | `#94A3B8` |
| `gold` | `#D97706` | `#F59E0B` |
| `platinum` | `#0284C7` | `#38BDF8` |
| `diamond` | `#7C3AED` | `#A78BFA` |

### Greeting subtitle (`greetingSubtext`)

An optional second line below the greeting. The top bar expands from 64 px → 80 px automatically.

```tsx
<DashboardLayout
  greetingSubtext={`${new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  })} · 8 consultations scheduled today`}
>
  {/* ... */}
</DashboardLayout>
```

### All `DashboardLayout` props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `user` | `DashboardUser` | — | Name, email, optional avatar |
| `navGroups` | `DashboardNavGroup[]` | — | Sidebar navigation tree |
| `colorScheme` | `"blue" \| "purple"` | `"blue"` | Brand accent colour |
| `logo` | `ReactNode` | `<Logo />` | Override the sidebar logo |
| `greeting` | `string` | auto | Override "Good morning / afternoon / evening" |
| `greetingSubtext` | `string` | — | Subtitle line below the greeting |
| `mobileNavItems` | `DashboardMobileNavItem[]` | — | Mobile bottom tab bar items |
| `scoreCard` | `DashboardScoreCardData` | — | Doctor identity card (desktop only) |
| `topBarSlot` | `ReactNode` | — | Slot right of greeting (search, bell, etc.) |
| `dropdownItems` | `DashboardDropdownItem[]` | — | Extra user dropdown items |
| `sidebarWidth` | `number` | `220` | Sidebar width in px |
| `renderLink` | `(item, children) => ReactNode` | `<a>` | Router integration |
| `onLogout` | `() => void` | — | Logout callback |

## Footer

The `Footer` component provides the core navigation layout for the bottom of pages. It features an optional compliance `certifications` row and a brandable `colorScheme`.

```tsx
import { Footer } from "@medixdeck/ui";

<Footer
  colorScheme="purple"
  certifications={[
    { name: "NDPR Compliant", href: "https://nitda.gov.ng" },
    { name: "MDCN Certified Platform", href: "https://mdcn.gov.ng" },
    { name: "ISO 27001", href: "#" },
  ]}
/>
```

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colorScheme` | `"blue" \| "purple"` | `"blue"` | Brand accent colour for links and social icons |
| `certifications` | `FooterCertification[]` | — | Compliance badges displayed above the copyright |
| `logo` | `ReactNode` | `<Logo />` | Override the default logo |
| `description` | `string` | — | Short company bio |
| `sections` | `FooterSection[]` | — | Link columns |
| `socialLinks` | `SocialLink[]` | — | Social media URLs |
| `newsletter` | `NewsletterProps` | — | Email subscription form config |
| `bottomLinks` | `BottomLink[]` | — | Terms/Privacy links next to copyright |
| `renderLink` | `(item, children) => ReactNode` | `<a>` | Router integration |

## Theme color reference


```tsx
import { ThemeColorPalette } from "@medixdeck/ui";

export function DesignTokensPage() {
  return <ThemeColorPalette mt="8" />;
}
```

`ThemeColorPalette` renders the semantic design tokens side by side for light and dark mode, then lists the raw brand, status, and neutral scales that power the theme.

## Repository index

```txt
lib\                         library source and npm entrypoint
src\                         local showcase app only
.github\workflows\publish.yml npm publish workflow
AGENTS.md                    full multi-agent repo guide
COPILOT.md                   concise AI contributor guide
.github\copilot-instructions.md GitHub Copilot repo instructions
CONTRIBUTING.md              contributor workflow
CHANGELOG.md                 release history
LICENSE                      package license
package.json                 npm metadata and scripts
```

## Development commands

```bash
npm run dev
npm run build
npm run test
npm run pack:check
```

## Publishing notes

- The package publishes from `dist\` with ESM, CJS, sourcemaps, and `.d.ts` declarations.
- Public API changes must stay in sync across `lib\index.ts`, `README.md`, `src\App.tsx`, Storybook stories, and `CHANGELOG.md`.
- The GitHub Actions workflow installs dependencies, runs build and test checks, performs `npm pack --dry-run`, and then publishes to npm.

## Project structure

```txt
medixdeck-ui\
├── lib\
│   ├── index.ts
│   ├── theme\
│   └── components\
│       ├── provider\
│       ├── primitive\
│       ├── form\
│       ├── layout\
│       ├── navigation\
│       ├── feedback\
│       ├── data\
│       └── healthcare\
├── src\
├── .github\
│   ├── copilot-instructions.md
│   └── workflows\publish.yml
├── AGENTS.md
├── COPILOT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── LICENSE
├── package.json
├── vite.config.ts
├── vitest.config.ts
└── tsconfig.build.json
```
