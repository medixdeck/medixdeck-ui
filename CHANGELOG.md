# Changelog

All notable changes to `@medixdeck/ui` are documented here.

---

## [0.1.17] — 2026-06-07

### Added

- **`Footer` — WhatsApp support**: Added `whatsapp` to `SocialLink` supported types with corresponding MedixDeck brand icon.

### Fixed

- **`Calendar` / `DatePicker` / `DateRangePicker` — Form submission bug**: Fixed a critical issue where clicking calendar days or navigation arrows would instantly submit enclosing forms. Explicitly assigned `type="button"` to all internal Chakra UI interactive elements.
- **`DatePicker` & `DateRangePicker` — Z-Index**: Increased popover `zIndex` to `"popover"` to ensure calendars aren't hidden behind Modals or sticky Navbars.
- **`Toast` — Mobile layout overflow**: Fixed an issue where Toasts would horizontally stretch off-screen on mobile devices by adjusting `maxW` constraints and applying proper inset bounds.
- **`Select` / `Toast` / `Wrap` (Storybook)**: Addressed legacy Chakra v2 property usage in internal Storybook definitions (e.g. replacing `spacing` with `gap` and removing unsupported helper props).

- **`Select` — Multiple selection support** (`multiple` prop)
  - Added support for `multiple={true}` to the `Select` component.
  - The `value`, `defaultValue`, and `onChange` types now accept and return `string | string[]` seamlessly matching Chakra UI v3 NativeSelect behavior.

- **`Accordion` — Rich Text formatting** (`answerType` prop)
  - Added the `answerType?: "HTML" | "MD"` prop to handle rich text strings.
  - Uses `isomorphic-dompurify` for safely sanitizing HTML answers.
  - Uses `react-markdown` for parsing MD answers.
  - Retains direct React Node support.

- **`Toast` — Auto-dismissing notifications**
  - Replaced the custom framer-motion notification observer with a robust Chakra UI v3 `createToaster` implementation.
  - Added `lib/components/feedback/Toast.tsx` built directly on `<ToastRoot asChild>` to fully inherit MedixDeck `Alert` visual styling (status colors, icons, layout).
  - Maintained backwards-compatible exports (`toast()`, `toast.success()`, etc.) to prevent breaking changes for existing consumers.

### Changed

- **`Select` — Type safety and form properties**
  - Explicity mapped `value`, `defaultValue`, `onChange`, `name`, `id`, `onBlur`, and `onFocus` straight to `<ChakraNativeSelect.Field>`.
  - Shifted `disabled` to `<ChakraNativeSelect.Root>` conforming to Chakra UI v3 form API.
  - Addressed TypeScript definition conflict allowing both fully controlled and uncontrolled usage paradigms.

- **`NotFoundPage` & `ServerErrorPage` — Environment lockdown**
  - Implemented `declare const process: any;` trick to allow Next.js/Vite build-time static replacement of `process.env.NODE_ENV` without causing TypeScript `Cannot find name 'process'` errors.
  - The technical `errorMessage` block now only renders when `process.env.NODE_ENV === "development"`, keeping production UI clean.
  - Added an optional `errorMessage` prop to `NotFoundPage` matching `ServerErrorPage`.

---

## [0.1.16] — 2026-05-28

### Added

- **`PWAInstallPrompt` — Delayed prompt behavior**
  - Added `delaySeconds` to allow deferring the prompt appearance after conditions are met (e.g. `delaySeconds={5}`).

---

## [0.1.15] — 2026-05-27

### Changed

- **Runtime requirement**
  - Updated `engines.node` to `>=20.16` in `package.json`.

### Added

- **`Select` — Icon support** (`icon` prop)

  Added an optional `icon` prop to the `Select` component to render a left-aligned icon, automatically adjusting the select field's padding.

  ```tsx
  import { LuWallet } from 'react-icons/lu';

  <Select
    icon={<LuWallet size={16} />}
    placeholder="Any price"
    options={[
      { value: '0-50', label: '$0 - $50' },
      { value: '50-100', label: '$50 - $100' },
    ]}
  />;
  ```

