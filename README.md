# @medixdeck/ui

> Shared React UI component library for MedixDeck, published as `@medixdeck/ui`.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)](https://www.typescriptlang.org/)
[![Chakra UI](https://img.shields.io/badge/Chakra%20UI-v3-teal)](https://chakra-ui.com/)
[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

`@medixdeck/ui` is a Vite library-mode package built with React 18, TypeScript 5, Chakra UI v3, semantic design tokens, and dual ESM/CJS output for npm publishing.

## Install

```bash
# Core UI library
npm install @medixdeck/ui @chakra-ui/react react react-dom

# Optional: If using RichTextInput (TipTap Rich Text Editor)
npm install @tiptap/react @tiptap/pm @tiptap/starter-kit @tiptap/extension-link @tiptap/extension-underline @tiptap/extension-text-align @tiptap/extension-placeholder
```

## Quick start

```tsx
import { Button, Logo, MedixProvider, Navbar, useThemeMode } from '@medixdeck/ui';

// Next.js App Router: mark this component "use client" when using hooks.
function ThemeToggle() {
  const { mounted, themeMode, toggleThemeMode } = useThemeMode();

  // Avoid hydration mismatch: next-themes resolves the theme after mount.
  if (!mounted) return null;

  return (
    <Button variant="solid" colorScheme="blue" onClick={toggleThemeMode}>
      Switch to {themeMode === 'dark' ? 'light' : 'dark'} mode
    </Button>
  );
}

export function App() {
  return (
    <MedixProvider defaultColorMode="light">
      <Navbar
        navItems={[{ label: 'Docs', href: '#docs' }]}
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

| Area              | Exports                                                                                                                                                                                                                                                                  |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Provider + theme  | `MedixProvider`, `useThemeMode`, `useIsDarkMode`, `useColorScheme`, `system`, `medixConfig`, token exports                                                                                                                                                               |
| Primitive         | `Button`, `IconButton`, `Badge`, `Avatar`, `AvatarGroup`, `Spinner`, `FullPageSpinner`, `Tag`, `Divider`, `Logo`                                                                                                                                                         |
| Form              | `Input`, `SearchInput`, `Textarea`, `Select`, `Checkbox`, `RadioGroup`, `Switch`, `FormControl`, `OTPInput`, `PinInput`, `PhoneInput`, `DatePicker`, `DateRangePicker`, `Calendar`, `Combobox`, `FileUpload`, `TagsInput`, `TagInput`, `RichTextInput`, `RichTextEditor` |
| Layout            | `Card`, `CardHeader`, `CardBody`, `CardFooter`, `StatCard`, `Container`, `SectionHeader`, `ThemeColorPalette`, `DashboardLayout`, `Footer`                                                                                                                               |
| Navigation        | `Navbar`, `Breadcrumb`, `Tabs`, `Pagination`, `Stepper`                                                                                                                                                                                                                  |
| Feedback          | `Alert`, `Skeleton`, `SkeletonText`, `SkeletonCard`, `Progress`, `Modal`, `Drawer`, `Tooltip`, `EmptyState`, `NotFoundPage`, `ServerErrorPage`, `Toaster`, `toast`, `dismissToast`, `CookieConsentBanner`, `PWAInstallPrompt`                                            |
| Data display      | `Accordion`, `TestimonialCard`, `BlogCard`, `DataTable`                                                                                                                                                                                                                  |
| Healthcare        | `DoctorCard`, `VitalBadge`, `AppointmentCard`                                                                                                                                                                                                                            |
| Chakra re-exports | `Box`, `Flex`, `Grid`, `Stack`, `Text`, `Heading`, `Link`, `Image`, `Icon`, `Center`, `Wrap`, `WrapItem`, others in `lib/index.ts`                                                                                                                                       |

## Design-system rules

- Use Chakra UI **v3** APIs only.
- All library source lives in `lib\`; `src\` is dev-preview only.
- Use semantic tokens such as `bg.surface`, `text.heading`, and `border` instead of raw hex for normal component styling.
- **No `boxShadow` / `shadow`**: Do NOT use `boxShadow`, `shadow`, `card-light`, or `card-dark` props. Rely on clean borders (`border="1px solid" borderColor="border"`) for visual separation.
- For color-critical interactive controls, prefer the repo's native-first pattern instead of Chakra recipes.
- Apply dark mode on `document.documentElement`, not an inner container.

## Theme hooks

```tsx
import { useIsDarkMode, useThemeMode } from '@medixdeck/ui';

function ThemeStatus() {
  const { themeMode, themeSetting, setThemeMode, toggleThemeMode } = useThemeMode();
  const isDarkMode = useIsDarkMode();

  return (
    <>
      <p>Resolved mode: {themeMode}</p>
      <p>Following: {themeSetting ?? 'system'}</p>
      <p>Dark mode active: {String(isDarkMode)}</p>
      <button onClick={() => setThemeMode('dark')}>Dark</button>
      <button onClick={() => setThemeMode('light')}>Light</button>
      <button onClick={() => setThemeMode('system')}>System</button>
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

| Field               | Type                 | Description                      |
| ------------------- | -------------------- | -------------------------------- |
| `colorScheme`       | `"blue" \| "purple"` | Currently active scheme          |
| `setColorScheme`    | `(scheme) => void`   | Explicit setter                  |
| `toggleColorScheme` | `() => void`         | Flips blue ↔ purple              |
| `isBlue`            | `boolean`            | `true` when scheme is `"blue"`   |
| `isPurple`          | `boolean`            | `true` when scheme is `"purple"` |

## Feedback & Overlays

### Toast Notifications

The MedixDeck UI includes a fully automated `Toast` system powered by Chakra UI v3's `createToaster` API, styled to match MedixDeck `Alert` components.

To use it, render the `<Toaster />` at the root of your application, and then use the `toast` helper to trigger notifications from anywhere.

```tsx
import { Toaster, toast } from '@medixdeck/ui';

function App() {
  return (
    <>
      <Toaster />
      <button onClick={() => toast.success('Changes saved successfully!')}>Save</button>
    </>
  );
}
```

The `toast` utility exposes `success`, `error`, `info`, and `warning` shorthand methods.

### Error Pages (404 & 500)

`NotFoundPage` and `ServerErrorPage` render beautifully styled full-screen error states. In the development environment (`process.env.NODE_ENV === "development"`), passing an `errorMessage` will render a technical code block. In production, this block is safely hidden to prevent data leakage.

```tsx
<ServerErrorPage
  errorMessage="TypeError: Cannot read properties of undefined (reading 'id')"
  onAction={() => reset()}
/>
```

## Data Display & Form Enhancements

### Accordion with HTML/Markdown

The `Accordion` supports passing rich text answers via the `answerType` prop. Use `"HTML"` (safely sanitized via `isomorphic-dompurify`) or `"MD"` (parsed via `react-markdown`).

```tsx
<Accordion
  answerType="MD"
  items={[{ id: 'q1', question: 'Markdown Support?', answer: 'Yes, **boldly** so!' }]}
/>
```

### Multiple Select

The `Select` component supports native multiple selection, returning arrays on change.

```tsx
<Select
  multiple
  placeholder="Select specialties..."
  options={[{ value: 'cardio', label: 'Cardiology' }]}
  onChange={(values) => console.log(values)} // values is string | string[]
/>
```

### Rich Text Input (`RichTextInput` / `RichTextEditor`)

A fully-featured rich text editor powered by TipTap (ProseMirror). Supports headings, formatting, lists, links, alignment, custom color schemes, character limit tracking, and height boundaries (`minHeight`, `maxHeight`).

Requires optional peer dependencies (`@tiptap/*`).

```tsx
import { RichTextInput } from '@medixdeck/ui';

function NotesForm() {
  const [content, setContent] = React.useState('<p>Initial clinical note...</p>');

  return (
    <RichTextInput
      label="Clinical Notes"
      value={content}
      onChange={setContent}
      colorScheme="purple"
      placeholder="Type clinical notes..."
      minHeight="180px"
      maxHeight="400px"
      showCharCount
      maxLength={1000}
    />
  );
}
```

## Navbar

The `Navbar` component provides responsive brand navigation with animated desktop dropdown menus and mobile accordion sub-menus.

### Basic & Dropdown Usage

```tsx
import { Navbar, type NavItem } from '@medixdeck/ui';

const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Services',
    children: [
      {
        label: 'Doctor Consultations',
        href: '/services/doctors',
        description: 'Connect with certified Nigerian medical practitioners 24/7.',
        badge: 'Popular',
      },
      {
        label: 'Homecare Visits',
        href: '/services/homecare',
        description: 'Personalized nursing and clinical care at your residence.',
      },
      {
        label: 'Medical Outreach',
        href: '/services/outreach',
        description: 'Community screening & corporate healthcare programs.',
      },
    ],
  },
  {
    label: 'Resources',
    children: [
      {
        label: 'Health Blog',
        href: '/blog',
        description: 'Wellness advice, clinical articles, and healthcare updates.',
      },
      {
        label: 'Developer API',
        href: 'https://docs.medixdeck.com',
        description: 'Public health API integration guides.',
        isExternal: true,
      },
    ],
  },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About Us', href: '/about' },
];

export function Header() {
  return (
    <Navbar
      navItems={navItems}
      ctaLabel="Talk to a Doctor"
      ctaHref="/consult"
      secondaryCtaLabel="Sign In"
      secondaryCtaHref="/login"
      isSticky
      colorScheme="blue"
    />
  );
}
```

### `NavItem` properties

| Prop          | Type                            | Description                                                   |
| ------------- | ------------------------------- | ------------------------------------------------------------- |
| `label`       | `string`                        | Display text for the item                                     |
| `href`        | `string`                        | Target URL (optional for dropdown triggers)                   |
| `children`    | `NavItem[]`                     | Nested items for desktop floating menus and mobile accordions |
| `description` | `string`                        | Subtitle text displayed below label in dropdown items         |
| `icon`        | `ReactNode`                     | Leading icon element                                          |
| `badge`       | `string \| number \| ReactNode` | Status tag or count (e.g. `"Popular"`, `"NDPR"`)              |
| `isActive`    | `boolean`                       | Highlights active route item                                  |
| `isExternal`  | `boolean`                       | Opens link in a new tab with an external arrow icon           |
| `onClick`     | `() => void`                    | Optional click callback                                       |

---

## DashboardLayout

```tsx
import { DashboardLayout } from '@medixdeck/ui';

<DashboardLayout
  colorScheme="purple"
  user={{ name: 'Dr. Okedi Williams', email: 'williams@medixdeck.com' }}
  navGroups={[
    {
      items: [
        { label: 'Home', href: '/', isActive: true },
        { label: 'Messages', href: '/messages', badge: 6 },
      ],
    },
    {
      groupLabel: 'Account',
      items: [
        { label: 'Profile', href: '/profile' },
        { label: 'Notifications', href: '/notifications', hasDot: true },
      ],
    },
  ]}
  onLogout={() => auth.signOut()}
  renderLink={(item, children) => <Link href={item.href}>{children}</Link>}
>
  {/* page content */}
</DashboardLayout>;
```

### Mobile bottom navigation (`mobileNavItems`)

A fixed bottom tab bar (mobile only, hidden on `md+`). Uses `react-icons/lu` or any icon component.

```tsx
import { LuHouse, LuMessageCircle, LuUser } from 'react-icons/lu';

<DashboardLayout
  mobileNavItems={[
    { label: 'Home', href: '/', icon: <LuHouse size={22} />, isActive: true },
    { label: 'Messages', href: '/messages', icon: <LuMessageCircle size={22} />, badge: 6 },
    { label: 'Profile', href: '/profile', icon: <LuUser size={22} /> },
  ]}
>
  {/* ... */}
</DashboardLayout>;
```

`DashboardMobileNavItem` props:

| Prop       | Type        | Required | Description                            |
| ---------- | ----------- | -------- | -------------------------------------- |
| `label`    | `string`    | ✓        | Text below the icon                    |
| `href`     | `string`    | ✓        | Unique key + navigation target         |
| `icon`     | `ReactNode` | ✓        | Icon (22 × 22 px recommended)          |
| `isActive` | `boolean`   | —        | Highlights the active tab              |
| `badge`    | `number`    | —        | Count bubble on icon (capped at `99+`) |

### Doctor score card (`scoreCard`)

Shown above the sidebar nav on **desktop only**. Only pass this prop for doctor-role users.

```tsx
<DashboardLayout
  scoreCard={{
    name: 'Dr. Okedi Williams',
    role: 'Cardiologist',
    avatarSrc: '/dr-okedi.jpg', // optional — initials fallback
    tier: 'gold', // "bronze" | "silver" | "gold" | "platinum" | "diamond"
    medixScore: 847,
    link: '/doctor/profile', // optional — makes the card clickable
  }}
>
  {/* ... */}
</DashboardLayout>
```

Tier colours:

| Tier       | Label colour | Avatar ring |
| ---------- | ------------ | ----------- |
| `bronze`   | `#92400E`    | `#D97706`   |
| `silver`   | `#475569`    | `#94A3B8`   |
| `gold`     | `#D97706`    | `#F59E0B`   |
| `platinum` | `#0284C7`    | `#38BDF8`   |
| `diamond`  | `#7C3AED`    | `#A78BFA`   |

### Greeting subtitle (`greetingSubtext`)

An optional second line below the greeting. The top bar expands from 64 px → 80 px automatically.

```tsx
<DashboardLayout
  greetingSubtext={`${new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })} · 8 consultations scheduled today`}
>
  {/* ... */}
</DashboardLayout>
```

### Automatic Test & Sandbox Environment Banner

`DashboardLayout` includes a built-in, cross-framework test & sandbox environment banner that displays **automatically by default** whenever the app runs in non-production environments (e.g. `localhost`, `*.vercel.app`, `*.netlify.app`, `*.pages.dev`, `*staging*`, `*sandbox*`, `*dev*`, `*test*`, or `NODE_ENV !== 'production'`).

It is completely safe across SSR and CSR runtimes (Next.js App/Pages Router, Vite + React, Remix, Astro, TanStack Start, SolidJS bridges) with zero hydration mismatches.

```tsx
// 1. Automatic Default: Displays automatically in local / staging / sandbox / preview environments
<DashboardLayout user={user} navGroups={navGroups}>
  {children}
</DashboardLayout>

// 2. Explicit Sandbox / Test / Staging Mode
<DashboardLayout environment="sandbox" user={user} navGroups={navGroups}>
  {children}
</DashboardLayout>

// 3. Custom Banner Configuration (custom message, custom badge label, action button, dismissible)
<DashboardLayout
  environmentBanner={{
    environment: 'sandbox',
    badgeLabel: 'SIMULATION LAB',
    message: 'Simulated clinical testing environment. Actions will not affect live patient records.',
    action: <a href="https://app.medixdeck.com">Switch to Live →</a>,
    dismissible: true,
    onDismiss: () => console.log('Banner closed'),
  }}
  user={user}
  navGroups={navGroups}
>
  {children}
</DashboardLayout>

// 4. Suppress banner completely in any environment
<DashboardLayout showEnvironmentBanner={false} user={user} navGroups={navGroups}>
  {children}
</DashboardLayout>

// 5. Or mark environment as production
<DashboardLayout environment="production" user={user} navGroups={navGroups}>
  {children}
</DashboardLayout>
```

`DashboardEnvironmentBannerConfig` props:

| Prop          | Type                                                                                                 | Default  | Description                                               |
| ------------- | ---------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------- |
| `environment` | `"auto" \| "production" \| "live" \| "sandbox" \| "test" \| "development" \| "staging" \| "preview"` | `"auto"` | Environment classification                                |
| `badgeLabel`  | `string`                                                                                             | auto     | Uppercase badge label (e.g., `"SANDBOX ENVIRONMENT"`)     |
| `message`     | `string`                                                                                             | auto     | Descriptive warning / notice text                         |
| `status`      | `"warning" \| "info" \| "error" \| "neutral"`                                                        | auto     | Visual color scheme (amber warning, blue info, red error) |
| `action`      | `ReactNode`                                                                                          | —        | Action link or button on the right                        |
| `dismissible` | `boolean`                                                                                            | `false`  | Shows a close (✕) button                                  |
| `onDismiss`   | `() => void`                                                                                         | —        | Called when the close button is clicked                   |

### Collapsible Sidebar (`collapsible`, `isCollapsed`, `onCollapseChange`)

On desktop (`md+`), `DashboardLayout` supports shrinking the sidebar into a compact icon rail (68px) and expanding it back to full width (220px). Supports both uncontrolled (`defaultCollapsed`) and controlled (`isCollapsed`, `onCollapseChange`) operation:

- **Toggle Buttons**: Built-in panel collapse icon buttons (◧ / ◨) placed in the sidebar header (next to logo when expanded, directly below the logo mark in collapsed rail mode; `collapseTogglePlacement="sidebar-header"` by default).
- **Icon Rail Transformation**: Logo collapses into the icon mark, navigation items become centered 40px icon pills with tooltips, and badges/dots are pinned on top-right.
- **Sub-Items Flyout**: Clicking a navigation item with sub-links in collapsed mode opens an anchored floating flyout popover menu.
- **Doctor Score Card Transformation**: Collapses smoothly into a centered circular clinician tier ring avatar with full tooltip metadata.

```tsx
// 1. Uncontrolled with default expanded or collapsed
<DashboardLayout collapsible={true} defaultCollapsed={false} user={user} navGroups={navGroups}>
  {children}
</DashboardLayout>;

// 2. Controlled collapse state
function App() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <DashboardLayout
      collapsible={true}
      isCollapsed={isCollapsed}
      onCollapseChange={setIsCollapsed}
      collapsedSidebarWidth={68}
      user={user}
      navGroups={navGroups}
    >
      {children}
    </DashboardLayout>
  );
}
```

### All `DashboardLayout` props

| Prop                      | Type                                               | Default                | Description                                       |
| ------------------------- | -------------------------------------------------- | ---------------------- | ------------------------------------------------- |
| `user`                    | `DashboardUser`                                    | —                      | Name, email, optional avatar                      |
| `navGroups`               | `DashboardNavGroup[]`                              | —                      | Sidebar navigation tree                           |
| `collapsible`             | `boolean`                                          | `true`                 | Enables collapsible sidebar icon rail             |
| `defaultCollapsed`        | `boolean`                                          | `false`                | Initial collapsed state (uncontrolled)            |
| `isCollapsed`             | `boolean`                                          | —                      | Controlled collapsed state                        |
| `onCollapseChange`        | `(collapsed: boolean) => void`                     | —                      | Fired when sidebar collapse state toggles         |
| `sidebarWidth`            | `number`                                           | `220`                  | Full sidebar width in px                          |
| `collapsedSidebarWidth`   | `number`                                           | `68`                   | Compact icon rail width in px                     |
| `collapseTogglePlacement` | `"sidebar-header" \| "topbar" \| "both" \| "none"` | `"sidebar-header"`     | Placement of collapse/expand toggle buttons       |
| `collapsedLogo`           | `ReactNode`                                        | `<Logo type="icon" />` | Custom logo displayed in collapsed mode           |
| `colorScheme`             | `"blue" \| "purple"`                               | `"blue"`               | Brand accent colour                               |
| `environment`             | `DashboardEnvironment`                             | `"auto"`               | Auto-detects test/sandbox/staging environments    |
| `showEnvironmentBanner`   | `boolean`                                          | auto                   | Force show (`true`) or suppress (`false`) banner  |
| `environmentBanner`       | `DashboardEnvironmentBannerConfig`                 | —                      | Detailed banner message, action, & dismiss config |
| `environmentBannerSlot`   | `ReactNode`                                        | —                      | Custom slot overriding the entire banner          |
| `logo`                    | `ReactNode`                                        | `<Logo />`             | Override the sidebar logo                         |
| `greeting`                | `string`                                           | auto                   | Override "Good morning / afternoon / evening"     |
| `greetingSubtext`         | `string`                                           | —                      | Subtitle line below the greeting                  |
| `mobileNavItems`          | `DashboardMobileNavItem[]`                         | —                      | Mobile bottom tab bar items                       |
| `scoreCard`               | `DashboardScoreCardData`                           | —                      | Doctor identity card (desktop only)               |
| `topBarSlot`              | `ReactNode`                                        | —                      | Slot right of greeting (search, bell, etc.)       |
| `dropdownItems`           | `DashboardDropdownItem[]`                          | —                      | Extra user dropdown items                         |
| `renderLink`              | `(item, children) => ReactNode`                    | `<a>`                  | Router integration                                |
| `onLogout`                | `() => void`                                       | —                      | Logout callback                                   |

## Footer

The `Footer` component provides the core navigation layout for the bottom of pages. It features an optional compliance `certifications` row and a brandable `colorScheme`.

```tsx
import { Footer } from '@medixdeck/ui';

<Footer
  colorScheme="purple"
  certifications={[
    { name: 'NDPR Compliant', href: 'https://nitda.gov.ng' },
    { name: 'MDCN Certified Platform', href: 'https://mdcn.gov.ng' },
    { name: 'ISO 27001', href: '#' },
  ]}
/>;
```

| Prop             | Type                            | Default    | Description                                     |
| ---------------- | ------------------------------- | ---------- | ----------------------------------------------- |
| `colorScheme`    | `"blue" \| "purple"`            | `"blue"`   | Brand accent colour for links and social icons  |
| `certifications` | `FooterCertification[]`         | —          | Compliance badges displayed above the copyright |
| `logo`           | `ReactNode`                     | `<Logo />` | Override the default logo                       |
| `description`    | `string`                        | —          | Short company bio                               |
| `sections`       | `FooterSection[]`               | —          | Link columns                                    |
| `socialLinks`    | `SocialLink[]`                  | —          | Social media URLs                               |
| `newsletter`     | `NewsletterProps`               | —          | Email subscription form config                  |
| `bottomLinks`    | `BottomLink[]`                  | —          | Terms/Privacy links next to copyright           |
| `renderLink`     | `(item, children) => ReactNode` | `<a>`      | Router integration                              |

## Theme color reference

```tsx
import { ThemeColorPalette } from '@medixdeck/ui';

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
