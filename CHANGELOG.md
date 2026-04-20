# Changelog

All notable changes to `@medixdeck/ui` are documented here.

---

## [0.1.5] — 2026-04-20

### Added

- **`DashboardLayout` Component**: A comprehensive and responsive layout shell. Supports dynamic navigation groups, a user profile dropdown, configurable sidebar sizing, custom top-bar slots, and built-in native active/hover states with full `next-themes` dark mode compatibility.
- **Navbar Layout Controls**: Added `navItemsAlign` prop to the `Navbar` to support `left`, `center` (default), and `right` alignment for desktop navigation links.
- **Accessibility Improvements**: Added missing `role="menu"` and `role="menuitem"` aria attributes along to the user dropdown menu, and properly coupled the menu trigger and container via `aria-controls` for assistive technology compliance.

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

  | Prop | Description |
  | --- | --- |
  | `ctaHref` | URL for the primary label button (anchor navigation) |
  | `onCtaClick` | Handler for the primary label button click |
  | `ctaIconHref` | URL for the `↗` icon button; falls back to `ctaHref` |
  | `onCtaIconClick` | Handler for the icon button; falls back to `onCtaClick` |
  | `secondaryCtaLabel` | Text for a ghost button to the left of the primary CTA |
  | `secondaryCtaHref` | URL for the secondary CTA |
  | `onSecondaryCtaClick` | Handler for the secondary CTA |
  | `ctaSlot` | ReactNode that fully replaces the default CTA area |

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