- **`DashboardLayout` — Mobile bottom navigation bar** (`mobileNavItems` prop)

  A fixed, glass-morphism bottom tab bar for mobile viewports (hidden on `md+`). Designed to match native-app UX.

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

  | `DashboardMobileNavItem` prop | Type        | Description                                     |
  | ----------------------------- | ----------- | ----------------------------------------------- |
  | `label`                       | `string`    | Text shown below the icon                       |
  | `href`                        | `string`    | Key + target URL (via `renderLink`)             |
  | `icon`                        | `ReactNode` | Icon element (22 × 22 recommended)              |
  | `isActive?`                   | `boolean`   | Highlights the active tab with a pill indicator |
  | `badge?`                      | `number`    | Count bubble on the icon (capped at `99+`)      |

  Implementation highlights:
  - Entrance animation via CSS keyframe `slideUpNav` injected once into `document.head`
  - Active tab: `framer-motion` spring-animated pill behind the icon
  - Press feedback: `whileTap={{ scale: 0.88 }}`
  - iPhone notch: `padding-bottom: env(safe-area-inset-bottom, 0px)`
  - Page bottom padding auto-increases to `pb="20"` on mobile when `mobileNavItems` is set

- **`DashboardLayout` — Doctor identity / score card** (`scoreCard` prop)

  Optional clinician card above the sidebar nav on desktop only (`display={{ base: "none", md: "block" }}`). Intended for doctor-role users.

  ```tsx
  <DashboardLayout
    scoreCard={{
      name: 'Dr. Okedi Williams',
      role: 'Cardiologist',
      avatarSrc: '/dr-okedi.jpg', // optional — falls back to initials
      tier: 'gold', // "bronze" | "silver" | "gold" | "platinum" | "diamond"
      medixScore: 847,
      link: '/doctor/profile', // optional — makes the card clickable via renderLink
    }}
  >
    {/* ... */}
  </DashboardLayout>
  ```

  Tier colour system:

  | Tier       | Badge / label colour | Avatar ring |
  | ---------- | -------------------- | ----------- |
  | `bronze`   | `#92400E`            | `#D97706`   |
  | `silver`   | `#475569`            | `#94A3B8`   |
  | `gold`     | `#D97706`            | `#F59E0B`   |
  | `platinum` | `#0284C7`            | `#38BDF8`   |
  | `diamond`  | `#7C3AED`            | `#A78BFA`   |

  New exported type: `DashboardScoreCardData`

- **`DashboardLayout` — Greeting subtitle** (`greetingSubtext` prop)

  Optional second line below the user's name in the top bar. Top bar height expands from 64 px to 80 px automatically.

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

- **`Footer` — Compliance certifications row** (`certifications` prop)

  An optional row rendered at the bottom of the Footer (just above the copyright section) to display compliance badges like NDPR, MDCN, ISO, etc.

  ```tsx
  <Footer
    certifications={[
      { name: 'NDPR Compliant', href: 'https://nitda.gov.ng', imageSrc: '/ndpr.png' },
      { name: 'MDCN Certified Platform', href: 'https://mdcn.gov.ng' },
      { name: 'ISO 27001', href: '#' },
    ]}
  />
  ```

  | `FooterCertification` prop | Type      | Description                                                |
  | -------------------------- | --------- | ---------------------------------------------------------- |
  | `name`                     | `string`  | Text displayed alongside the badge                         |
  | `href?`                    | `string`  | Optional URL for verification (wrapped in `renderLink`)    |
  | `isExternal?`              | `boolean` | Opens link in a new tab (`true` by default)                |
  | `imageSrc?`                | `string`  | Image URL. Falls back to a generic shield icon if omitted. |

- **`CookieConsentBanner` — GDPR / NDPR compliant banner**

  A customizable cookie consent banner powered by `react-cookie-consent`, pre-styled to match the MedixDeck design system.

  ```tsx
  <CookieConsentBanner
    title="Privacy & Cookies"
    acceptText="Accept All"
    declineText="Reject Non-Essential"
  >
    We use cookies to securely manage your session, enhance your browsing experience, and analyze
    our platform's performance. By clicking "Accept All", you consent to our use of cookies.
  </CookieConsentBanner>
  ```

- **`PWAInstallPrompt` — Cross-platform PWA install nudge**

  A Framer Motion–animated banner that detects platform and prompts users to install the app:
  - **Android / Chromium:** Captures the `beforeinstallprompt` event and triggers the native install dialog.
  - **iOS Safari:** Shows step-by-step "Add to Home Screen" instructions with a share icon visual.
  - Auto-hides when already installed (standalone mode).
  - Dismissals are persisted to `localStorage` with a configurable cooldown (default 14 days).

  ```tsx
  <PWAInstallPrompt
    appName="MedixDeck"
    title="Install MedixDeck"
    description="Get faster access and offline support."
    cooldownDays={14}
  />
  ```

  | `PWAInstallPromptProps` | Type                | Default              | Description                    |
  | ----------------------- | ------------------- | -------------------- | ------------------------------ |
  | `title`                 | `string`            | `"Install this app"` | Banner heading                 |
  | `description`           | `string`            | —                    | Body text (Android only)       |
  | `installLabel`          | `string`            | `"Install"`          | Accept button text             |
  | `dismissLabel`          | `string`            | `"Not now"`          | Dismiss button text            |
  | `cooldownDays`          | `number`            | `14`                 | Days to suppress after dismiss |
  | `appName`               | `string`            | `"this app"`         | Name used in iOS instructions  |
  | `icon`                  | `ReactNode`         | —                    | Custom app icon element        |
  | `position`              | `"top" \| "bottom"` | `"bottom"`           | Screen position                |
  | `onInstall`             | `() => void`        | —                    | Fired on successful install    |
  | `onDismiss`             | `() => void`        | —                    | Fired on dismiss               |

### Changed

- **`Footer`**: The default `copyright` text was updated to `"© {year} MedixDeck Health Solution Ltd. All Rights Reserved."`.
- **`DashboardLayout` stories**: Expanded with 8 new stories covering `WithMobileNav`, `WithDoctorScoreCard`, five tier-specific card variants, `WithGreetingSubtext`, and `FullDoctorDashboard`.
- **`Footer` stories**: Added `WithCertifications` story.
- **`CookieConsentBanner` and `PWAInstallPrompt` stories**: Added Storybook documentation for the new feedback components.
- **`lib/index.ts`**: `DashboardScoreCardData`, `FooterCertification`, `CookieConsentBannerProps`, and `PWAInstallPromptProps` added to public type exports.

---

## [0.1.14] — 2026-05-13

### Added

- **`colorScheme` prop on themed components**: `Navbar`, `Footer`, `Accordion`, and `BlogCard` now all accept a `colorScheme?: "blue" | "purple"` prop (default `"blue"`). Passing `"purple"` switches every brand accent on that component — CTA buttons, active/hover link colours, toggle icon fills, category pills, date badge numbers, social icon backgrounds, and the newsletter button — to the MedixDeck secondary purple (#7700CC) without changing any other behaviour or layout.

  | Component   | Affected elements                                                                          |
  | ----------- | ------------------------------------------------------------------------------------------ |
  | `Navbar`    | CTA buttons, hamburger/close icon fill, active & hover link colour, default `Logo` variant |
  | `Footer`    | Social icon backgrounds, newsletter submit button, input focus ring, nav link hover colour |
  | `Accordion` | Open-state toggle icon fill, card border hover accent                                      |
  | `BlogCard`  | Category pill background, date badge day-number colour                                     |

- **`useColorScheme` hook**: A new `lib/hooks/useColorScheme.ts` hook that manages the active brand colour scheme in React state and exposes helpers for updating it.

  ```tsx
  import { useColorScheme } from '@medixdeck/ui';

  const { colorScheme, setColorScheme, toggleColorScheme, isBlue, isPurple } = useColorScheme();
  // or start purple:
  const { colorScheme } = useColorScheme('purple');
  ```

  | Return value        | Type                 | Description             |
  | ------------------- | -------------------- | ----------------------- |
  | `colorScheme`       | `"blue" \| "purple"` | Currently active scheme |
  | `setColorScheme`    | `(scheme) => void`   | Explicit setter         |
  | `toggleColorScheme` | `() => void`         | Flips blue ↔ purple     |
  | `isBlue`            | `boolean`            | Convenience flag        |
  | `isPurple`          | `boolean`            | Convenience flag        |

- **New type exports**: `ColorScheme`, `UseColorSchemeResult`, `NavbarColorScheme`, `FooterColorScheme`, `AccordionColorScheme`, `BlogCardColorScheme` — all exported from `lib/index.ts`.

### Changed

- **`Navbar`**: When no `logo` prop is supplied the built-in `<Logo>` now automatically mirrors the active `colorScheme` (`variant="blue"` or `variant="purple"`).
- **`Footer`**: The newsletter submit button was converted from a Chakra `<Button>` to a native `<button>` element with `onMouseEnter/Leave` for hover, consistent with the library's native-first interactive component pattern (see `AGENTS.md §15`).
- **`Footer` `SocialIcons`**: Refactored from a static object of component functions to a factory `(iconColor: string) => ({...})` so the icon background colour is fully dynamic.

---

## [0.1.13] — 2026-05-03

### Added

- **`Calendar` Component**: Built a reusable, standalone Calendar component mimicking standard native behaviors, fully customized for MedixDeck UI with support for dynamic month navigation, active state highlights, and muted secondary month days.
- **Error Pages**: Added `NotFoundPage` (404) and `ServerErrorPage` (500) components for standard application error handling. These are full-height layouts that developers can render inside their routing error boundaries.

### Changed

- **`DatePicker`**: Upgraded from a native `input type="date"` to a custom popover using the new `Calendar` component. It now handles dynamic absolute positioning, formatted string displays (e.g. "May 15, 2026"), and closes on outside click.
- **`DateRangePicker`**: Converted to utilize dual calendar popovers for both "Start date" and "End date" inputs. Clicking an input now triggers a localized `Calendar` picker rather than the native system widget.

## [0.1.12] — 2026-05-03

### Changed

- **`Pagination` Redesign**: Updated component styling to match the current MedixDeck design system.
  - Replaced icon-only navigation buttons with text labels and chevron icons (`< Prev`, `Next >`).
  - Switched the background of inactive page number buttons to `blue.100` (or tinted background in dark mode) instead of transparent, with primary blue text for higher contrast.
  - Removed borders from all pagination buttons and updated spacing.

## [0.1.11] — 2026-05-03

### Changed

- **`DoctorCard` Redesign & Variants**: Updated the component UI to precisely match MedixDeck design specifications.
  - Added `variant` prop (`"standard" | "compact" | "featured"`) for flexible layout options.
  - Added `experience` prop to cleanly display years of experience.
  - Integrated custom icons for the verified badge, rating star, and experience shield.
  - Enhanced layout alignment, borders, and typography across all variants.

## [0.1.10] — 2026-04-26

### Added

- **Logos** Added `logo-text-white.png`, `logo-text-blue.png`, `logo-text-purple.png`

## [0.1.9] — 2026-04-26

### Added

- **`ThemeColorPalette` component**: Added a built-in design-system color reference that shows MedixDeck semantic tokens in both light and dark mode plus the raw brand, status, and neutral token scales. Wired it into the dev preview and Storybook so developers can inspect the palette quickly.
- **`DashboardLayout` theme switcher**: Added a built-in top-right light/dark/system control powered by `useThemeMode`, matching the library's existing theme persistence and system-aware behavior.

### Changed

- **`Tabs` pill variant styling**: Updated the pill tabs to use a segmented-control treatment driven by MedixDeck semantic tokens so the component now reads correctly in both light and dark mode without changing its API or behavior.
- **Preview app routing**: Moved the theme color explorer out of `App.tsx` into a dedicated `/theme-colors` preview page and updated the default navbar to point to the new route.

## [0.1.8] — 2026-04-25

### Added

- **Theme hooks**: Exported `useThemeMode` and `useIsDarkMode` so consuming apps can read the resolved light/dark mode, inspect the current theme preference, and update the mode through the same `next-themes` integration used by the library.

## [0.1.7] — 2026-04-22

### Added

- **`Footer` Component**: A highly reusable, responsive footer with a brand area, custom navigation columns, newsletter subscription form, and inline branded SVG social media icons.
- **Theme Toggle**: Added a built-in dark/light mode icon toggle directly to the footer using `next-themes`.
- **Storybook Documentation**: Created comprehensive Storybook stories (`autodocs`) for layout components including `Footer`, `DashboardLayout`, and `Container`/`SectionHeader`.
- **`DashboardLayout` Component**: A comprehensive and responsive layout shell. Supports dynamic navigation groups, a user profile dropdown, configurable sidebar sizing, custom top-bar slots, and built-in native active/hover states with full `next-themes` dark mode compatibility.
- **Navbar Layout Controls**: Added `navItemsAlign` prop to the `Navbar` to support `left`, `center` (default), and `right` alignment for desktop navigation links.
- **Accessibility Improvements**: Improved accessibility support for the user dropdown menu, including adding the missing `role="menu"` attribute on the menu container.

### Changed

- Standardized npm package metadata, helper documentation, and publishing guidance.
- Synced the documented public API with the actual package entrypoint, including newer form and notification exports.
- Added publish-check guidance and workflow validation for build, test, and `npm pack --dry-run`.

## [0.1.2] — 2026-04-19

### Added

- **Storybook Interactive Documentation**: Fully configured `@storybook/react-vite` and deployed to dedicated UI subdomain.
- **Vitest Testing Infrastructure**: Enabled `@testing-library/react`, `jsdom`, and `@testing-library/jest-dom` for component unit tests natively using `vitest`.
- **Form Components**:
  - `DateRangePicker`: Date range selector with start/end bounds.
  - `Combobox`: Searchable dropdown select input.
  - `FileUpload`: Dedicated drag-and-drop file upload integration.
- **Developer Experience & UI Linkage**: Dev preview showcase (`App.tsx`) sections now display a context-sensitive "View in Storybook" badge using the `VITE_STORYBOOK_URL` fallback.
- **Programmatic Notification System**: Toaster setup.

### Fixed

- **Vercel/Amplify Storybook CI crash**: Disabled `vite-plugin-dts` specifically during `storybook build` so it no longer invokes `api-extractor` concurrently.
- **Vitest Type Declarations**: Fixed TS errors (e.g., `toBeInTheDocument` missing on `Assertion`) by updating `tsconfig.json` globals and modifying Vite test setup.
- **Storybook Autodocs Bugs**: Removed `autodoc` tags from DOM manipulating components (like `Navbar`, `Logo`) to stop static build processes from crashing on HMR.
- **Button Component**: Implemented safe standard color fallbacks resolving runtime type errors when passing unsupported variants.
- **BlogCard Styling**: Gradient placeholder correctly follows `borderRadius="card"` to prevent component overflow.

---

## [0.1.1] — 2026-04-18

### Changed

#### Navbar — full CTA overhaul + Framer Motion animations

- **New props for fine-grained CTA control:**

  | Prop                  | Description                                             |
  | --------------------- | ------------------------------------------------------- |
  | `ctaHref`             | URL for the primary label button (anchor navigation)    |
  | `onCtaClick`          | Handler for the primary label button click              |
  | `ctaIconHref`         | URL for the `↗` icon button; falls back to `ctaHref`    |
  | `onCtaIconClick`      | Handler for the icon button; falls back to `onCtaClick` |
  | `secondaryCtaLabel`   | Text for a ghost button to the left of the primary CTA  |
  | `secondaryCtaHref`    | URL for the secondary CTA                               |
  | `onSecondaryCtaClick` | Handler for the secondary CTA                           |
  | `ctaSlot`             | ReactNode that fully replaces the default CTA area      |

- Default desktop CTA now renders **`[label button]` `[↗ icon button]`** side-by-side, matching the MedixDeck brand design
- Mobile menu now shows the primary CTA as a full-width button (no icon button)
- The `↗` icon button auto-opens `_blank` when its `href` differs from the label button's

#### Framer Motion animations added to Navbar

- Mobile menu panel: slide-down + scale + fade with spring-like ease
- Mobile nav links: stagger-fade from left (45 ms between items)
- Mobile CTA area: slide-up + fade (delayed after links settle)
- Hamburger ↔ Close icon: rotate + scale crossfade via `AnimatePresence mode="wait"`

#### Brand color fixes (Native-First Interactive Components)

Chakra UI v3's recipe engine leaked default blue (`#3B82F6`) in interactive states. Affected components rebuilt as native HTML elements:

- **`Button` / `IconButton`** — native `<button>` with explicit brand hex hover/active/focus states
- **`Badge`** — pure `<span>` with a semantic status → color map; no Chakra recipe
- **`Checkbox`** — native `<input type="checkbox">` with custom visual overlay
- **`RadioGroup`** — native `<input type="radio">` per option with custom indicator
- **`Switch`** — native `role="switch"` with animated track + thumb

#### BlogCard redesign

- Updated layout matching the MedixDeck design (category pill, cover image, excerpt, read-time, author)

### Added

- `framer-motion` added as a dependency (`^12.x`) and optional peer dependency
- `MaybeLink` internal helper in `Navbar` — wraps a button in `<a>` only when `href` is provided
- Inline brand SVG icons for hamburger and close toggle in `Navbar` (no external file imports)
- `ctaSlot` prop pattern documented in `AGENTS.md`, `README.md`, and `CONTRIBUTING.md`

### Fixed

- Navbar dark mode: applying `className="dark"` note clarified — must be on `document.documentElement`
- TypeScript: all Framer Motion variants now typed with `Variants` and bezier tuple easing (required by FM v12)

---

## [0.1.0] — 2026-04-18

### Added [0.1.0] — 2026-04-18

**Initial release** of the MedixDeck shared UI component library.

#### Primitive Components

- `Button` — solid, outline, ghost, secondary, link variants · xs–lg sizes · 5 color schemes (blue, purple, green, red, amber)
- `IconButton` — icon-only button with all Button variants
- `Badge` — status badges: success, warning, error, info, neutral · subtle/solid/outline variants
- `Avatar` — profile image with initials fallback · xs–2xl sizes · online status indicator
- `AvatarGroup` — stacked avatars with overflow counter
- `Spinner` / `FullPageSpinner` — loading animation in 5 sizes
- `Tag` — closeable/uncloseable filter chip with 6 color schemes
- `Divider` — horizontal/vertical separator with optional centered label

#### Form Components

- `Input` — text input with left/right icon support, error state
- `SearchInput` — search-styled input with magnifier icon
- `Textarea` — multi-line with character count display
- `Select` — native dropdown from `options[]` array
- `Checkbox` — with optional description text
- `RadioGroup` — from `options[]` with per-option description support
- `Switch` — toggle with label and description
- `FormControl` — universal wrapper adding label, helper text, required indicator, error message
- **`OTPInput` / `PinInput`** — one-time password boxes with keyboard navigation, paste support, mask mode
- **`PhoneInput`** — phone number input with country code flag selector (8 countries, defaults to Nigeria +234)
- **`DatePicker`** — styled native date/datetime input with focus/error states

#### Layout Components

- `Card` / `CardHeader` / `CardBody` / `CardFooter` — surface container system
- `StatCard` — KPI metric with trend arrow and percentage change
- `Container` — centered max-width page wrapper
- `SectionHeader` — eyebrow label + title + description heading block

#### Navigation Components

- `Navbar` — responsive with hamburger menu, sticky/blur/transparent modes, custom link renderer
- `Breadcrumb` — page path with custom separator and link renderer
- `Tabs` — line and pill variants with badge counter support
- `Pagination` — ellipsis logic, first/last buttons, compact mobile mode
- `Stepper` — multi-step horizontal/vertical flow progress indicator

#### Feedback & Overlay Components

- `Alert` — subtle/solid/left-accent variants · info/success/warning/error statuses · closable
- `Skeleton` / `SkeletonText` / `SkeletonCard` — shimmer loading placeholders
- `Progress` — progress bar with indeterminate animation mode
- `Modal` — dialog overlay using Chakra v3 compound Dialog API · xs–full sizes
- **`Drawer`** — slide-in panel using Chakra v3 compound Drawer API · left/right/top/bottom placement
- `Tooltip` — hover label using Chakra v3 compound Tooltip API
- `EmptyState` — zero-data screen with icon, title, description, and CTA

#### Data Display Components

- `Accordion` — FAQ with smooth animation, card and default variants
- `TestimonialCard` — patient/doctor quote with star rating and author info
- `BlogCard` — article preview with category badge, cover image, excerpt
- **`DataTable`** — responsive sortable table with loading skeleton rows, striped variant, empty state, row click handler

#### Healthcare-Specific Components

- `DoctorCard` — doctor profile with rating, consultation fee, Book/View actions, availability indicator, MDCN verified badge
- `VitalBadge` — vital sign display (blood pressure, SpO₂, heart rate) with normal/warning/critical status
- `AppointmentCard` — appointment summary with Join/Reschedule/Cancel actions for upcoming, completed, cancelled states

#### Design System

- Chakra UI v3 `createSystem` config with semantic tokens for light/dark mode
- MedixDeck brand palette: Primary Blue #0685FF, Secondary Purple #7700CC
- Satoshi font (Fontshare CDN) via `--font-body` and `--font-heading` CSS custom properties
- Semantic tokens: `bg`, `bg.subtle`, `bg.surface`, `text.heading`, `text.body`, `text.muted`, `border`, status colors

#### Developer Experience

- Full TypeScript declarations (`.d.ts`) generated alongside ESM + CJS output
- All component props exported as named interfaces with JSDoc
- Dev preview showcase (`src/App.tsx`) demonstrating all components
- `AGENTS.md` AI agent guide
- `CONTRIBUTING.md` developer contribution guide
- `CHANGELOG.md` (this file)

---

## Upcoming

- **[1.0.0]** — Stable public release on npm
